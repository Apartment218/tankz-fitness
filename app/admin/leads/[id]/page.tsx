import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageContainer,
  PageHeader,
} from "@/components/tankz-ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const inputClassName =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textareaClassName =
  "min-h-40 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const statusStyles = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "success",
  BOOKED: "success",
  WON: "success",
  LOST: "danger",
} as const;

const statusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  BOOKED: "Booked",
  WON: "Won",
  LOST: "Lost",
} as const;

type LeadStatusValue =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "BOOKED"
  | "WON"
  | "LOST";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optional(formData: FormData, name: string) {
  return readText(formData, name) || null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

async function updateLead(
  leadId: string,
  formData: FormData,
) {
  "use server";

  const rawStatus = readText(formData, "status");

  const allowedStatuses: LeadStatusValue[] = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "BOOKED",
    "WON",
    "LOST",
  ];

  const status = allowedStatuses.includes(
    rawStatus as LeadStatusValue,
  )
    ? (rawStatus as LeadStatusValue)
    : "NEW";

  await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status,
      assignedTo: optional(formData, "assignedTo"),
      notes: optional(formData, "notes"),
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

async function convertLeadToClient(leadId: string) {
  "use server";

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
  });

  if (!lead) {
    notFound();
  }

  const existingMember = await prisma.member.findUnique({
    where: {
      email: lead.email.toLowerCase(),
    },
  });

  if (existingMember) {
    await prisma.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        converted: true,
        status: "WON",
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${lead.id}`);
    revalidatePath("/admin/members");
    redirect(`/admin/members/${existingMember.id}`);
  }

  const member = await prisma.$transaction(async (tx) => {
    const createdMember = await tx.member.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName?.trim() || "Lead",
        email: lead.email.toLowerCase(),
        phone: lead.phone,
        goalDescription: lead.goal,
        notes: [
          lead.subject
            ? `Original enquiry: ${lead.subject}`
            : null,
          lead.message
            ? `Lead message: ${lead.message}`
            : null,
          lead.notes
            ? `Lead notes: ${lead.notes}`
            : null,
        ]
          .filter(Boolean)
          .join("\n\n") || null,
      },
    });

    await tx.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        converted: true,
        status: "WON",
      },
    });

    return createdMember;
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${lead.id}`);
  revalidatePath("/admin/members");

  redirect(`/admin/members/${member.id}`);
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const [lead, staff] = await Promise.all([
    prisma.lead.findUnique({
      where: {
        id,
      },
    }),

    prisma.staff.findMany({
      where: {
        active: true,
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    }),
  ]);

  if (!lead) {
    notFound();
  }

  const fullName = [lead.firstName, lead.lastName]
    .filter(Boolean)
    .join(" ");

  const assignedStaff = staff.find(
    (member) => member.id === lead.assignedTo,
  );

  return (
    <PageContainer>
      <PageHeader
        eyebrow="CRM lead"
        title={fullName}
        description="Review the enquiry, track progress and convert this lead into a client."
        actions={
          <>
            <Button
              href="/admin/leads"
              variant="outline"
            >
              Back to leads
            </Button>

            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600"
            >
              Email lead
            </a>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle>Lead details</CardTitle>
                  <CardDescription>
                    Submitted {formatDate(lead.createdAt)}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={statusStyles[lead.status]}>
                    {statusLabels[lead.status]}
                  </Badge>

                  {lead.converted ? (
                    <Badge variant="success">
                      Converted
                    </Badge>
                  ) : null}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <dl className="grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${lead.email}`}
                      className="font-bold text-zinc-950 transition hover:text-red-600"
                    >
                      {lead.email}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Phone
                  </dt>
                  <dd className="mt-2">
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                        className="font-bold text-zinc-950 transition hover:text-red-600"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-zinc-500">
                        Not provided
                      </span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Goal
                  </dt>
                  <dd className="mt-2 font-bold text-zinc-950">
                    {lead.goal ?? "Not specified"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Enquiry type
                  </dt>
                  <dd className="mt-2 font-bold text-zinc-950">
                    {lead.subject ?? "General enquiry"}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Assigned coach
                  </dt>
                  <dd className="mt-2 font-bold text-zinc-950">
                    {assignedStaff
                      ? `${assignedStaff.firstName} ${assignedStaff.lastName}`
                      : "Not assigned"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enquiry message</CardTitle>
              <CardDescription>
                The message submitted through the public
                Contact page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-line text-lg leading-8 text-zinc-700">
                {lead.message}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage lead</CardTitle>
              <CardDescription>
                Update the sales stage, assign a coach and save
                internal notes.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                action={updateLead.bind(null, lead.id)}
                className="space-y-5"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-zinc-700">
                    Lead status
                  </span>

                  <select
                    name="status"
                    defaultValue={lead.status}
                    className={inputClassName}
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">
                      Contacted
                    </option>
                    <option value="QUALIFIED">
                      Qualified
                    </option>
                    <option value="BOOKED">Booked</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-zinc-700">
                    Assign coach
                  </span>

                  <select
                    name="assignedTo"
                    defaultValue={lead.assignedTo ?? ""}
                    className={inputClassName}
                  >
                    <option value="">Not assigned</option>

                    {staff.map((member) => (
                      <option
                        key={member.id}
                        value={member.id}
                      >
                        {member.firstName} {member.lastName} —{" "}
                        {member.role}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-zinc-700">
                    Internal notes
                  </span>

                  <textarea
                    name="notes"
                    defaultValue={lead.notes ?? ""}
                    placeholder="Add follow-up notes, consultation details or next actions."
                    className={textareaClassName}
                  />
                </label>

                <Button type="submit">
                  Save lead
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convert to client</CardTitle>
              <CardDescription>
                Create a client record using this lead’s contact
                information and enquiry details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {lead.converted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="font-black text-emerald-900">
                    This lead has already been converted.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    Search for {lead.email} in the Clients
                    section to view the client record.
                  </p>

                  <Link
                    href="/admin/members"
                    className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
                  >
                    View clients
                  </Link>
                </div>
              ) : (
                <form
                  action={convertLeadToClient.bind(
                    null,
                    lead.id,
                  )}
                >
                  <Button
                    type="submit"
                    variant="danger"
                  >
                    Convert lead to client
                  </Button>

                  <p className="mt-3 text-xs leading-6 text-zinc-500">
                    If a client with this email already exists,
                    the lead will be linked by email instead of
                    creating a duplicate.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
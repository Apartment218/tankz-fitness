import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

type DeleteStaffPageProps = {
  params: Promise<{
    staffId: string;
  }>;
};

export default async function DeleteStaffPage({
  params,
}: DeleteStaffPageProps) {
  const { staffId } = await params;

  const staffMember = await prisma.staff.findUnique({
    where: {
      id: staffId,
    },
    include: {
      _count: {
        select: {
          sessions: true,
        },
      },
    },
  });

  if (!staffMember) {
    notFound();
  }

  const hasSessions = staffMember._count.sessions > 0;

  async function deleteStaffMember() {
    "use server";

    const existingStaff = await prisma.staff.findUnique({
      where: {
        id: staffId,
      },
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!existingStaff) {
      redirect("/admin/staff");
    }

    if (existingStaff._count.sessions > 0) {
      throw new Error(
        "This staff member cannot be deleted because they are assigned to class sessions.",
      );
    }

    await prisma.staff.delete({
      where: {
        id: staffId,
      },
    });

    revalidatePath("/admin/staff");
    revalidatePath("/admin/classes");
    revalidatePath("/admin/sessions");

    redirect("/admin/staff");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <Link
          href={`/admin/staff/${staffMember.id}`}
          className="font-bold text-red-600 hover:underline"
        >
          ← Back to staff profile
        </Link>

        <h1 className="mt-4 text-4xl font-black text-zinc-950">
          Delete Staff Member
        </h1>

        <p className="mt-2 text-lg text-zinc-600">
          Review this staff member before permanently deleting
          their profile.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 bg-red-50 p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Permanent action
          </p>

          <h2 className="mt-2 text-2xl font-black text-red-950">
            Delete {staffMember.firstName}{" "}
            {staffMember.lastName}?
          </h2>

          <p className="mt-3 leading-7 text-red-800">
            Deleting this profile cannot be undone. The staff
            member&apos;s contact details and account record
            will be permanently removed.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <dl className="grid gap-5 rounded-2xl bg-zinc-50 p-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-bold text-zinc-500">
                Staff member
              </dt>

              <dd className="mt-1 font-black text-zinc-950">
                {staffMember.firstName}{" "}
                {staffMember.lastName}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold text-zinc-500">
                Email address
              </dt>

              <dd className="mt-1 break-words font-semibold text-zinc-950">
                {staffMember.email}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold text-zinc-500">
                Role
              </dt>

              <dd className="mt-1 font-semibold text-zinc-950">
                {staffMember.role
                  .toLowerCase()
                  .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase(),
                  )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold text-zinc-500">
                Assigned sessions
              </dt>

              <dd className="mt-1 font-semibold text-zinc-950">
                {staffMember._count.sessions}
              </dd>
            </div>
          </dl>

          {hasSessions ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
              <h3 className="font-black text-amber-950">
                This staff member cannot be deleted
              </h3>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                This profile is connected to{" "}
                {staffMember._count.sessions} class{" "}
                {staffMember._count.sessions === 1
                  ? "session"
                  : "sessions"}{" "}
                and must remain in the database to preserve
                those records.
              </p>

              <p className="mt-3 text-sm font-semibold text-amber-900">
                You can edit the profile and mark the staff
                member as inactive instead.
              </p>

              <Link
                href={`/admin/staff/${staffMember.id}/edit`}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-amber-900 px-5 py-3 font-bold text-white transition hover:bg-amber-950"
              >
                Edit and Deactivate
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <h3 className="font-black text-red-950">
                Are you absolutely sure?
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-800">
                This profile has no assigned sessions, so it
                can be safely deleted. This action is
                permanent.
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href={`/admin/staff/${staffMember.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
            >
              Cancel
            </Link>

            {!hasSessions && (
              <form action={deleteStaffMember}>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 sm:w-auto"
                >
                  Permanently Delete
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
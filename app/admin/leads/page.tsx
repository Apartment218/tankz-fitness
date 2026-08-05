import Link from "next/link";

import {
  Badge,
  Card,
  CardContent,
  EmptyState,
  PageContainer,
  PageHeader,
  Section,
} from "@/components/tankz-ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const counts = {
    total: leads.length,
    new: leads.filter((lead) => lead.status === "NEW").length,
    qualified: leads.filter(
      (lead) => lead.status === "QUALIFIED",
    ).length,
    won: leads.filter((lead) => lead.status === "WON")
      .length,
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="CRM"
        title="Leads"
        description="View and manage enquiries submitted through the public Contact page."
        actions={
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-black text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            View contact page
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total leads",
            value: counts.total,
          },
          {
            label: "New",
            value: counts.new,
          },
          {
            label: "Qualified",
            value: counts.qualified,
          },
          {
            label: "Won",
            value: counts.won,
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm font-bold text-zinc-500">
                {item.label}
              </p>

              <p className="mt-3 font-display text-4xl text-zinc-950">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Section
        title="Recent enquiries"
        description={`${leads.length} lead${
          leads.length === 1 ? "" : "s"
        } stored in Tankz HQ.`}
      >
        {leads.length === 0 ? (
          <EmptyState
            title="No leads yet"
            description="New enquiries from the Contact page will appear here."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.15fr_1fr_1fr_.8fr_.8fr] gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-500 lg:grid">
              <span>Lead</span>
              <span>Contact</span>
              <span>Goal</span>
              <span>Status</span>
              <span>Received</span>
            </div>

            <div className="divide-y divide-zinc-200">
              {leads.map((lead) => {
                const fullName = [
                  lead.firstName,
                  lead.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Link
                    key={lead.id}
                    href={`/admin/leads/${lead.id}`}
                    className="grid gap-4 px-6 py-5 transition hover:bg-zinc-50 lg:grid-cols-[1.15fr_1fr_1fr_.8fr_.8fr] lg:items-center"
                  >
                    <div>
                      <p className="font-black text-zinc-950">
                        {fullName}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {lead.subject ?? "General enquiry"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-800">
                        {lead.email}
                      </p>

                      {lead.phone ? (
                        <p className="mt-1 text-sm text-zinc-500">
                          {lead.phone}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-800">
                        {lead.goal ?? "Not specified"}
                      </p>

                      {lead.converted ? (
                        <p className="mt-1 text-xs font-black uppercase tracking-wider text-emerald-600">
                          Converted to client
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <Badge
                        variant={
                          statusStyles[lead.status]
                        }
                      >
                        {statusLabels[lead.status]}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-600">
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
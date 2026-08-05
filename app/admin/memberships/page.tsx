import Link from "next/link";

import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

function getMembershipStatusClasses(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";

    case "PAUSED":
      return "bg-amber-100 text-amber-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    case "EXPIRED":
      return "bg-zinc-200 text-zinc-700";

    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function MembershipsPage() {
  const now = new Date();

  const [
    activeMemberships,
    pausedMemberships,
    expiredMemberships,
    totalPlans,
    memberships,
  ] = await Promise.all([
    prisma.membership.count({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: now,
        },
      },
    }),

    prisma.membership.count({
      where: {
        status: "PAUSED",
      },
    }),

    prisma.membership.count({
      where: {
        OR: [
          {
            status: "EXPIRED",
          },
          {
            endDate: {
              lt: now,
            },
          },
        ],
      },
    }),

    prisma.membershipPlan.count({
      where: {
        active: true,
      },
    }),

    prisma.membership.findMany({
      orderBy: [
        {
          status: "asc",
        },
        {
          endDate: "asc",
        },
      ],
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            durationDays: true,
            active: true,
          },
        },
      },
      take: 100,
    }),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Member Management
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
            Memberships
          </h1>

          <p className="mt-2 text-lg text-zinc-600">
            Review member plans, renewal dates, and membership statuses.
          </p>
        </div>

        <Link
          href="/admin/members"
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
        >
          View Members
        </Link>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Active
          </p>

          <p className="mt-3 text-4xl font-black text-emerald-600">
            {activeMemberships}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Paused
          </p>

          <p className="mt-3 text-4xl font-black text-amber-600">
            {pausedMemberships}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Expired
          </p>

          <p className="mt-3 text-4xl font-black text-zinc-700">
            {expiredMemberships}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Active Plans
          </p>

          <p className="mt-3 text-4xl font-black text-blue-600">
            {totalPlans}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2 className="text-2xl font-black text-zinc-950">
            Member Memberships
          </h2>

          <p className="mt-1 text-sm text-zinc-600">
            Showing up to 100 membership records.
          </p>
        </div>

        {memberships.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-black text-zinc-950">
              No memberships found
            </h3>

            <p className="mt-2 text-zinc-600">
              Membership records will appear here after they are assigned to
              members.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Member
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Plan
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Price
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Start
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    End
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-black uppercase tracking-wide text-zinc-500">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-right text-xs font-black uppercase tracking-wide text-zinc-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {memberships.map((membership) => {
                  const hasExpired = membership.endDate < now;

                  const displayedStatus =
                    hasExpired && membership.status === "ACTIVE"
                      ? "EXPIRED"
                      : membership.status;

                  return (
                    <tr
                      key={membership.id}
                      className="transition hover:bg-zinc-50"
                    >
                      <td className="whitespace-nowrap px-6 py-5">
                        <p className="font-bold text-zinc-950">
                          {membership.member.firstName}{" "}
                          {membership.member.lastName}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {membership.member.email}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5">
                        <p className="font-bold text-zinc-950">
                          {membership.plan.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {membership.plan.durationDays} days
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 font-bold text-zinc-950">
                        {currencyFormatter.format(
                          Number(membership.plan.price),
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-zinc-700">
                        {dateFormatter.format(membership.startDate)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-zinc-700">
                        {dateFormatter.format(membership.endDate)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getMembershipStatusClasses(
                            displayedStatus,
                          )}`}
                        >
                          {formatStatus(displayedStatus)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-right">
                        <Link
                          href={`/admin/members/${membership.member.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
                        >
                          View Member
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
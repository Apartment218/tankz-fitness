import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyles(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-200 text-green-950";

    case "PAUSED":
      return "bg-yellow-200 text-yellow-950";

    case "CANCELLED":
      return "bg-red-200 text-red-950";

    case "EXPIRED":
      return "bg-gray-200 text-gray-900";

    default:
      return "bg-blue-200 text-blue-950";
  }
}

export default async function MembershipReportPage() {
  const memberships = await prisma.membership.findMany({
    include: {
      member: true,
      plan: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  const statusCounts = memberships.reduce<Record<string, number>>(
    (counts, membership) => {
      counts[membership.status] =
        (counts[membership.status] ?? 0) + 1;

      return counts;
    },
    {},
  );

  const planCounts = memberships.reduce<
    Record<
      string,
      {
        name: string;
        count: number;
      }
    >
  >((counts, membership) => {
    const planId = membership.plan.id;

    if (!counts[planId]) {
      counts[planId] = {
        name: membership.plan.name,
        count: 0,
      };
    }

    counts[planId].count += 1;

    return counts;
  }, {});

  const popularPlans = Object.entries(planCounts)
    .map(([id, plan]) => ({
      id,
      name: plan.name,
      count: plan.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const activeCount = statusCounts.ACTIVE ?? 0;
  const pausedCount = statusCounts.PAUSED ?? 0;
  const cancelledCount = statusCounts.CANCELLED ?? 0;
  const expiredCount = statusCounts.EXPIRED ?? 0;

  const totalMemberships = memberships.length;

  const activePercentage =
    totalMemberships === 0
      ? 0
      : Math.round((activeCount / totalMemberships) * 100);

  const recentMemberships = memberships.slice(0, 20);

  return (
    <div className="mx-auto max-w-7xl text-black">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/reports"
            className="font-bold text-red-700 hover:underline"
          >
            ← Back to reports
          </Link>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Membership performance
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Membership Report
          </h1>

          <p className="mt-3 max-w-3xl text-lg font-medium text-gray-600">
            Review membership activity, current statuses, popular
            plans, and recently created memberships.
          </p>
        </div>

        <Link
          href="/admin/memberships"
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
        >
          View memberships
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-blue-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Total memberships
          </p>

          <p className="mt-2 text-3xl font-black">
            {totalMemberships}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            All membership records
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-green-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-black">
            {activeCount}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Currently active memberships
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-yellow-500 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Paused
          </p>

          <p className="mt-2 text-3xl font-black">
            {pausedCount}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Temporarily paused memberships
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-purple-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Active rate
          </p>

          <p className="mt-2 text-3xl font-black">
            {activePercentage}%
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Active versus all memberships
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Cancelled
              </p>

              <p className="mt-2 text-3xl font-black">
                {cancelledCount}
              </p>
            </div>

            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-800">
              Cancelled
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Expired
              </p>

              <p className="mt-2 text-3xl font-black">
                {expiredCount}
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800">
              Expired
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-black">
            Most popular plans
          </h2>

          <p className="mt-2 font-medium text-gray-600">
            Membership plans ranked by the number of membership
            records attached to them.
          </p>
        </div>

        {popularPlans.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No membership plan activity is available.
          </p>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {popularPlans.map((plan, index) => (
              <div
                key={plan.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-black text-blue-800">
                    {index + 1}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-700">
                    {plan.count}{" "}
                    {plan.count === 1
                      ? "membership"
                      : "memberships"}
                  </span>
                </div>

                <p className="mt-4 text-xl font-black">
                  {plan.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-black">
              Recent memberships
            </h2>

            <p className="mt-2 font-medium text-gray-600">
              The 20 most recently started membership records.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            {recentMemberships.length} shown
          </span>
        </div>

        {recentMemberships.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No memberships have been recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    Member
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Plan
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Start date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recentMemberships.map((membership) => {
                  const member = membership.member;

                  return (
                    <tr
                      key={membership.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-5">
                        {member ? (
                          <>
                            <Link
                              href={`/admin/members/${member.id}`}
                              className="font-bold text-blue-700 hover:underline"
                            >
                              {member.firstName} {member.lastName}
                            </Link>

                            <p className="mt-1 text-sm font-medium text-gray-500">
                              {member.email}
                            </p>
                          </>
                        ) : (
                          <p className="font-bold text-gray-700">
                            No member linked
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5 font-bold text-gray-800">
                        {membership.plan.name}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                            membership.status,
                          )}`}
                        >
                          {formatStatus(membership.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {formatDate(membership.startDate)}
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
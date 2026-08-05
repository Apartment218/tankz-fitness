import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyles(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-200 text-green-950";

    case "PENDING":
      return "bg-yellow-200 text-yellow-950";

    case "FAILED":
      return "bg-red-200 text-red-950";

    case "REFUNDED":
      return "bg-blue-200 text-blue-950";

    default:
      return "bg-gray-200 text-gray-900";
  }
}

export default async function RevenueReportPage() {
  const [
    paidSummary,
    paidCount,
    failedCount,
    refundedCount,
    totalPaymentCount,
    recentPayments,
    paymentsByMethod,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        status: "PAID",
        currency: "GBP",
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.payment.count({
      where: {
        status: "PAID",
      },
    }),

    prisma.payment.count({
      where: {
        status: "FAILED",
      },
    }),

    prisma.payment.count({
      where: {
        status: "REFUNDED",
      },
    }),

    prisma.payment.count(),

    prisma.payment.findMany({
      include: {
        member: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    }),

    prisma.payment.groupBy({
      by: ["method"],
      where: {
        status: "PAID",
      },
      _count: {
        _all: true,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    }),
  ]);

  const totalRevenue = Number(paidSummary._sum.amount ?? 0);

  const paymentSuccessRate =
    totalPaymentCount === 0
      ? 0
      : Math.round((paidCount / totalPaymentCount) * 100);

  const averagePayment =
    paidCount === 0 ? 0 : totalRevenue / paidCount;

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

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            Financial performance
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Revenue Report
          </h1>

          <p className="mt-3 max-w-3xl text-lg font-medium text-gray-600">
            Review successful payments, failed transactions, refunds,
            payment methods, and recent financial activity.
          </p>
        </div>

        <Link
          href="/admin/payments"
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
        >
          View payments
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-green-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Total revenue
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(totalRevenue)}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Successful GBP payments
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-blue-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Paid payments
          </p>

          <p className="mt-2 text-3xl font-black">
            {paidCount}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Completed transactions
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-purple-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Average payment
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(averagePayment)}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Across successful payments
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-orange-500 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Success rate
          </p>

          <p className="mt-2 text-3xl font-black">
            {paymentSuccessRate}%
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Paid versus all payments
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Failed
              </p>

              <p className="mt-2 text-3xl font-black">
                {failedCount}
              </p>
            </div>

            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-800">
              Attention
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Refunded
              </p>

              <p className="mt-2 text-3xl font-black">
                {refundedCount}
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
              Returned
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                All payments
              </p>

              <p className="mt-2 text-3xl font-black">
                {totalPaymentCount}
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800">
              Total
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-black">
            Revenue by payment method
          </h2>

          <p className="mt-2 font-medium text-gray-600">
            Successful payments grouped by the method used.
          </p>
        </div>

        {paymentsByMethod.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No successful payments are available.
          </p>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {paymentsByMethod.map((paymentMethod) => {
              const methodName = paymentMethod.method
                ? formatStatus(paymentMethod.method)
                : "Not specified";

              return (
                <div
                  key={paymentMethod.method ?? "not-specified"}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <p className="font-bold text-gray-600">
                    {methodName}
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {formatCurrency(
                      Number(paymentMethod._sum.amount ?? 0),
                    )}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {paymentMethod._count._all}{" "}
                    {paymentMethod._count._all === 1
                      ? "payment"
                      : "payments"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-black">
              Recent payment activity
            </h2>

            <p className="mt-2 font-medium text-gray-600">
              The 20 most recently recorded payments.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            {recentPayments.length} shown
          </span>
        </div>

        {recentPayments.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No payment activity has been recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    Member
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Amount
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Method
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Description
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recentPayments.map((payment) => {
                  const member = payment.member;

                  return (
                    <tr
                      key={payment.id}
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
                          <>
                            <p className="font-bold text-gray-800">
                              No member linked
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-500">
                              Manual or guest payment
                            </p>
                          </>
                        )}
                      </td>

                      <td className="px-6 py-5 font-black">
                        {formatCurrency(
                          Number(payment.amount),
                          payment.currency,
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                            payment.status,
                          )}`}
                        >
                          {formatStatus(payment.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {payment.method
                          ? formatStatus(payment.method)
                          : "Not specified"}
                      </td>

                      <td className="max-w-xs px-6 py-5 font-medium text-gray-700">
                        {payment.description ?? "—"}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {formatDateTime(
                          payment.paidAt ?? payment.createdAt,
                        )}
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
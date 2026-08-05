import Link from "next/link";

import {
  MemberStatus,
  MembershipStatus,
  PaymentStatus,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number, currency = "GBP") {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function getPaymentStatusStyles(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    case "REFUNDED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default async function AdminDashboard() {
  const [
    totalMembers,
    activeMembers,
    activeMemberships,
    totalProducts,
    lowStockProducts,
    totalClasses,
    totalBookings,
    revenueResult,
    recentMembers,
    recentPayments,
    lowStockItems,
  ] = await Promise.all([
    prisma.member.count(),

    prisma.member.count({
      where: {
        status: MemberStatus.ACTIVE,
      },
    }),

    prisma.membership.count({
      where: {
        status: MembershipStatus.ACTIVE,
      },
    }),

    prisma.product.count({
      where: {
        active: true,
      },
    }),

    prisma.product.count({
      where: {
        active: true,
        stock: {
          lte: 5,
        },
      },
    }),

    prisma.fitnessClass.count(),

    prisma.booking.count(),

    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.PAID,
        currency: "GBP",
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.member.findMany({
      orderBy: {
        joinedAt: "desc",
      },
      take: 5,
      include: {
        memberships: {
          where: {
            status: {
              in: [
                MembershipStatus.ACTIVE,
                MembershipStatus.PAUSED,
              ],
            },
          },
          include: {
            plan: true,
          },
          orderBy: {
            startDate: "desc",
          },
          take: 1,
        },
      },
    }),

    prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),

    prisma.product.findMany({
      where: {
        active: true,
        stock: {
          lte: 5,
        },
      },
      orderBy: [
        {
          stock: "asc",
        },
        {
          name: "asc",
        },
      ],
      take: 5,
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
      },
    }),
  ]);

  const revenue = Number(revenueResult._sum.amount ?? 0);

  const membershipCoverage =
    totalMembers > 0
      ? Math.round(
          (activeMemberships / totalMembers) * 100,
        )
      : 0;

  const cards = [
    {
      title: "Total Members",
      value: totalMembers.toLocaleString("en-GB"),
      description: `${activeMembers.toLocaleString(
        "en-GB",
      )} currently active`,
      colour: "border-l-blue-500",
      href: "/admin/members",
    },
    {
      title: "Active Memberships",
      value: activeMemberships.toLocaleString("en-GB"),
      description: `${membershipCoverage}% member coverage`,
      colour: "border-l-purple-500",
      href: "/admin/memberships",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(revenue),
      description: "All paid GBP transactions",
      colour: "border-l-green-500",
      href: "/admin/payments",
    },
    {
      title: "Bookings",
      value: totalBookings.toLocaleString("en-GB"),
      description: "All class bookings",
      colour: "border-l-pink-500",
      href: "/admin/attendance",
    },
    {
      title: "Active Products",
      value: totalProducts.toLocaleString("en-GB"),
      description:
        lowStockProducts > 0
          ? `${lowStockProducts} low-stock ${
              lowStockProducts === 1 ? "item" : "items"
            }`
          : "Stock levels healthy",
      colour:
        lowStockProducts > 0
          ? "border-l-orange-500"
          : "border-l-emerald-500",
      href: "/admin/products",
    },
    {
      title: "Fitness Classes",
      value: totalClasses.toLocaleString("en-GB"),
      description: "Classes available",
      colour: "border-l-red-600",
      href: "/admin/classes",
    },
  ];

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">
            Tankz HQ Dashboard
          </h1>

          <p className="mt-2 text-lg font-medium text-gray-600">
            Live performance and activity across Tankz
            Fitness.
          </p>
        </div>

        <p className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
          Updated{" "}
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date())}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`group rounded-2xl border border-gray-200 border-l-8 ${card.colour} bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-black">
                  {card.value}
                </h2>

                <p className="mt-2 font-medium text-gray-600">
                  {card.description}
                </p>
              </div>

              <span className="text-2xl font-bold text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-600">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>

          <p className="mt-1 font-medium text-gray-600">
            Common administrative tasks.
          </p>

          <div className="mt-6 grid gap-3">
            <Link
              href="/admin/members/new"
              className="rounded-lg bg-red-600 px-5 py-3 text-center font-bold text-white transition hover:bg-red-700"
            >
              Add Member
            </Link>

            <Link
              href="/admin/payments"
              className="rounded-lg border border-gray-300 px-5 py-3 text-center font-bold transition hover:border-red-500 hover:bg-red-50"
            >
              Record Payment
            </Link>

            <Link
              href="/admin/products"
              className="rounded-lg border border-gray-300 px-5 py-3 text-center font-bold transition hover:border-red-500 hover:bg-red-50"
            >
              Manage Products
            </Link>

            <Link
              href="/admin/attendance"
              className="rounded-lg border border-gray-300 px-5 py-3 text-center font-bold transition hover:border-red-500 hover:bg-red-50"
            >
              Manage Attendance
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Recent Members
              </h2>

              <p className="mt-1 font-medium text-gray-600">
                The newest people added to Tankz Fitness.
              </p>
            </div>

            <Link
              href="/admin/members"
              className="shrink-0 font-bold text-red-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recentMembers.map((member) => (
              <Link
                key={member.id}
                href={`/admin/members/${member.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-red-500 hover:bg-red-50"
              >
                <div>
                  <p className="font-bold">
                    {member.firstName} {member.lastName}
                  </p>

                  <p className="text-sm font-medium text-gray-600">
                    {member.email}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-semibold">
                    {member.memberships[0]?.plan.name ??
                      "No active membership"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Joined {formatDate(member.joinedAt)}
                  </p>
                </div>
              </Link>
            ))}

            {recentMembers.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                <p className="font-bold">
                  No members found
                </p>

                <p className="mt-1 text-sm font-medium text-gray-600">
                  New members will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Recent Payments
              </h2>

              <p className="mt-1 font-medium text-gray-600">
                Latest payment activity.
              </p>
            </div>

            <Link
              href="/admin/payments"
              className="shrink-0 font-bold text-red-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recentPayments.map((payment) => {
              const memberName = payment.member
                ? `${payment.member.firstName} ${payment.member.lastName}`
                : "Guest / Unassigned";

              return (
                <Link
                  key={payment.id}
                  href="/admin/payments"
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-red-500 hover:bg-red-50"
                >
                  <div>
                    <p className="font-bold">
                      {memberName}
                    </p>

                    <p className="text-sm font-medium text-gray-600">
                      {payment.reference ??
                        payment.description ??
                        "No reference"}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-bold">
                      {formatCurrency(
                        Number(payment.amount),
                        payment.currency,
                      )}
                    </p>

                    <div className="mt-1 flex items-center gap-2 sm:justify-end">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${getPaymentStatusStyles(
                          payment.status,
                        )}`}
                      >
                        {formatLabel(payment.status)}
                      </span>

                      <span className="text-xs font-medium text-gray-500">
                        {formatDateTime(
                          payment.paidAt ??
                            payment.createdAt,
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {recentPayments.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                <p className="font-bold">
                  No payments found
                </p>

                <p className="mt-1 text-sm font-medium text-gray-600">
                  New payments will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Low Stock
              </h2>

              <p className="mt-1 font-medium text-gray-600">
                Active products with five units or fewer.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="shrink-0 font-bold text-red-600 hover:underline"
            >
              Manage stock
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((product) => (
              <Link
                key={product.id}
                href="/admin/products"
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-orange-500 hover:bg-orange-50"
              >
                <div>
                  <p className="font-bold">
                    {product.name}
                  </p>

                  <p className="text-sm font-medium text-gray-600">
                    SKU: {product.sku ?? "Not assigned"}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-2xl font-black ${
                      product.stock === 0
                        ? "text-red-700"
                        : "text-orange-700"
                    }`}
                  >
                    {product.stock}
                  </p>

                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    {product.stock === 0
                      ? "Out of stock"
                      : "Remaining"}
                  </p>
                </div>
              </Link>
            ))}

            {lowStockItems.length === 0 && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-10 text-center">
                <p className="font-bold text-green-800">
                  Stock levels are healthy
                </p>

                <p className="mt-1 text-sm font-medium text-green-700">
                  No active products currently have five
                  units or fewer.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
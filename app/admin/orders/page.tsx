import Link from "next/link";

import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

function getOrderStatusClasses(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700";

    case "PENDING":
      return "bg-amber-100 text-amber-700";

    case "FAILED":
      return "bg-red-100 text-red-700";

    case "REFUNDED":
      return "bg-blue-100 text-blue-700";

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

export default async function OrdersPage() {
  const [
    totalOrders,
    pendingOrders,
    paidOrders,
    refundedOrders,
    orders,
  ] = await Promise.all([
    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.count({
      where: {
        status: "PAID",
      },
    }),

    prisma.order.count({
      where: {
        status: "REFUNDED",
      },
    }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
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
            Sales Management
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
            Orders
          </h1>

          <p className="mt-2 text-lg text-zinc-600">
            Review product sales, order totals, and payment statuses.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
        >
          View Products
        </Link>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Total Orders
          </p>

          <p className="mt-3 text-4xl font-black text-zinc-950">
            {totalOrders}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Pending
          </p>

          <p className="mt-3 text-4xl font-black text-amber-600">
            {pendingOrders}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Paid
          </p>

          <p className="mt-3 text-4xl font-black text-emerald-600">
            {paidOrders}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Refunded
          </p>

          <p className="mt-3 text-4xl font-black text-blue-600">
            {refundedOrders}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2 className="text-2xl font-black text-zinc-950">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-zinc-600">
            Showing up to 100 of the newest orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-black text-zinc-950">
              No orders found
            </h3>

            <p className="mt-2 text-zinc-600">
              Orders will appear here after products are sold.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Order
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Customer
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Items
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Total
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Date
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-black uppercase tracking-wide text-zinc-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {orders.map((order) => {
                  const itemCount = order.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  );

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-zinc-50"
                    >
                      <td className="whitespace-nowrap px-6 py-5">
                        <p className="font-bold text-zinc-950">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5">
                        {order.member ? (
                          <>
                            <Link
                              href={`/admin/members/${order.member.id}`}
                              className="font-bold text-zinc-950 transition hover:text-red-600 hover:underline"
                            >
                              {order.member.firstName}{" "}
                              {order.member.lastName}
                            </Link>

                            <p className="mt-1 text-sm text-zinc-500">
                              {order.member.email}
                            </p>
                          </>
                        ) : (
                          <p className="font-bold text-zinc-700">
                            Guest customer
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-bold text-zinc-950">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>

                        <div className="mt-1 max-w-sm text-sm text-zinc-500">
                          {order.items.length === 0 ? (
                            <span>No item records</span>
                          ) : (
                            <span>
                              {order.items
                                .slice(0, 3)
                                .map((item) => {
                                  return `${item.quantity}× ${item.product.name}`;
                                })
                                .join(", ")}

                              {order.items.length > 3
                                ? ` +${order.items.length - 3} more`
                                : ""}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 font-black text-zinc-950">
                        {currencyFormatter.format(Number(order.total))}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-zinc-700">
                        {dateFormatter.format(order.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getOrderStatusClasses(
                            order.status,
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
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
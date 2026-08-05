import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
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

export default async function ShopReportPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      include: {
        member: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.findMany({
      orderBy: [
        {
          stock: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
  ]);

  const totalOrders = orders.length;

  const paidOrders = orders.filter((order) => order.status === "PAID");
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  );
  const failedOrders = orders.filter(
    (order) => order.status === "FAILED",
  );
  const refundedOrders = orders.filter(
    (order) => order.status === "REFUNDED",
  );

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  const averageOrderValue =
    paidOrders.length === 0
      ? 0
      : totalRevenue / paidOrders.length;

  const totalItemsSold = paidOrders.reduce((orderTotal, order) => {
    const itemsInOrder = order.items.reduce(
      (itemTotal, item) => itemTotal + item.quantity,
      0,
    );

    return orderTotal + itemsInOrder;
  }, 0);

  const productSales = new Map<
    string,
    {
      id: string;
      name: string;
      sku: string | null;
      quantity: number;
      revenue: number;
    }
  >();

  for (const order of paidOrders) {
    for (const item of order.items) {
      const existingProduct = productSales.get(item.product.id);
      const itemRevenue =
        item.quantity * Number(item.unitPrice);

      if (existingProduct) {
        existingProduct.quantity += item.quantity;
        existingProduct.revenue += itemRevenue;
      } else {
        productSales.set(item.product.id, {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          revenue: itemRevenue,
        });
      }
    }
  }

  const bestSellingProducts = Array.from(productSales.values())
    .sort((firstProduct, secondProduct) => {
      if (secondProduct.quantity !== firstProduct.quantity) {
        return secondProduct.quantity - firstProduct.quantity;
      }

      return secondProduct.revenue - firstProduct.revenue;
    })
    .slice(0, 6);

  const lowStockProducts = products
    .filter((product) => product.active && product.stock <= 5)
    .slice(0, 10);

  const recentOrders = orders.slice(0, 20);

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

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
            Shop performance
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Shop Report
          </h1>

          <p className="mt-3 max-w-3xl text-lg font-medium text-gray-600">
            Review shop revenue, order activity, best-selling
            products, item sales, and low-stock products.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/orders"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-bold text-gray-900 hover:bg-gray-100"
          >
            View orders
          </Link>

          <Link
            href="/admin/products"
            className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
          >
            View products
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-green-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Shop revenue
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(totalRevenue)}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Revenue from paid orders
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-orange-500 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Total orders
          </p>

          <p className="mt-2 text-3xl font-black">
            {totalOrders}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            All order records
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-purple-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Average order
          </p>

          <p className="mt-2 text-3xl font-black">
            {formatCurrency(averageOrderValue)}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Average paid order value
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-blue-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Items sold
          </p>

          <p className="mt-2 text-3xl font-black">
            {totalItemsSold}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Items in paid orders
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Paid
              </p>

              <p className="mt-2 text-3xl font-black">
                {paidOrders.length}
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
              Complete
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-black">
                {pendingOrders.length}
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
              Waiting
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Failed
              </p>

              <p className="mt-2 text-3xl font-black">
                {failedOrders.length}
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
                {refundedOrders.length}
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
              Returned
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-black">
            Best-selling products
          </h2>

          <p className="mt-2 font-medium text-gray-600">
            Products ranked by the quantity sold in paid orders.
          </p>
        </div>

        {bestSellingProducts.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No paid product sales are available.
          </p>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {bestSellingProducts.map((product, index) => (
              <div
                key={product.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-black text-orange-800">
                    {index + 1}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-700">
                    {product.quantity} sold
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-black">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-gray-500">
                  {product.sku
                    ? `SKU: ${product.sku}`
                    : "No SKU"}
                </p>

                <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
                  <span className="font-medium text-gray-600">
                    Revenue
                  </span>

                  <span className="font-black text-green-700">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-black">
              Low-stock products
            </h2>

            <p className="mt-2 font-medium text-gray-600">
              Active products with five or fewer units remaining.
            </p>
          </div>

          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-800">
            {lowStockProducts.length} shown
          </span>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No active products are currently low in stock.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    Product
                  </th>

                  <th className="px-6 py-4 font-bold">
                    SKU
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Price
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Stock
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-bold text-gray-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-700">
                      {product.sku ?? "—"}
                    </td>

                    <td className="px-6 py-5 font-black">
                      {formatCurrency(Number(product.price))}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                          product.stock === 0
                            ? "bg-red-200 text-red-950"
                            : "bg-yellow-200 text-yellow-950"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} remaining`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-black">
              Recent orders
            </h2>

            <p className="mt-2 font-medium text-gray-600">
              The 20 most recently created shop orders.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            {recentOrders.length} shown
          </span>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No shop orders have been recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    Customer
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Items
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Total
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => {
                  const member = order.member;

                  const itemCount = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );

                  return (
                    <tr
                      key={order.id}
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
                              Guest customer
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-500">
                              No member linked
                            </p>
                          </>
                        )}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                      </td>

                      <td className="px-6 py-5 font-black">
                        {formatCurrency(Number(order.total))}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                            order.status,
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {formatDateTime(order.createdAt)}
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
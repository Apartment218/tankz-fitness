export default function ProductsLoading() {
  return (
    <div className="text-black">
      {/* Page header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-10 w-44 animate-pulse rounded-lg bg-gray-300" />

          <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-12 w-36 animate-pulse rounded-lg bg-gray-300" />
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-9 w-24 animate-pulse rounded bg-gray-300" />
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="h-12 min-w-72 flex-1 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-12 w-44 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-12 w-44 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Products table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b border-gray-300 bg-gray-100">
            <tr>
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "SKU",
                "Status",
                "Actions",
              ].map((column) => (
                <th
                  key={column}
                  className={`px-6 py-4 ${
                    column === "Actions" ? "text-right" : ""
                  }`}
                >
                  <div className="h-5 animate-pulse rounded bg-gray-300" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-6 py-5">
                  <div className="h-5 w-48 animate-pulse rounded bg-gray-300" />
                </td>

                <td className="px-6 py-5">
                  <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
                </td>

                <td className="px-6 py-5">
                  <div className="h-5 w-20 animate-pulse rounded bg-gray-300" />
                </td>

                <td className="px-6 py-5">
                  <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
                </td>

                <td className="px-6 py-5">
                  <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
                </td>

                <td className="px-6 py-5">
                  <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
                </td>

                <td className="px-6 py-5">
                  <div className="ml-auto h-5 w-28 animate-pulse rounded bg-gray-300" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 h-4 w-48 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
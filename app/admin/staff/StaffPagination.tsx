import Link from "next/link";

type StaffPaginationProps = {
  currentPage: number;
  totalPages: number;
  search?: string;
  role?: string;
  status?: string;
};

function createPageHref(
  page: number,
  search?: string,
  role?: string,
  status?: string,
) {
  const params = new URLSearchParams();

  params.set("page", page.toString());

  if (search) {
    params.set("search", search);
  }

  if (role && role !== "ALL") {
    params.set("role", role);
  }

  if (status && status !== "ALL") {
    params.set("status", status);
  }

  return `/admin/staff?${params.toString()}`;
}

export default function StaffPagination({
  currentPage,
  totalPages,
  search,
  role,
  status,
}: StaffPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <nav
      aria-label="Staff pagination"
      className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row"
    >
      <p className="text-sm font-semibold text-zinc-600">
        Page{" "}
        <span className="font-black text-zinc-950">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-black text-zinc-950">
          {totalPages}
        </span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={createPageHref(
              currentPage - 1,
              search,
              role,
              status,
            )}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 px-4 text-sm font-bold text-zinc-400">
            Previous
          </span>
        )}

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {pageNumbers.map((pageNumber) => {
            const isCurrentPage =
              pageNumber === currentPage;

            return isCurrentPage ? (
              <span
                key={pageNumber}
                aria-current="page"
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-red-600 px-3 text-sm font-black text-white"
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                key={pageNumber}
                href={createPageHref(
                  pageNumber,
                  search,
                  role,
                  status,
                )}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>

        {currentPage < totalPages ? (
          <Link
            href={createPageHref(
              currentPage + 1,
              search,
              role,
              status,
            )}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 px-4 text-sm font-bold text-zinc-400">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
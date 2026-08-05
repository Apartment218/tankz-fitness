import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  search?: string;
  membership?: string;
  status?: string;
};

function createPageUrl(
  page: number,
  search?: string,
  membership?: string,
  status?: string,
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (membership) {
    params.set("membership", membership);
  }

  if (status) {
    params.set("status", status);
  }

  params.set("page", String(page));

  return `/admin/members?${params.toString()}`;
}

export default function Pagination({
  currentPage,
  totalPages,
  search,
  membership,
  status,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <nav
      aria-label="Members pagination"
      className="mt-6 flex flex-wrap items-center justify-between gap-4"
    >
      <p className="font-medium text-gray-700">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(
              currentPage - 1,
              search,
              membership,
              status,
            )}
            className="rounded-lg border border-gray-400 bg-white px-4 py-2 font-bold text-gray-800 hover:bg-gray-100"
          >
            Previous
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-bold text-gray-400">
            Previous
          </span>
        )}

        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={createPageUrl(
              pageNumber,
              search,
              membership,
              status,
            )}
            aria-current={
              pageNumber === currentPage ? "page" : undefined
            }
            className={
              pageNumber === currentPage
                ? "rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
                : "rounded-lg border border-gray-400 bg-white px-4 py-2 font-bold text-gray-800 hover:bg-gray-100"
            }
          >
            {pageNumber}
          </Link>
        ))}

        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(
              currentPage + 1,
              search,
              membership,
              status,
            )}
            className="rounded-lg border border-gray-400 bg-white px-4 py-2 font-bold text-gray-800 hover:bg-gray-100"
          >
            Next
          </Link>
        ) : (
          <span className="cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-bold text-gray-400">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
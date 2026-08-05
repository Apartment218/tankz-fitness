import Link from "next/link";

import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

type SearchParams = Promise<{
  search?: string;
  status?: string;
  page?: string;
}>;

function buildBookingsUrl({
  search,
  status,
  page,
}: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (status?.trim()) {
    params.set("status", status.trim());
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query
    ? `/admin/bookings?${query}`
    : "/admin/bookings";
}

function formatBookingStatus(status: unknown) {
  return String(status)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusClasses(status: unknown) {
  const value = String(status).toUpperCase();

  if (
    value === "CONFIRMED" ||
    value === "ACTIVE" ||
    value === "PAID" ||
    value === "ATTENDED"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    value === "CANCELLED" ||
    value === "FAILED" ||
    value === "NO_SHOW"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    value === "PENDING" ||
    value === "WAITLISTED"
  ) {
    return "bg-orange-100 text-orange-700";
  }

  if (value === "REFUNDED") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;

  const search =
    resolvedSearchParams.search?.trim() ?? "";

  const selectedStatus =
    resolvedSearchParams.status?.trim() ?? "";

  const requestedPage = Number(
    resolvedSearchParams.page ?? "1",
  );

  const currentPage =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  const where = {
    ...(selectedStatus
      ? {
          status: selectedStatus as never,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              member: {
                firstName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              member: {
                lastName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              member: {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              session: {
                fitnessClass: {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [
    bookings,
    totalBookings,
    allStatuses,
    totalCount,
    upcomingCount,
    cancelledSessionCount,
  ] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        member: true,
        session: {
          include: {
            fitnessClass: true,
            trainer: true,
          },
        },
      },
      orderBy: {
        bookedAt: "desc",
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.booking.count({
      where,
    }),

    prisma.booking.findMany({
      select: {
        status: true,
      },
      distinct: ["status"],
      orderBy: {
        status: "asc",
      },
    }),

    prisma.booking.count(),

    prisma.booking.count({
      where: {
        session: {
          startsAt: {
            gte: new Date(),
          },
          cancelled: false,
        },
      },
    }),

    prisma.booking.count({
      where: {
        session: {
          cancelled: true,
        },
      },
    }),
  ]);

  const totalPages = Math.max(
    Math.ceil(totalBookings / PAGE_SIZE),
    1,
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  );

  const firstResult =
    totalBookings === 0
      ? 0
      : (safeCurrentPage - 1) * PAGE_SIZE + 1;

  const lastResult = Math.min(
    safeCurrentPage * PAGE_SIZE,
    totalBookings,
  );

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">
            Bookings
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            View bookings across every class session.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Total Bookings
          </p>

          <p className="mt-3 text-4xl font-black">
            {totalCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Upcoming
          </p>

          <p className="mt-3 text-4xl font-black">
            {upcomingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Cancelled Sessions
          </p>

          <p className="mt-3 text-4xl font-black">
            {cancelledSessionCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Matching Results
          </p>

          <p className="mt-3 text-4xl font-black">
            {totalBookings}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 lg:grid-cols-[1fr_240px_auto]">
          <label className="block">
            <span className="sr-only">
              Search bookings
            </span>

            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search member, email or class"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-500 focus:border-red-600"
            />
          </label>

          <label className="block">
            <span className="sr-only">
              Filter by status
            </span>

            <select
              name="status"
              defaultValue={selectedStatus}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
            >
              <option value="">All statuses</option>

              {allStatuses.map(({ status }) => (
                <option
                  key={String(status)}
                  value={String(status)}
                >
                  {formatBookingStatus(status)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
            >
              Filter
            </button>

            {(search || selectedStatus) && (
              <Link
                href="/admin/bookings"
                className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700 hover:bg-gray-100"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-black">
              Booking Records
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Showing {firstResult}–{lastResult} of{" "}
              {totalBookings}
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            Page {safeCurrentPage} of {totalPages}
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-bold text-gray-700">
              No bookings found
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Try changing the search or status filter.
            </p>

            {(search || selectedStatus) && (
              <Link
                href="/admin/bookings"
                className="mt-5 inline-flex rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
              >
                View All Bookings
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-gray-50 text-sm uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">
                      Member
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Class
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Session
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Trainer
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Status
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Booked
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => {
                    const sessionDate =
                      booking.session.startsAt.toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      );

                    const sessionTime =
                      booking.session.startsAt.toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-5">
                          <Link
                            href={`/admin/members/${booking.memberId}`}
                            className="font-bold hover:text-red-600 hover:underline"
                          >
                            {booking.member.firstName}{" "}
                            {booking.member.lastName}
                          </Link>

                          <p className="mt-1 text-sm text-gray-500">
                            {booking.member.email}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <Link
                            href={`/admin/classes/${booking.session.classId}`}
                            className="font-bold hover:text-red-600 hover:underline"
                          >
                            {
                              booking.session
                                .fitnessClass.name
                            }
                          </Link>

                          <p className="mt-1 text-sm text-gray-500">
                            {booking.session.room ??
                              "No room"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {sessionDate}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {sessionTime}
                          </p>

                          {booking.session.cancelled && (
                            <p className="mt-2 text-xs font-bold uppercase text-red-600">
                              Session cancelled
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {booking.session.trainer
                            ? `${booking.session.trainer.firstName} ${booking.session.trainer.lastName}`
                            : "Unassigned"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getStatusClasses(
                              booking.status,
                            )}`}
                          >
                            {formatBookingStatus(
                              booking.status,
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {booking.bookedAt.toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <Link
                            href={`/admin/sessions/${booking.sessionId}`}
                            className="font-bold text-red-600 hover:underline"
                          >
                            View Session
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-gray-200 lg:hidden">
              {bookings.map((booking) => {
                const sessionDate =
                  booking.session.startsAt.toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  );

                const sessionTime =
                  booking.session.startsAt.toLocaleTimeString(
                    "en-GB",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  );

                return (
                  <article
                    key={booking.id}
                    className="space-y-4 p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/admin/members/${booking.memberId}`}
                          className="text-lg font-black hover:text-red-600 hover:underline"
                        >
                          {booking.member.firstName}{" "}
                          {booking.member.lastName}
                        </Link>

                        <p className="mt-1 text-sm text-gray-500">
                          {booking.member.email}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getStatusClasses(
                          booking.status,
                        )}`}
                      >
                        {formatBookingStatus(
                          booking.status,
                        )}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          Class
                        </p>

                        <Link
                          href={`/admin/classes/${booking.session.classId}`}
                          className="mt-1 block font-bold hover:text-red-600 hover:underline"
                        >
                          {
                            booking.session
                              .fitnessClass.name
                          }
                        </Link>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          Session
                        </p>

                        <p className="mt-1 font-semibold">
                          {sessionDate} at {sessionTime}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          Trainer
                        </p>

                        <p className="mt-1 font-semibold">
                          {booking.session.trainer
                            ? `${booking.session.trainer.firstName} ${booking.session.trainer.lastName}`
                            : "Unassigned"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          Room
                        </p>

                        <p className="mt-1 font-semibold">
                          {booking.session.room ??
                            "No room"}
                        </p>
                      </div>
                    </div>

                    {booking.session.cancelled && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                        This session has been cancelled.
                      </div>
                    )}

                    <Link
                      href={`/admin/sessions/${booking.sessionId}`}
                      className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold hover:bg-gray-100"
                    >
                      View Session
                    </Link>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {safeCurrentPage > 1 ? (
              <Link
                href={buildBookingsUrl({
                  search,
                  status: selectedStatus,
                  page: safeCurrentPage - 1,
                })}
                className="inline-flex rounded-lg border border-gray-300 bg-white px-5 py-3 font-bold hover:bg-gray-100"
              >
                ← Previous
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-5 py-3 font-bold text-gray-400">
                ← Previous
              </span>
            )}
          </div>

          <p className="font-semibold text-gray-600">
            Page {safeCurrentPage} of {totalPages}
          </p>

          <div>
            {safeCurrentPage < totalPages ? (
              <Link
                href={buildBookingsUrl({
                  search,
                  status: selectedStatus,
                  page: safeCurrentPage + 1,
                })}
                className="inline-flex rounded-lg border border-gray-300 bg-white px-5 py-3 font-bold hover:bg-gray-100"
              >
                Next →
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-5 py-3 font-bold text-gray-400">
                Next →
              </span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
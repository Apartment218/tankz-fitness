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

function getStatusStyles(status: string) {
  switch (status) {
    case "ATTENDED":
      return "bg-green-200 text-green-950";

    case "CANCELLED":
      return "bg-red-200 text-red-950";

    case "NO_SHOW":
      return "bg-yellow-200 text-yellow-950";

    default:
      return "bg-blue-200 text-blue-950";
  }
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

export default async function AttendanceReportPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      member: true,
      session: {
        include: {
          fitnessClass: true,
        },
      },
    },
    orderBy: {
      bookedAt: "desc",
    },
  });

  const statusCounts = bookings.reduce<Record<string, number>>(
    (counts, booking) => {
      counts[booking.status] = (counts[booking.status] ?? 0) + 1;

      return counts;
    },
    {},
  );

  const totalBookings = bookings.length;
  const attendedCount = statusCounts.ATTENDED ?? 0;
  const cancelledCount = statusCounts.CANCELLED ?? 0;
  const noShowCount = statusCounts.NO_SHOW ?? 0;

  const otherBookingCount =
    totalBookings -
    attendedCount -
    cancelledCount -
    noShowCount;

  const attendanceRate =
    totalBookings === 0
      ? 0
      : Math.round((attendedCount / totalBookings) * 100);

  const classStats = new Map<
    string,
    {
      id: string;
      name: string;
      bookings: number;
      attended: number;
    }
  >();

  for (const booking of bookings) {
    const fitnessClass = booking.session.fitnessClass;
    const existingClass = classStats.get(fitnessClass.id);

    if (existingClass) {
      existingClass.bookings += 1;

      if (booking.status === "ATTENDED") {
        existingClass.attended += 1;
      }
    } else {
      classStats.set(fitnessClass.id, {
        id: fitnessClass.id,
        name: fitnessClass.name,
        bookings: 1,
        attended: booking.status === "ATTENDED" ? 1 : 0,
      });
    }
  }

  const popularClasses = Array.from(classStats.values())
    .sort((firstClass, secondClass) => {
      return secondClass.bookings - firstClass.bookings;
    })
    .slice(0, 6);

  const recentBookings = bookings.slice(0, 20);

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

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
            Attendance analytics
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Attendance Report
          </h1>

          <p className="mt-3 max-w-3xl text-lg font-medium text-gray-600">
            Review booking activity, class attendance, cancellations,
            no-shows, and the most popular fitness classes.
          </p>
        </div>

        <Link
          href="/admin/attendance"
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
        >
          View attendance
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-purple-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Total bookings
          </p>

          <p className="mt-2 text-3xl font-black">
            {totalBookings}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            All booking records
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-green-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Attended
          </p>

          <p className="mt-2 text-3xl font-black">
            {attendedCount}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Completed attendance
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-red-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Cancelled
          </p>

          <p className="mt-2 text-3xl font-black">
            {cancelledCount}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Cancelled bookings
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-yellow-500 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            No-shows
          </p>

          <p className="mt-2 text-3xl font-black">
            {noShowCount}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Members who did not attend
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 border-l-8 border-l-blue-600 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Attendance rate
          </p>

          <p className="mt-2 text-3xl font-black">
            {attendanceRate}%
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Attended versus all bookings
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Other booking statuses
            </p>

            <p className="mt-2 text-3xl font-black">
              {otherBookingCount}
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
            Current or pending
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-black">
            Most popular classes
          </h2>

          <p className="mt-2 font-medium text-gray-600">
            Fitness classes ranked by their total number of booking
            records.
          </p>
        </div>

        {popularClasses.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No class booking activity is available.
          </p>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {popularClasses.map((fitnessClass, index) => {
              const classAttendanceRate =
                fitnessClass.bookings === 0
                  ? 0
                  : Math.round(
                      (fitnessClass.attended /
                        fitnessClass.bookings) *
                        100,
                    );

              return (
                <div
                  key={fitnessClass.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-black text-purple-800">
                      {index + 1}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-700">
                      {fitnessClass.bookings}{" "}
                      {fitnessClass.bookings === 1
                        ? "booking"
                        : "bookings"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black">
                    {fitnessClass.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
                    <span className="font-medium text-gray-600">
                      Attendance rate
                    </span>

                    <span className="font-black text-green-700">
                      {classAttendanceRate}%
                    </span>
                  </div>
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
              Recent bookings
            </h2>

            <p className="mt-2 font-medium text-gray-600">
              The 20 most recently created class bookings.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            {recentBookings.length} shown
          </span>
        </div>

        {recentBookings.length === 0 ? (
          <p className="p-6 font-medium text-gray-600">
            No bookings have been recorded.
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
                    Class
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Session
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Booked
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking) => {
                  const member = booking.member;

                  return (
                    <tr
                      key={booking.id}
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
                              Booking has no member
                            </p>
                          </>
                        )}
                      </td>

                      <td className="px-6 py-5 font-bold text-gray-800">
                        {booking.session.fitnessClass.name}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {formatDateTime(booking.session.startsAt)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                            booking.status,
                          )}`}
                        >
                          {formatStatus(booking.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {formatDateTime(booking.bookedAt)}
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
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AttendancePage() {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const [
    todaySessions,
    upcomingSessions,
    completedSessions,
    attendedBookings,
    sessions,
  ] = await Promise.all([
    prisma.classSession.count({
      where: {
        cancelled: false,
        startsAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
    }),

    prisma.classSession.count({
      where: {
        cancelled: false,
        startsAt: {
          gt: now,
        },
      },
    }),

    prisma.classSession.count({
      where: {
        cancelled: false,
        endsAt: {
          lt: now,
        },
      },
    }),

    prisma.booking.count({
      where: {
        status: "ATTENDED",
      },
    }),

    prisma.classSession.findMany({
      where: {
        cancelled: false,
      },
      orderBy: {
        startsAt: "asc",
      },
      include: {
        fitnessClass: {
          select: {
            name: true,
          },
        },
        trainer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        bookings: {
          select: {
            status: true,
          },
        },
      },
      take: 30,
    }),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
          Class Management
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
          Attendance
        </h1>

        <p className="mt-2 text-lg text-zinc-600">
          Open a class session to record attendance and no-shows.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Today&apos;s Sessions
          </p>

          <p className="mt-3 text-4xl font-black text-zinc-950">
            {todaySessions}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Upcoming Sessions
          </p>

          <p className="mt-3 text-4xl font-black text-blue-600">
            {upcomingSessions}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Completed Sessions
          </p>

          <p className="mt-3 text-4xl font-black text-emerald-600">
            {completedSessions}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Total Attendances
          </p>

          <p className="mt-3 text-4xl font-black text-red-600">
            {attendedBookings}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2 className="text-2xl font-black text-zinc-950">
            Class Sessions
          </h2>

          <p className="mt-1 text-sm text-zinc-600">
            Showing the next available non-cancelled sessions.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-black text-zinc-950">
              No class sessions found
            </h3>

            <p className="mt-2 text-zinc-600">
              Create a class session before recording attendance.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Class
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Trainer
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-zinc-500">
                    Start
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-black uppercase tracking-wide text-zinc-500">
                    Booked
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-black uppercase tracking-wide text-zinc-500">
                    Attended
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center text-xs font-black uppercase tracking-wide text-zinc-500">
                    No-show
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-right text-xs font-black uppercase tracking-wide text-zinc-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {sessions.map((session) => {
                  const activeBookings = session.bookings.filter(
                    (booking) => booking.status !== "CANCELLED",
                  );

                  const attended = session.bookings.filter(
                    (booking) => booking.status === "ATTENDED",
                  ).length;

                  const noShows = session.bookings.filter(
                    (booking) => booking.status === "NO_SHOW",
                  ).length;

                  const trainerName = session.trainer
                    ? `${session.trainer.firstName} ${session.trainer.lastName}`
                    : "Unassigned";

                  return (
                    <tr
                      key={session.id}
                      className="transition hover:bg-zinc-50"
                    >
                      <td className="whitespace-nowrap px-6 py-5">
                        <p className="font-bold text-zinc-950">
                          {session.fitnessClass.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {session.room || "No room assigned"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-zinc-700">
                        {trainerName}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-zinc-700">
                        {dateTimeFormatter.format(session.startsAt)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-center">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                          {activeBookings.length}/{session.capacity}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-center">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                          {attended}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-center">
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                          {noShows}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-right">
                        <Link
                          href={`/admin/attendance/${session.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                        >
                          Manage
                        </Link>
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
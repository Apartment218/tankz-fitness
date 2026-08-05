import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

type SessionAttendancePageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const bookingStatuses = [
  "CONFIRMED",
  "WAITLISTED",
  "CANCELLED",
  "ATTENDED",
  "NO_SHOW",
] as const;

type BookingStatusValue = (typeof bookingStatuses)[number];

function isBookingStatus(value: string): value is BookingStatusValue {
  return bookingStatuses.some((status) => status === value);
}

function getStatusClasses(status: BookingStatusValue) {
  switch (status) {
    case "ATTENDED":
      return "bg-emerald-100 text-emerald-700";

    case "NO_SHOW":
      return "bg-amber-100 text-amber-800";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "WAITLISTED":
      return "bg-purple-100 text-purple-700";

    case "CANCELLED":
      return "bg-zinc-200 text-zinc-600";
  }
}

function formatStatus(status: BookingStatusValue) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function SessionAttendancePage({
  params,
}: SessionAttendancePageProps) {
  const { sessionId } = await params;

  async function updateBookingStatus(formData: FormData) {
    "use server";

    const bookingId = formData.get("bookingId");
    const status = formData.get("status");

    if (
      typeof bookingId !== "string" ||
      typeof status !== "string" ||
      !isBookingStatus(status)
    ) {
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        sessionId,
      },
      select: {
        id: true,
      },
    });

    if (!booking) {
      return;
    }

    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status,
      },
    });

    revalidatePath(`/admin/attendance/${sessionId}`);
    revalidatePath("/admin/attendance");
  }

  async function markAllAttended() {
    "use server";

    await prisma.booking.updateMany({
      where: {
        sessionId,
        status: {
          in: ["CONFIRMED", "NO_SHOW"],
        },
      },
      data: {
        status: "ATTENDED",
      },
    });

    revalidatePath(`/admin/attendance/${sessionId}`);
    revalidatePath("/admin/attendance");
  }

  async function markRemainingNoShows() {
    "use server";

    await prisma.booking.updateMany({
      where: {
        sessionId,
        status: "CONFIRMED",
      },
      data: {
        status: "NO_SHOW",
      },
    });

    revalidatePath(`/admin/attendance/${sessionId}`);
    revalidatePath("/admin/attendance");
  }

  async function resetAttendance() {
    "use server";

    await prisma.booking.updateMany({
      where: {
        sessionId,
        status: {
          in: ["ATTENDED", "NO_SHOW"],
        },
      },
      data: {
        status: "CONFIRMED",
      },
    });

    revalidatePath(`/admin/attendance/${sessionId}`);
    revalidatePath("/admin/attendance");
  }

  const session = await prisma.classSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      fitnessClass: {
        select: {
          name: true,
          description: true,
          durationMin: true,
        },
      },
      trainer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      bookings: {
        orderBy: {
          member: {
            lastName: "asc",
          },
        },
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    notFound();
  }

  const activeBookings = session.bookings.filter(
    (booking) => booking.status !== "CANCELLED",
  );

  const confirmedCount = session.bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  const attendedCount = session.bookings.filter(
    (booking) => booking.status === "ATTENDED",
  ).length;

  const noShowCount = session.bookings.filter(
    (booking) => booking.status === "NO_SHOW",
  ).length;

  const waitlistedCount = session.bookings.filter(
    (booking) => booking.status === "WAITLISTED",
  ).length;

  const recordedCount = attendedCount + noShowCount;

  const attendanceRate =
    recordedCount > 0
      ? Math.round((attendedCount / recordedCount) * 100)
      : 0;

  const trainerName = session.trainer
    ? `${session.trainer.firstName} ${session.trainer.lastName}`
    : "Unassigned";

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <Link
            href="/admin/attendance"
            className="text-sm font-bold text-red-600 transition hover:text-red-700 hover:underline"
          >
            ← Back to Attendance
          </Link>

          <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Session Attendance
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
            {session.fitnessClass.name}
          </h1>

          <p className="mt-2 text-lg text-zinc-600">
            {dateFormatter.format(session.startsAt)} at{" "}
            {timeFormatter.format(session.startsAt)}
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-black ${
            session.cancelled
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {session.cancelled ? "Cancelled" : "Active Session"}
        </span>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Booked
          </p>

          <p className="mt-3 text-4xl font-black text-zinc-950">
            {activeBookings.length}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Capacity: {session.capacity}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Attended
          </p>

          <p className="mt-3 text-4xl font-black text-emerald-600">
            {attendedCount}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            No-shows
          </p>

          <p className="mt-3 text-4xl font-black text-amber-600">
            {noShowCount}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Attendance Rate
          </p>

          <p className="mt-3 text-4xl font-black text-blue-600">
            {attendanceRate}%
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Based on recorded attendance
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2 className="text-2xl font-black text-zinc-950">
            Session Details
          </h2>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
              Trainer
            </p>

            <p className="mt-2 font-bold text-zinc-950">
              {trainerName}
            </p>

            {session.trainer?.email && (
              <p className="mt-1 text-sm text-zinc-500">
                {session.trainer.email}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
              Time
            </p>

            <p className="mt-2 font-bold text-zinc-950">
              {timeFormatter.format(session.startsAt)}–{timeFormatter.format(
                session.endsAt,
              )}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {session.fitnessClass.durationMin} minutes
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
              Room
            </p>

            <p className="mt-2 font-bold text-zinc-950">
              {session.room || "Not assigned"}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
              Waiting List
            </p>

            <p className="mt-2 font-bold text-zinc-950">
              {waitlistedCount}
            </p>
          </div>
        </div>

        {session.fitnessClass.description && (
          <div className="border-t border-zinc-200 px-6 py-5">
            <p className="text-sm leading-6 text-zinc-600">
              {session.fitnessClass.description}
            </p>
          </div>
        )}
      </section>

      {!session.cancelled && activeBookings.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-zinc-950">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Apply an attendance status to multiple bookings.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <form action={markAllAttended}>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 sm:w-auto"
              >
                Mark All Attended
              </button>
            </form>

            <form action={markRemainingNoShows}>
              <button
                type="submit"
                disabled={confirmedCount === 0}
                className="inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Mark Remaining No-shows
              </button>
            </form>

            <form action={resetAttendance}>
              <button
                type="submit"
                disabled={recordedCount === 0}
                className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Reset Attendance
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2 className="text-2xl font-black text-zinc-950">
            Member Attendance
          </h2>

          <p className="mt-1 text-sm text-zinc-600">
            Update each booked member&apos;s attendance status.
          </p>
        </div>

        {session.bookings.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-black text-zinc-950">
              No bookings found
            </h3>

            <p className="mt-2 text-zinc-600">
              There are currently no members booked onto this session.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {session.bookings.map((booking) => {
              const status = booking.status as BookingStatusValue;

              return (
                <article
                  key={booking.id}
                  className="grid gap-5 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/members/${booking.member.id}`}
                        className="font-black text-zinc-950 transition hover:text-red-600 hover:underline"
                      >
                        {booking.member.firstName}{" "}
                        {booking.member.lastName}
                      </Link>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getStatusClasses(
                          status,
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>

                      {booking.member.status !== "ACTIVE" && (
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                          Member {formatStatus(
                            booking.member.status as BookingStatusValue,
                          )}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 truncate text-sm text-zinc-600">
                      {booking.member.email}
                    </p>

                    {booking.member.phone && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {booking.member.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                    {status !== "CANCELLED" && (
                      <>
                        <form action={updateBookingStatus}>
                          <input
                            type="hidden"
                            name="bookingId"
                            value={booking.id}
                          />

                          <input
                            type="hidden"
                            name="status"
                            value="ATTENDED"
                          />

                          <button
                            type="submit"
                            disabled={
                              session.cancelled || status === "ATTENDED"
                            }
                            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                          >
                            Attended
                          </button>
                        </form>

                        <form action={updateBookingStatus}>
                          <input
                            type="hidden"
                            name="bookingId"
                            value={booking.id}
                          />

                          <input
                            type="hidden"
                            name="status"
                            value="NO_SHOW"
                          />

                          <button
                            type="submit"
                            disabled={
                              session.cancelled || status === "NO_SHOW"
                            }
                            className="inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                          >
                            No-show
                          </button>
                        </form>

                        <form action={updateBookingStatus}>
                          <input
                            type="hidden"
                            name="bookingId"
                            value={booking.id}
                          />

                          <input
                            type="hidden"
                            name="status"
                            value="CONFIRMED"
                          />

                          <button
                            type="submit"
                            disabled={
                              session.cancelled || status === "CONFIRMED"
                            }
                            className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                          >
                            Reset
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
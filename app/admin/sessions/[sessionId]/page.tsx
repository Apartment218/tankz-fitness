import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function readText(
  record: object,
  possibleFields: string[],
  fallback: string,
) {
  const values = record as Record<string, unknown>;

  for (const field of possibleFields) {
    const value = values[field];

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value;
    }
  }

  return fallback;
}

function getMemberName(
  member: object,
  fallback: string,
) {
  const firstName = readText(
    member,
    ["firstName", "firstname", "givenName"],
    "",
  );

  const lastName = readText(
    member,
    ["lastName", "lastname", "surname", "familyName"],
    "",
  );

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  return readText(
    member,
    ["name", "fullName"],
    fallback,
  );
}

async function toggleSessionCancellation(
  sessionId: string,
) {
  "use server";

  const session =
    await prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        cancelled: true,
      },
    });

  if (!session) {
    notFound();
  }

  await prisma.classSession.update({
    where: {
      id: sessionId,
    },
    data: {
      cancelled: !session.cancelled,
    },
  });

  redirect(`/admin/sessions/${sessionId}`);
}

async function removeBooking(
  sessionId: string,
  bookingId: string,
) {
  "use server";

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
    notFound();
  }

  await prisma.booking.delete({
    where: {
      id: booking.id,
    },
  });

  redirect(`/admin/sessions/${sessionId}`);
}

async function deleteSession(sessionId: string) {
  "use server";

  const session =
    await prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        classId: true,
      },
    });

  if (!session) {
    notFound();
  }

  await prisma.classSession.delete({
    where: {
      id: sessionId,
    },
  });

  redirect(`/admin/classes/${session.classId}`);
}

export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const session =
    await prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        fitnessClass: true,
        trainer: true,
        bookings: {
          include: {
            member: true,
          },
          orderBy: {
            bookedAt: "asc",
          },
        },
      },
    });

  if (!session) {
    notFound();
  }

  const startDate =
    session.startsAt.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const startTime =
    session.startsAt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const endTime =
    session.endsAt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const spacesRemaining = Math.max(
    session.capacity - session.bookings.length,
    0,
  );

  const canAddBooking =
    !session.cancelled && spacesRemaining > 0;

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/admin/classes/${session.classId}`}
            className="font-bold text-red-600 hover:underline"
          >
            ← Back to {session.fitnessClass.name}
          </Link>

          <h1 className="mt-4 text-4xl font-black">
            Session Details
          </h1>

          <p className="mt-2 text-xl font-semibold text-gray-700">
            {session.fitnessClass.name}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {canAddBooking && (
            <Link
              href={`/admin/sessions/${session.id}/bookings/new`}
              className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              Add Booking
            </Link>
          )}

          <Link
            href={`/admin/sessions/${session.id}/edit`}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-bold hover:bg-gray-100"
          >
            Edit Session
          </Link>

          <form
            action={toggleSessionCancellation.bind(
              null,
              session.id,
            )}
          >
            <button
              type="submit"
              className={
                session.cancelled
                  ? "rounded-lg bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
                  : "rounded-lg bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700"
              }
            >
              {session.cancelled
                ? "Restore Session"
                : "Cancel Session"}
            </button>
          </form>
        </div>
      </div>

      {session.cancelled && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-800">
          <p className="font-bold">
            This session has been cancelled.
          </p>

          <p className="mt-1 text-sm">
            Existing bookings remain attached until they are
            removed.
          </p>
        </div>
      )}

      {!session.cancelled &&
        spacesRemaining === 0 && (
          <div className="rounded-xl border border-orange-300 bg-orange-50 p-5 text-orange-800">
            <p className="font-bold">
              This session is full.
            </p>

            <p className="mt-1 text-sm">
              Increase the capacity or remove a booking before
              adding another member.
            </p>
          </div>
        )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Date
          </p>

          <p className="mt-3 text-xl font-black">
            {startDate}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Time
          </p>

          <p className="mt-3 text-2xl font-black">
            {startTime}–{endTime}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Bookings
          </p>

          <p className="mt-3 text-3xl font-black">
            {session.bookings.length} / {session.capacity}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Spaces Remaining
          </p>

          <p className="mt-3 text-3xl font-black">
            {spacesRemaining}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-2xl font-black">
            Session Information
          </h2>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Trainer
              </dt>

              <dd className="mt-2 text-lg font-semibold">
                {session.trainer
                  ? `${session.trainer.firstName} ${session.trainer.lastName}`
                  : "No trainer assigned"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Room
              </dt>

              <dd className="mt-2 text-lg font-semibold">
                {session.room ?? "No room assigned"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Capacity
              </dt>

              <dd className="mt-2 text-lg font-semibold">
                {session.capacity} members
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Status
              </dt>

              <dd className="mt-2">
                <span
                  className={
                    session.cancelled
                      ? "inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700"
                      : "inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700"
                  }
                >
                  {session.cancelled
                    ? "Cancelled"
                    : "Scheduled"}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-red-700">
            Danger Zone
          </h2>

          <p className="mt-3 text-sm text-gray-600">
            Deleting this session also deletes all associated
            bookings.
          </p>

          <form
            action={deleteSession.bind(null, session.id)}
            className="mt-6"
          >
            <button
              type="submit"
              className="w-full rounded-lg border border-red-600 px-5 py-3 font-bold text-red-600 hover:bg-red-50"
            >
              Delete Session
            </button>
          </form>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-black">
              Attendees
            </h2>

            <p className="mt-1 text-gray-600">
              Members currently booked onto this session.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
              {session.bookings.length} booked
            </span>

            {canAddBooking && (
              <Link
                href={`/admin/sessions/${session.id}/bookings/new`}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Add Member
              </Link>
            )}
          </div>
        </div>

        {session.bookings.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-bold text-gray-700">
              No attendees yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add a member to create the first booking.
            </p>

            {canAddBooking && (
              <Link
                href={`/admin/sessions/${session.id}/bookings/new`}
                className="mt-5 inline-flex rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
              >
                Add First Booking
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {session.bookings.map(
              (booking, index) => {
                const memberName = getMemberName(
                  booking.member,
                  `Member ${index + 1}`,
                );

                const memberEmail = readText(
                  booking.member,
                  ["email", "emailAddress"],
                  "No email available",
                );

                return (
                  <div
                    key={booking.id}
                    className="flex flex-wrap items-center justify-between gap-5 p-6"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/members/${booking.memberId}`}
                        className="text-lg font-bold hover:text-red-600 hover:underline"
                      >
                        {memberName}
                      </Link>

                      <p className="mt-1 truncate text-sm text-gray-600">
                        {memberEmail}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>
                        Booked{" "}
                        {booking.bookedAt.toLocaleString(
                          "en-GB",
                        )}
                      </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                      {String(booking.status)}
                    </span>

                    <form
                      action={removeBooking.bind(
                        null,
                        session.id,
                        booking.id,
                      )}
                    >
                      <button
                        type="submit"
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        Remove Booking
                      </button>
                    </form>
                  </div>
                );
              },
            )}
          </div>
        )}
      </section>
    </div>
  );
}
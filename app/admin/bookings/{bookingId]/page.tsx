import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import DeleteBookingButton from "./DeleteBookingButton";

function formatStatus(status: unknown) {
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

async function deleteBooking(bookingId: string) {
  "use server";

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
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

  redirect("/admin/bookings");
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      member: true,
      session: {
        include: {
          fitnessClass: true,
          trainer: true,
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const memberName =
    `${booking.member.firstName} ${booking.member.lastName}`.trim();

  const sessionDate =
    booking.session.startsAt.toLocaleDateString(
      "en-GB",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );

  const sessionStart =
    booking.session.startsAt.toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );

  const sessionEnd =
    booking.session.endsAt.toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );

  const bookedAt =
    booking.bookedAt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const deleteAction = deleteBooking.bind(
    null,
    booking.id,
  );

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/bookings"
            className="font-bold text-red-600 hover:underline"
          >
            ← Back to bookings
          </Link>

          <h1 className="mt-4 text-4xl font-black">
            Booking Details
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            Review and manage this member&apos;s class
            booking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-full px-4 py-2 font-bold ${getStatusClasses(
              booking.status,
            )}`}
          >
            {formatStatus(booking.status)}
          </span>

          <Link
            href={`/admin/bookings/${booking.id}/edit`}
            className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
          >
            Edit Booking
          </Link>
        </div>
      </div>

      {booking.session.cancelled && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-800">
          <p className="font-bold">
            This booking belongs to a cancelled session.
          </p>

          <p className="mt-1 text-sm">
            The booking remains stored until it is manually
            removed.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Member
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {memberName}
              </h2>

              <p className="mt-1 text-gray-600">
                {booking.member.email}
              </p>
            </div>

            <Link
              href={`/admin/members/${booking.memberId}`}
              className="rounded-lg border border-gray-300 px-4 py-2 font-bold hover:bg-gray-100"
            >
              View Member
            </Link>
          </div>

          <dl className="mt-8 grid gap-6 border-t border-gray-200 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Booking status
              </dt>

              <dd className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getStatusClasses(
                    booking.status,
                  )}`}
                >
                  {formatStatus(booking.status)}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Booked
              </dt>

              <dd className="mt-2 font-bold">
                {bookedAt}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Email
              </dt>

              <dd className="mt-2 break-all font-semibold">
                {booking.member.email}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Member record
              </dt>

              <dd className="mt-2">
                <Link
                  href={`/admin/members/${booking.memberId}`}
                  className="font-bold text-red-600 hover:underline"
                >
                  Open member profile
                </Link>
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-red-700">
            Remove Booking
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            This permanently removes the member from this
            class session.
          </p>

          <div className="mt-6">
            <DeleteBookingButton
              action={deleteAction}
              memberName={memberName}
              className={
                booking.session.fitnessClass.name
              }
            />
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Class session
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {booking.session.fitnessClass.name}
            </h2>

            {booking.session.fitnessClass.description && (
              <p className="mt-2 max-w-3xl text-gray-600">
                {
                  booking.session.fitnessClass
                    .description
                }
              </p>
            )}
          </div>

          <Link
            href={`/admin/sessions/${booking.sessionId}`}
            className="rounded-lg border border-gray-300 px-5 py-3 font-bold hover:bg-gray-100"
          >
            View Session
          </Link>
        </div>

        <dl className="mt-8 grid gap-6 border-t border-gray-200 pt-6 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Date
            </dt>

            <dd className="mt-2 font-bold">
              {sessionDate}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Time
            </dt>

            <dd className="mt-2 font-bold">
              {sessionStart}–{sessionEnd}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Trainer
            </dt>

            <dd className="mt-2 font-bold">
              {booking.session.trainer
                ? `${booking.session.trainer.firstName} ${booking.session.trainer.lastName}`
                : "No trainer assigned"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Room
            </dt>

            <dd className="mt-2 font-bold">
              {booking.session.room ??
                "No room assigned"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Session capacity
            </dt>

            <dd className="mt-2 font-bold">
              {booking.session.capacity}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Session status
            </dt>

            <dd className="mt-2">
              <span
                className={
                  booking.session.cancelled
                    ? "inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700"
                    : "inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700"
                }
              >
                {booking.session.cancelled
                  ? "Cancelled"
                  : "Scheduled"}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Class duration
            </dt>

            <dd className="mt-2 font-bold">
              {
                booking.session.fitnessClass
                  .durationMin
              }{" "}
              minutes
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Class record
            </dt>

            <dd className="mt-2">
              <Link
                href={`/admin/classes/${booking.session.classId}`}
                className="font-bold text-red-600 hover:underline"
              >
                View class
              </Link>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
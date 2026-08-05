import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function formatStatus(status: unknown) {
  return String(status)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function updateBookingStatus(
  bookingId: string,
  formData: FormData,
) {
  "use server";

  const status = String(
    formData.get("status") ?? "",
  ).trim();

  if (!status) {
    throw new Error("Please select a booking status.");
  }

  const existingBooking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
      },
    });

  if (!existingBooking) {
    notFound();
  }

  const availableStatuses =
    await prisma.booking.findMany({
      select: {
        status: true,
      },
      distinct: ["status"],
    });

  const validStatuses = new Set(
    availableStatuses.map(({ status }) =>
      String(status),
    ),
  );

  if (!validStatuses.has(status)) {
    throw new Error(
      "The selected booking status is not valid.",
    );
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: status as never,
    },
  });

  redirect(`/admin/bookings/${bookingId}`);
}

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  const [booking, statuses] = await Promise.all([
    prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        member: true,
        session: {
          include: {
            fitnessClass: true,
          },
        },
      },
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
  ]);

  if (!booking) {
    notFound();
  }

  const statusValues = Array.from(
    new Set([
      String(booking.status),
      ...statuses.map(({ status }) =>
        String(status),
      ),
    ]),
  );

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

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-black">
      <div>
        <Link
          href={`/admin/bookings/${booking.id}`}
          className="font-bold text-red-600 hover:underline"
        >
          ← Back to booking
        </Link>

        <h1 className="mt-4 text-4xl font-black">
          Edit Booking
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Update the booking status for{" "}
          <span className="font-bold text-gray-900">
            {memberName}
          </span>
          .
        </p>
      </div>

      {booking.session.cancelled && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-800">
          <p className="font-bold">
            This booking belongs to a cancelled session.
          </p>

          <p className="mt-1 text-sm">
            You can still update the booking status or remove
            the booking from its details page.
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">
          Booking Summary
        </h2>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Member
            </dt>

            <dd className="mt-2 font-bold">
              {memberName}
            </dd>

            <dd className="mt-1 text-sm text-gray-600">
              {booking.member.email}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Class
            </dt>

            <dd className="mt-2 font-bold">
              {booking.session.fitnessClass.name}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Session date
            </dt>

            <dd className="mt-2 font-bold">
              {sessionDate}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Session time
            </dt>

            <dd className="mt-2 font-bold">
              {sessionStart}–{sessionEnd}
            </dd>
          </div>
        </dl>
      </section>

      <form
        action={updateBookingStatus.bind(
          null,
          booking.id,
        )}
        className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <label className="block">
          <span className="mb-2 block font-bold">
            Booking status
          </span>

          <select
            name="status"
            required
            defaultValue={String(booking.status)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
          >
            {statusValues.map((status) => (
              <option
                key={status}
                value={status}
              >
                {formatStatus(status)}
              </option>
            ))}
          </select>

          <span className="mt-2 block text-sm text-gray-500">
            Choose the current state of this booking.
          </span>
        </label>

        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            href={`/admin/bookings/${booking.id}`}
            className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
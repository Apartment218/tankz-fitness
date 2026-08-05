import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

async function createBooking(
  sessionId: string,
  formData: FormData,
) {
  "use server";

  const memberId = String(
    formData.get("memberId") ?? "",
  ).trim();

  if (!memberId) {
    throw new Error("Please select a member.");
  }

  const session =
    await prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        bookings: {
          select: {
            id: true,
          },
        },
      },
    });

  if (!session) {
    notFound();
  }

  if (session.cancelled) {
    throw new Error(
      "You cannot add bookings to a cancelled session.",
    );
  }

  if (
    session.bookings.length >= session.capacity
  ) {
    throw new Error(
      "This session has reached maximum capacity.",
    );
  }

  const existingBooking =
    await prisma.booking.findUnique({
      where: {
        memberId_sessionId: {
          memberId,
          sessionId,
        },
      },
      select: {
        id: true,
      },
    });

  if (existingBooking) {
    throw new Error(
      "This member is already booked onto the session.",
    );
  }

  await prisma.booking.create({
    data: {
      memberId,
      sessionId,
    },
  });

  redirect(`/admin/sessions/${sessionId}`);
}

export default async function NewBookingPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const [session, members] = await Promise.all([
    prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        fitnessClass: true,
        bookings: {
          select: {
            memberId: true,
          },
        },
      },
    }),

    prisma.member.findMany({
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    }),
  ]);

  if (!session) {
    notFound();
  }

  const bookedMemberIds = new Set(
    session.bookings.map(
      (booking) => booking.memberId,
    ),
  );

  const availableMembers = members.filter(
    (member) => !bookedMemberIds.has(member.id),
  );

  const spacesRemaining = Math.max(
    session.capacity - session.bookings.length,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-black">
      <div>
        <Link
          href={`/admin/sessions/${session.id}`}
          className="font-bold text-red-600 hover:underline"
        >
          ← Back to session
        </Link>

        <h1 className="mt-4 text-4xl font-black">
          Add Booking
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Book a member onto{" "}
          <span className="font-bold text-gray-900">
            {session.fitnessClass.name}
          </span>
          .
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Capacity
          </p>

          <p className="mt-2 text-3xl font-black">
            {session.capacity}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Booked
          </p>

          <p className="mt-2 text-3xl font-black">
            {session.bookings.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Spaces left
          </p>

          <p className="mt-2 text-3xl font-black">
            {spacesRemaining}
          </p>
        </div>
      </div>

      <form
        action={createBooking.bind(
          null,
          session.id,
        )}
        className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        {session.cancelled ? (
          <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-800">
            <p className="font-bold">
              This session is cancelled.
            </p>

            <p className="mt-1 text-sm">
              Restore the session before adding bookings.
            </p>
          </div>
        ) : spacesRemaining === 0 ? (
          <div className="rounded-xl border border-orange-300 bg-orange-50 p-5 text-orange-800">
            <p className="font-bold">
              This session is full.
            </p>

            <p className="mt-1 text-sm">
              Increase the capacity or remove a booking
              before adding another member.
            </p>
          </div>
        ) : availableMembers.length === 0 ? (
          <div className="rounded-xl border border-gray-300 bg-gray-50 p-5 text-gray-700">
            <p className="font-bold">
              No available members
            </p>

            <p className="mt-1 text-sm">
              Every member is already booked onto this
              session.
            </p>
          </div>
        ) : (
          <label className="block">
            <span className="mb-2 block font-bold">
              Member
            </span>

            <select
              name="memberId"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
            >
              <option value="" disabled>
                Select a member
              </option>

              {availableMembers.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.firstName} {member.lastName} —{" "}
                  {member.email}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            href={`/admin/sessions/${session.id}`}
            className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>

          {!session.cancelled &&
            spacesRemaining > 0 &&
            availableMembers.length > 0 && (
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
              >
                Add Booking
              </button>
            )}
        </div>
      </form>
    </div>
  );
}
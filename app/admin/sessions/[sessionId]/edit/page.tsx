import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

async function updateSession(
  sessionId: string,
  formData: FormData,
) {
  "use server";

  const trainerValue = String(
    formData.get("trainerId") ?? "",
  ).trim();

  const roomValue = String(
    formData.get("room") ?? "",
  ).trim();

  const startsAt = new Date(
    String(formData.get("startsAt") ?? ""),
  );

  const endsAt = new Date(
    String(formData.get("endsAt") ?? ""),
  );

  const capacity = Number(
    formData.get("capacity"),
  );

  if (Number.isNaN(startsAt.getTime())) {
    throw new Error("Please enter a valid start date and time.");
  }

  if (Number.isNaN(endsAt.getTime())) {
    throw new Error("Please enter a valid end date and time.");
  }

  if (endsAt <= startsAt) {
    throw new Error(
      "The end time must be later than the start time.",
    );
  }

  if (
    !Number.isInteger(capacity) ||
    capacity < 1
  ) {
    throw new Error(
      "Capacity must be a whole number greater than zero.",
    );
  }

  const existingSession =
    await prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        id: true,
      },
    });

  if (!existingSession) {
    notFound();
  }

  await prisma.classSession.update({
    where: {
      id: sessionId,
    },
    data: {
      trainerId: trainerValue || null,
      room: roomValue || null,
      startsAt,
      endsAt,
      capacity,
    },
  });

  redirect(`/admin/sessions/${sessionId}`);
}

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const [session, trainers] = await Promise.all([
    prisma.classSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        fitnessClass: true,
        bookings: {
          select: {
            id: true,
          },
        },
      },
    }),

    prisma.staff.findMany({
      where: {
        active: true,
      },
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

  const minimumCapacity = Math.max(
    session.bookings.length,
    1,
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
          Edit Session
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Update the timetable details for{" "}
          <span className="font-bold text-gray-900">
            {session.fitnessClass.name}
          </span>
          .
        </p>
      </div>

      <form
        action={updateSession.bind(
          null,
          session.id,
        )}
        className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-bold">
                Start date and time
              </span>

              <input
                type="datetime-local"
                name="startsAt"
                required
                defaultValue={toDateTimeLocal(
                  session.startsAt,
                )}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-bold">
                End date and time
              </span>

              <input
                type="datetime-local"
                name="endsAt"
                required
                defaultValue={toDateTimeLocal(
                  session.endsAt,
                )}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block font-bold">
              Trainer
            </span>

            <select
              name="trainerId"
              defaultValue={session.trainerId ?? ""}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
            >
              <option value="">
                No trainer assigned
              </option>

              {trainers.map((trainer) => (
                <option
                  key={trainer.id}
                  value={trainer.id}
                >
                  {trainer.firstName}{" "}
                  {trainer.lastName}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-bold">
                Capacity
              </span>

              <input
                type="number"
                name="capacity"
                required
                min={minimumCapacity}
                step={1}
                defaultValue={session.capacity}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
              />

              <span className="mt-2 block text-sm text-gray-500">
                Minimum {minimumCapacity} because this
                session currently has{" "}
                {session.bookings.length} booking
                {session.bookings.length === 1
                  ? ""
                  : "s"}
                .
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block font-bold">
                Room
              </span>

              <input
                type="text"
                name="room"
                defaultValue={session.room ?? ""}
                placeholder="Example: Studio A"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-500 focus:border-red-600"
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            href={`/admin/sessions/${session.id}`}
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
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  const fitnessClass =
    await prisma.fitnessClass.findUnique({
      where: {
        id: classId,
      },
      include: {
        sessions: {
          include: {
            trainer: true,
            bookings: true,
          },
          orderBy: {
            startsAt: "asc",
          },
        },
      },
    });

  if (!fitnessClass) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/classes"
            className="font-semibold text-red-600 hover:underline"
          >
            ← Back to Classes
          </Link>

          <h1 className="mt-4 text-4xl font-bold">
            {fitnessClass.name}
          </h1>

          {fitnessClass.description && (
            <p className="mt-3 max-w-3xl text-gray-600">
              {fitnessClass.description}
            </p>
          )}
        </div>

        <Link
          href={`/admin/classes/${classId}/sessions/new`}
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
        >
          New Session
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Duration
          </p>

          <p className="mt-2 text-3xl font-bold">
            {fitnessClass.durationMin} min
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Capacity
          </p>

          <p className="mt-2 text-3xl font-bold">
            {fitnessClass.capacity}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Status
          </p>

          <p className="mt-2 text-2xl font-bold">
            {fitnessClass.active
              ? "Active"
              : "Inactive"}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Sessions
          </p>

          <p className="mt-2 text-3xl font-bold">
            {fitnessClass.sessions.length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold">
            Scheduled Sessions
          </h2>
        </div>

        {fitnessClass.sessions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No sessions scheduled yet.
          </div>
        ) : (
          <div className="divide-y">
            {fitnessClass.sessions.map((session) => (
              <Link
                key={session.id}
                href={`/admin/sessions/${session.id}`}
                className="block p-6 transition hover:bg-gray-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      {session.startsAt.toLocaleString(
                        "en-GB",
                      )}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Ends{" "}
                      {session.endsAt.toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p>
                      <strong>Trainer:</strong>{" "}
                      {session.trainer
                        ? `${session.trainer.firstName} ${session.trainer.lastName}`
                        : "Unassigned"}
                    </p>

                    <p>
                      <strong>Room:</strong>{" "}
                      {session.room ?? "-"}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p>
                      <strong>Capacity:</strong>{" "}
                      {session.capacity}
                    </p>

                    <p>
                      <strong>Bookings:</strong>{" "}
                      {session.bookings.length}
                    </p>
                  </div>

                  <div>
                    {session.cancelled ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                        Cancelled
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
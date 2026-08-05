import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type StaffDetailsPageProps = {
  params: Promise<{
    staffId: string;
  }>;
};

function formatRole(role: string) {
  return role
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function StaffDetailsPage({
  params,
}: StaffDetailsPageProps) {
  const { staffId } = await params;

  const staffMember = await prisma.staff.findUnique({
    where: {
      id: staffId,
    },
    include: {
      sessions: {
        orderBy: {
          startsAt: "asc",
        },
        include: {
          fitnessClass: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      },
    },
  });

  if (!staffMember) {
    notFound();
  }

  const now = new Date();

  const upcomingSessions = staffMember.sessions.filter(
    (session) =>
      session.startsAt >= now && !session.cancelled,
  );

  const previousSessions = staffMember.sessions.filter(
    (session) =>
      session.startsAt < now || session.cancelled,
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <Link
            href="/admin/staff"
            className="font-bold text-red-600 transition hover:text-red-700 hover:underline"
          >
            ← Back to staff
          </Link>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-950">
            {staffMember.firstName} {staffMember.lastName}
          </h1>

          <p className="mt-2 text-lg text-zinc-600">
            Staff profile, contact details and assigned class
            sessions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/admin/staff/${staffMember.id}/edit`}
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Edit Staff Member
          </Link>

          <Link
            href={`/admin/staff/${staffMember.id}/delete`}
            className="inline-flex items-center justify-center rounded-xl border border-red-300 bg-white px-5 py-3 font-bold text-red-600 transition hover:bg-red-50"
          >
            Delete Staff Member
          </Link>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Role
          </p>

          <p className="mt-3 text-2xl font-black text-zinc-950">
            {formatRole(staffMember.role)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Status
          </p>

          <div className="mt-3">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                staffMember.active
                  ? "bg-green-100 text-green-800"
                  : "bg-zinc-200 text-zinc-700"
              }`}
            >
              {staffMember.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Upcoming sessions
          </p>

          <p className="mt-3 text-4xl font-black text-zinc-950">
            {upcomingSessions.length}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2 className="text-2xl font-black text-zinc-950">
            Contact Details
          </h2>
        </div>

        <dl className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-bold text-zinc-500">
              Email address
            </dt>

            <dd className="mt-2 break-words font-semibold">
              <a
                href={`mailto:${staffMember.email}`}
                className="text-red-600 transition hover:text-red-700 hover:underline"
              >
                {staffMember.email}
              </a>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold text-zinc-500">
              Phone number
            </dt>

            <dd className="mt-2 font-semibold">
              {staffMember.phone ? (
                <a
                  href={`tel:${staffMember.phone}`}
                  className="text-red-600 transition hover:text-red-700 hover:underline"
                >
                  {staffMember.phone}
                </a>
              ) : (
                <span className="text-zinc-500">
                  No phone number added
                </span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold text-zinc-500">
              Date added
            </dt>

            <dd className="mt-2 font-semibold text-zinc-950">
              {formatDateTime(staffMember.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-bold text-zinc-500">
              Last updated
            </dt>

            <dd className="mt-2 font-semibold text-zinc-950">
              {formatDateTime(staffMember.updatedAt)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2 className="text-2xl font-black text-zinc-950">
            Upcoming Class Sessions
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Future sessions currently assigned to this staff
            member.
          </p>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-bold text-zinc-700">
              No upcoming sessions
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              This staff member has no future class sessions
              assigned.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {upcomingSessions.map((session) => (
              <article
                key={session.id}
                className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
              >
                <div>
                  <Link
                    href={`/admin/classes/${session.fitnessClass.id}`}
                    className="text-lg font-black text-red-600 transition hover:text-red-700 hover:underline"
                  >
                    {session.fitnessClass.name}
                  </Link>

                  <p className="mt-2 font-semibold text-zinc-800">
                    {formatDateTime(session.startsAt)}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {session.room
                      ? `Room: ${session.room}`
                      : "No room assigned"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="font-bold text-zinc-950">
                    {session._count.bookings} /{" "}
                    {session.capacity} bookings
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Ends {formatDateTime(session.endsAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {previousSessions.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-5">
            <h2 className="text-2xl font-black text-zinc-950">
              Previous and Cancelled Sessions
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Historical sessions connected to this staff
              member.
            </p>
          </div>

          <div className="divide-y divide-zinc-200">
            {previousSessions.map((session) => (
              <article
                key={session.id}
                className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
              >
                <div>
                  <Link
                    href={`/admin/classes/${session.fitnessClass.id}`}
                    className="font-black text-zinc-950 transition hover:text-red-600"
                  >
                    {session.fitnessClass.name}
                  </Link>

                  <p className="mt-1 text-sm text-zinc-600">
                    {formatDateTime(session.startsAt)}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {session._count.bookings}{" "}
                    {session._count.bookings === 1
                      ? "booking"
                      : "bookings"}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-bold ${
                    session.cancelled
                      ? "bg-red-100 text-red-800"
                      : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {session.cancelled
                    ? "Cancelled"
                    : "Completed"}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
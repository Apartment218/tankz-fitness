import Link from "next/link";

export default function SessionAttendanceNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center py-12">
      <section className="w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 bg-zinc-50 p-6 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl font-black text-red-600">
            !
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Session Not Found
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
            This attendance session is unavailable
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-zinc-600">
            The class session may have been deleted, the address may be
            incorrect, or the session may no longer be available.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="font-black text-zinc-950">
              What you can do
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Return to the attendance page and select another class session,
              or go back to the admin dashboard.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/attendance"
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Back to Attendance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
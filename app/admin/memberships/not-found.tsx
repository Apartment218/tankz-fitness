import Link from "next/link";

export default function MembershipsNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center py-12">
      <section className="w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 bg-zinc-50 p-6 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl font-black text-red-600">
            !
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Memberships Not Found
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
            No memberships were found
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-zinc-600">
            There are currently no membership records to display, or the
            membership you requested no longer exists.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="font-black text-zinc-950">
              What would you like to do?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Return to the Memberships page, manage members, or go back to the
              Admin Dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/admin/memberships"
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Memberships
            </Link>

            <Link
              href="/admin/members"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
            >
              Members
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
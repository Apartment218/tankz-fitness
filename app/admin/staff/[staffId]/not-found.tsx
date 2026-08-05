import Link from "next/link";

export default function StaffNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-2xl font-black text-red-600">
          !
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-red-600">
          Staff member not found
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
          This staff profile does not exist
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-zinc-600">
          The staff member may have been removed, or the profile
          address may be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/admin/staff"
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Return to Staff
          </Link>

          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function StaffError({
  error,
  reset,
}: ErrorPageProps) {
  console.error(error);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-2xl font-black text-red-600">
          !
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-red-600">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
          Unable to load the staff page
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-zinc-600">
          An unexpected error occurred while loading this
          staff page. You can try again or return to the
          staff list.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>

          <Link
            href="/admin/staff"
            className="rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
          >
            Back to Staff
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 rounded-xl bg-zinc-100 p-4 text-left">
            <summary className="cursor-pointer font-bold">
              Error Details
            </summary>

            <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-red-700">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
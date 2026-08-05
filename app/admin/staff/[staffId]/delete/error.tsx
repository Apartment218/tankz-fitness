"use client";

import Link from "next/link";
import { useEffect } from "react";

type DeleteStaffErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function DeleteStaffError({
  error,
  reset,
}: DeleteStaffErrorProps) {
  useEffect(() => {
    console.error("Delete staff error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl py-12">
      <section className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 bg-red-50 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Unable to continue
          </p>

          <h1 className="mt-3 text-3xl font-black text-red-950">
            Staff member could not be deleted
          </h1>

          <p className="mt-3 leading-7 text-red-800">
            Something unexpected happened while loading the
            delete confirmation page or processing the request.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="font-black text-zinc-950">
              What should I do?
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600">
              <li>Try the action again.</li>
              <li>Return to the staff profile.</li>
              <li>
                If the error persists, verify the staff member
                still exists and isn't linked to active
                sessions.
              </li>
            </ul>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-black text-amber-950">
                Development Details
              </h2>

              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-sm text-amber-900">
                {error.message}
              </pre>

              {error.digest && (
                <p className="mt-3 text-xs font-semibold text-amber-800">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/staff"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
            >
              Back to Staff
            </Link>

            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
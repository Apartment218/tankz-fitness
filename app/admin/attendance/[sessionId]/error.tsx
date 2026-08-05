"use client";

import Link from "next/link";
import { useEffect } from "react";

type SessionAttendanceErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function SessionAttendanceError({
  error,
  reset,
}: SessionAttendanceErrorProps) {
  useEffect(() => {
    console.error("Session attendance error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl py-12">
      <section className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 bg-red-50 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Attendance Error
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-red-950">
            Session attendance could not be loaded
          </h1>

          <p className="mt-3 leading-7 text-red-800">
            An unexpected error occurred while loading this
            class session or updating attendance.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="font-black text-zinc-950">
              Possible causes
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600">
              <li>The session may have been deleted.</li>

              <li>
                Another staff member may currently be updating
                attendance.
              </li>

              <li>
                A temporary database or network issue may have
                occurred.
              </li>
            </ul>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-black text-amber-950">
                Development Details
              </h2>

              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-sm text-amber-900">
                {error.message || "Unknown error"}
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
              href="/admin/attendance"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
            >
              Back to Attendance
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
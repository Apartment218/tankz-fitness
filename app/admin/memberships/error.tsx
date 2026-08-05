"use client";

import Link from "next/link";
import { useEffect } from "react";

type MembershipsErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function MembershipsError({
  error,
  reset,
}: MembershipsErrorProps) {
  useEffect(() => {
    console.error("Memberships page error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl py-12">
      <section className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 bg-red-50 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Memberships Error
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-red-950">
            Memberships could not be loaded
          </h1>

          <p className="mt-3 leading-7 text-red-800">
            An unexpected error occurred while retrieving membership and plan
            information.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="font-black text-zinc-950">
              Possible causes
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600">
              <li>The database connection may be temporarily unavailable.</li>
              <li>A membership may reference a missing member or plan.</li>
              <li>The Prisma client may need to be regenerated.</li>
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
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100"
            >
              Dashboard
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
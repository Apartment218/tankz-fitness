"use client";

import { useEffect } from "react";
import Link from "next/link";

type ProductsErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ProductsError({
  error,
  reset,
}: ProductsErrorProps) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center py-12">
      <section className="w-full overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 bg-red-50 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
            Products Error
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-red-950">
            Products could not be loaded
          </h1>

          <p className="mt-3 leading-7 text-red-800">
            Something went wrong while opening the product inventory page.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="rounded-2xl border border-gray-300 bg-gray-50 p-5">
            <h2 className="font-black text-black">
              Try these steps
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
              <li>Reload the Products page.</li>
              <li>Return to the Admin Dashboard and try again.</li>
              <li>Check the browser console for development errors.</li>
            </ul>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-black text-amber-950">
                Development details
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
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-400 bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
import Link from "next/link";

export default function PaymentsNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-sm">
        <div className="border-b border-gray-300 bg-gray-50 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
            £
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red-600">
            Payments Not Found
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-black">
            No payment records were found
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-600">
            The requested payment record does not exist, or there are currently
            no payments available.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="rounded-2xl border border-gray-300 bg-gray-50 p-5">
            <h2 className="font-black text-black">Where would you like to go?</h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Return to Payments, review membership records, or go back to the
              Admin Dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/admin/payments"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Payments
            </Link>

            <Link
              href="/admin/memberships"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-400 bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-100"
            >
              Memberships
            </Link>

            <Link
              href="/admin"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-400 bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
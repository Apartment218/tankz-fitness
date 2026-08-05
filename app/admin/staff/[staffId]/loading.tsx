export default function StaffDetailsLoading() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />

          <div className="h-11 w-72 max-w-full animate-pulse rounded-xl bg-zinc-200" />

          <div className="h-6 w-96 max-w-full animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="h-12 w-44 animate-pulse rounded-xl bg-zinc-200" />
          <div className="h-12 w-48 animate-pulse rounded-xl bg-zinc-200" />
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="mt-4 h-9 w-32 animate-pulse rounded bg-zinc-200" />
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <div className="h-8 w-52 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
              <div className="mt-3 h-6 w-52 max-w-full animate-pulse rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <div className="h-8 w-64 max-w-full animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="divide-y divide-zinc-200">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
            >
              <div className="space-y-3">
                <div className="h-6 w-44 animate-pulse rounded bg-zinc-200" />
                <div className="h-5 w-36 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
              </div>

              <div className="space-y-3 sm:text-right">
                <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default function AttendanceLoading() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="space-y-4">
          <div className="h-11 w-64 max-w-full animate-pulse rounded-xl bg-zinc-200" />
          <div className="h-6 w-96 max-w-full animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="h-12 w-44 animate-pulse rounded-xl bg-zinc-200" />
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
            <div className="mt-4 h-10 w-20 animate-pulse rounded bg-zinc-200" />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
          </div>

          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
          </div>

          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
          </div>

          <div className="flex items-end">
            <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="grid grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-4 animate-pulse rounded bg-zinc-200"
              />
            ))}
          </div>
        </div>

        <div className="divide-y divide-zinc-200">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-5 px-6 py-5 sm:grid-cols-2 lg:grid-cols-5 lg:items-center"
            >
              <div className="space-y-2">
                <div className="h-5 w-36 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
              </div>

              <div className="space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
              </div>

              <div className="h-5 w-28 animate-pulse rounded bg-zinc-200" />

              <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-200" />

              <div className="h-10 w-28 animate-pulse rounded-xl bg-zinc-200 lg:justify-self-end" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
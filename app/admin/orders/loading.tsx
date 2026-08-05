export default function OrdersLoading() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />

          <div className="h-11 w-56 animate-pulse rounded-xl bg-zinc-200" />

          <div className="h-6 w-96 max-w-full animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="h-12 w-36 animate-pulse rounded-xl bg-zinc-200" />
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={index}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />

            <div className="mt-4 h-10 w-20 animate-pulse rounded bg-zinc-200" />
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5">
          <div className="h-8 w-44 animate-pulse rounded bg-zinc-200" />

          <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-6 gap-6 bg-zinc-50 px-6 py-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 animate-pulse rounded bg-zinc-200"
                />
              ))}
            </div>

            <div className="divide-y divide-zinc-200">
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-6 items-center gap-6 px-6 py-5"
                >
                  <div className="h-5 w-28 animate-pulse rounded bg-zinc-200" />

                  <div className="space-y-2">
                    <div className="h-5 w-36 animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-44 animate-pulse rounded bg-zinc-200" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-48 animate-pulse rounded bg-zinc-200" />
                  </div>

                  <div className="h-5 w-20 animate-pulse rounded bg-zinc-200" />

                  <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />

                  <div className="flex justify-center">
                    <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
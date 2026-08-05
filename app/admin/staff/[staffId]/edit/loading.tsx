export default function EditStaffLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-4">
        <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />

        <div className="h-11 w-72 max-w-full animate-pulse rounded-xl bg-zinc-200" />

        <div className="h-6 w-96 max-w-full animate-pulse rounded bg-zinc-200" />
      </header>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-5 sm:px-8">
          <div className="h-8 w-56 animate-pulse rounded bg-zinc-200" />

          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />

                <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
              </div>
            ))}
          </div>

          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />

              <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
            </div>
          ))}

          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />

            <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-4">
              <div className="h-6 w-11 animate-pulse rounded-full bg-zinc-200" />

              <div className="space-y-2">
                <div className="h-5 w-36 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-64 max-w-full animate-pulse rounded bg-zinc-200" />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end">
            <div className="h-12 w-28 animate-pulse rounded-xl bg-zinc-200" />

            <div className="h-12 w-40 animate-pulse rounded-xl bg-zinc-200" />
          </div>
        </div>
      </section>
    </div>
  );
}
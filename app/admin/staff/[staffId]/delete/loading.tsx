export default function DeleteStaffLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-4">
        <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />

        <div className="h-11 w-72 animate-pulse rounded-xl bg-zinc-200" />

        <div className="h-6 w-96 max-w-full animate-pulse rounded bg-zinc-200" />
      </div>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 p-6">
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />

          <div className="mt-4 h-8 w-80 max-w-full animate-pulse rounded bg-zinc-200" />

          <div className="mt-4 h-5 w-full animate-pulse rounded bg-zinc-200" />

          <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />

                <div className="mt-3 h-6 w-40 animate-pulse rounded bg-zinc-200" />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-200 p-5">
            <div className="h-6 w-48 animate-pulse rounded bg-zinc-200" />

            <div className="mt-4 h-4 w-full animate-pulse rounded bg-zinc-200" />

            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <div className="h-12 w-28 animate-pulse rounded-xl bg-zinc-200" />

            <div className="h-12 w-48 animate-pulse rounded-xl bg-zinc-200" />
          </div>
        </div>
      </section>
    </div>
  );
}
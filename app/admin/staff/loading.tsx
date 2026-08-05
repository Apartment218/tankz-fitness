export default function StaffLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-40 rounded bg-zinc-200" />
          <div className="h-10 w-72 rounded bg-zinc-200" />
          <div className="h-5 w-96 rounded bg-zinc-200" />
        </div>

        <div className="h-12 w-40 rounded-xl bg-zinc-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <div className="h-4 w-24 rounded bg-zinc-200" />
            <div className="mt-4 h-8 w-28 rounded bg-zinc-200" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="h-6 w-48 rounded bg-zinc-200" />

        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between border-b border-zinc-100 pb-4"
            >
              <div className="space-y-2">
                <div className="h-5 w-52 rounded bg-zinc-200" />
                <div className="h-4 w-36 rounded bg-zinc-200" />
              </div>

              <div className="h-5 w-20 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
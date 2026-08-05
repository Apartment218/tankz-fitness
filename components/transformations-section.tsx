import { prisma } from "@/lib/prisma";

export async function TransformationsSection() {
  const transformations =
    await prisma.transformation.findMany({
      where: {
        active: true,
        showOnHome: true,
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 4,
    });

  if (transformations.length === 0) {
    return null;
  }

  return (
    <section
      id="transformations"
      className="overflow-hidden bg-zinc-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
            Real transformations
          </p>

          <h2 className="mt-5 font-display text-5xl leading-[0.95] text-zinc-950 sm:text-6xl">
            Results built through consistency.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Every transformation starts with a clear plan,
            honest accountability and the willingness to keep
            showing up.
          </p>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {transformations.map((transformation) => (
            <article
              key={transformation.id}
              className={`overflow-hidden rounded-[2rem] border bg-white shadow-sm ${
                transformation.featured
                  ? "border-red-300 shadow-red-100"
                  : "border-zinc-200"
              }`}
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-200">
                  {transformation.beforeImageUrl ? (
                    <img
                      src={transformation.beforeImageUrl}
                      alt={`${transformation.title} before`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-900 text-5xl font-black text-white/20">
                      BEFORE
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-zinc-950 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                    Before
                  </span>
                </div>

                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-300">
                  {transformation.afterImageUrl ? (
                    <img
                      src={transformation.afterImageUrl}
                      alt={`${transformation.title} after`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-red-600 text-5xl font-black text-white/20">
                      AFTER
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                    After
                  </span>
                </div>
              </div>

              <div className="p-7">
                <div className="flex flex-wrap items-center gap-3">
                  {transformation.result ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-red-600">
                      {transformation.result}
                    </span>
                  ) : null}

                  {transformation.durationLabel ? (
                    <span className="text-sm font-bold text-zinc-500">
                      {transformation.durationLabel}
                    </span>
                  ) : null}

                  {transformation.featured ? (
                    <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                      Featured
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-2xl font-black text-zinc-950">
                  {transformation.title}
                </h3>

                {transformation.clientName ? (
                  <p className="mt-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
                    {transformation.clientName}
                  </p>
                ) : null}

                {transformation.summary ? (
                  <p className="mt-4 leading-7 text-zinc-600">
                    {transformation.summary}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
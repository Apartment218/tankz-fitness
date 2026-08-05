import { prisma } from "@/lib/prisma";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="tracking-[0.18em] text-amber-400"
      aria-label={`${rating} out of 5 stars`}
    >
      {"★".repeat(rating)}
      <span className="text-zinc-300">
        {"★".repeat(5 - rating)}
      </span>
    </span>
  );
}

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
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
    take: 6,
  });

  if (testimonials.length === 0) {
    return null;
  }

  const featured =
    testimonials.find((item) => item.featured) ??
    testimonials[0];

  const supporting = testimonials.filter(
    (item) => item.id !== featured.id,
  );

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
              Client stories
            </p>

            <h2 className="mt-5 font-display text-5xl leading-[0.95] text-zinc-950 sm:text-6xl">
              Results are powerful. Confidence is life-changing.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Hear from people who committed to the process,
              stayed consistent and changed more than their
              training.
            </p>
          </div>

          <div className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-black uppercase tracking-wider text-white">
            Rated by real clients
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <article className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-8 text-white shadow-2xl sm:p-10">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-red-600/25 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-4">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.clientName}
                    className="h-16 w-16 rounded-full border-2 border-white/15 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-xl font-black">
                    {featured.clientName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-lg font-black">
                    {featured.clientName}
                  </p>

                  {featured.result ? (
                    <p className="mt-1 text-sm font-bold text-red-400">
                      {featured.result}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-7">
                <Stars rating={featured.rating} />
              </div>

              {featured.headline ? (
                <h3 className="mt-7 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
                  {featured.headline}
                </h3>
              ) : null}

              <blockquote className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
                “{featured.quote}”
              </blockquote>
            </div>
          </article>

          <div className="grid gap-6">
            {supporting.slice(0, 2).map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {testimonial.imageUrl ? (
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.clientName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 font-black text-white">
                      {testimonial.clientName
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="font-black text-zinc-950">
                      {testimonial.clientName}
                    </p>

                    {testimonial.result ? (
                      <p className="text-sm font-bold text-red-600">
                        {testimonial.result}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5">
                  <Stars rating={testimonial.rating} />
                </div>

                {testimonial.headline ? (
                  <h3 className="mt-4 text-xl font-black text-zinc-950">
                    {testimonial.headline}
                  </h3>
                ) : null}

                <blockquote className="mt-3 leading-7 text-zinc-600">
                  “{testimonial.quote}”
                </blockquote>
              </article>
            ))}
          </div>
        </div>

        {supporting.length > 2 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {supporting
              .slice(2)
              .map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Stars rating={testimonial.rating} />

                  {testimonial.headline ? (
                    <h3 className="mt-5 text-xl font-black text-zinc-950">
                      {testimonial.headline}
                    </h3>
                  ) : null}

                  <blockquote className="mt-4 leading-7 text-zinc-600">
                    “{testimonial.quote}”
                  </blockquote>

                  <div className="mt-6 border-t border-zinc-200 pt-5">
                    <p className="font-black text-zinc-950">
                      {testimonial.clientName}
                    </p>

                    {testimonial.result ? (
                      <p className="mt-1 text-sm font-bold text-red-600">
                        {testimonial.result}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
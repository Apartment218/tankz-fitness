import Link from "next/link";

import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatDuration(days: number) {
  if (days === 1) return "Single session";
  if (days === 7) return "1 week";
  if (days === 14) return "2 weeks";
  if ([28, 30, 31].includes(days)) return "1 month";
  if ([90, 91].includes(days)) return "3 months";
  if ([180, 182].includes(days)) return "6 months";
  if ([365, 366].includes(days)) return "1 year";
  return `${days} days`;
}

export async function ServicesSection() {
  const [content, services] = await Promise.all([
    prisma.homepageContent.findUnique({
      where: { id: "main" },
    }),
    prisma.membershipPlan.findMany({
      where: {
        active: true,
        showOnHome: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { mostPopular: "desc" },
        { price: "asc" },
      ],
      take: 6,
    }),
  ]);

  if (content && !content.servicesVisible) {
    return null;
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
              {content?.servicesEyebrow ?? "Choose your coaching"}
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
              {content?.servicesTitle ??
                "A clear path from where you are to where you want to be."}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              {content?.servicesBody ??
                "Flexible coaching options for different goals, schedules and levels of support."}
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:border-red-500 hover:bg-red-600"
          >
            View all services
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const highlighted = service.mostPopular || service.featured;

            return (
              <article
                key={service.id}
                className={`group relative flex min-h-[480px] flex-col overflow-hidden rounded-[2rem] border p-7 transition duration-300 hover:-translate-y-1 ${
                  highlighted
                    ? "border-red-500 bg-red-600 shadow-2xl shadow-red-950/30"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                }`}
              >
                {service.imageUrl ? (
                  <div className="-mx-7 -mt-7 mb-7 overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                {service.mostPopular ? (
                  <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wider text-zinc-950">
                    Most popular
                  </span>
                ) : service.featured ? (
                  <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wider text-zinc-950">
                    Featured
                  </span>
                ) : null}

                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/65">
                  {formatDuration(service.durationDays)}
                </p>

                <h3 className="mt-4 font-display text-4xl leading-none">
                  {service.name}
                </h3>

                <p className="mt-5 line-clamp-5 leading-7 text-white/75">
                  {service.description ??
                    "Focused personal coaching designed to help you train consistently and make measurable progress."}
                </p>

                <div className="mt-auto pt-8">
                  <p className="font-display text-5xl">
                    {currencyFormatter.format(Number(service.price))}
                  </p>

                  <Link
                    href={service.buttonHref ?? "/#contact"}
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-black uppercase tracking-wider transition ${
                      highlighted
                        ? "bg-white text-red-600 hover:bg-zinc-950 hover:text-white"
                        : "bg-white text-zinc-950 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {service.buttonText ?? "Enquire now"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
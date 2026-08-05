import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Personal Training Services",
  description:
    "Choose a monthly personal training or coaching subscription from Tankz Fitness.",
};

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    cancelled?: string;
    error?: string;
  }>;
}) {
  const { cancelled, error } = await searchParams;

  const services = await prisma.membershipPlan.findMany({
    where: {
      active: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        mostPopular: "desc",
      },
      {
        price: "asc",
      },
    ],
  });

  return (
    <main className="min-h-screen bg-zinc-950">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(220,38,38,.35),transparent_25%),linear-gradient(120deg,rgba(255,255,255,.04),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
            Monthly coaching
          </p>

          <h1 className="mt-5 max-w-5xl font-display text-6xl leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Choose the support that matches your ambition.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
            Subscribe securely and get the structure,
            accountability and coaching needed to make lasting
            progress.
          </p>

          {cancelled ? (
            <div className="mt-7 max-w-2xl rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm font-bold text-amber-100">
              Checkout was cancelled. You have not been charged.
            </div>
          ) : null}

          {error ? (
            <div className="mt-7 max-w-2xl rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm font-bold text-red-100">
              We could not start checkout. Please try again.
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-10 text-center">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-500">
                Coming soon
              </p>

              <h2 className="mt-4 font-display text-4xl text-white">
                Coaching subscriptions are being updated
              </h2>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => {
                const highlighted =
                  service.mostPopular || service.featured;

                return (
                  <article
                    key={service.id}
                    className={`group relative flex min-h-[560px] flex-col overflow-hidden rounded-[2rem] border p-7 transition duration-300 hover:-translate-y-1 ${
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
                      Monthly subscription
                    </p>

                    <h2 className="mt-4 font-display text-4xl leading-none text-white">
                      {service.name}
                    </h2>

                    <p className="mt-5 leading-7 text-white/75">
                      {service.description ??
                        "Focused coaching designed to help you train consistently and make measurable progress."}
                    </p>

                    <div className="mt-7 space-y-3 text-sm font-semibold text-white/85">
                      <p>✓ Coaching tailored to your goals</p>
                      <p>✓ Clear structure and accountability</p>
                      <p>✓ Progress reviews and support</p>
                      <p>✓ Secure recurring monthly billing</p>
                    </div>

                    <div className="mt-auto pt-9">
                      <div className="flex items-end gap-2">
                        <p className="font-display text-5xl text-white">
                          {currency.format(
                            Number(service.price),
                          )}
                        </p>

                        <span className="pb-1 text-sm font-bold text-white/65">
                          / month
                        </span>
                      </div>

                      <form
                        action="/api/stripe/checkout"
                        method="post"
                      >
                        <input
                          type="hidden"
                          name="planId"
                          value={service.id}
                        />

                        <button
                          type="submit"
                          className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-black uppercase tracking-wider transition ${
                            highlighted
                              ? "bg-white text-red-600 hover:bg-zinc-950 hover:text-white"
                              : "bg-white text-zinc-950 hover:bg-red-600 hover:text-white"
                          }`}
                        >
                          Subscribe now
                        </button>
                      </form>

                      <p className="mt-3 text-center text-xs font-semibold text-white/55">
                        Secure checkout powered by Stripe
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
              Unsure where to start?
            </p>

            <h2 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] text-zinc-950 sm:text-6xl">
              Let’s build the right plan together.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
              Book a consultation and we will talk through your
              goals, current routine and the right monthly
              coaching option.
            </p>
          </div>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-600"
          >
            Book your consultation
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
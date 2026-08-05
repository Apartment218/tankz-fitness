import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Explore active Tankz Fitness membership plans and find the right option for your training.",
};

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

function formatDuration(durationDays: number) {
  if (durationDays === 1) {
    return "1 day";
  }

  if (durationDays === 7) {
    return "1 week";
  }

  if (durationDays === 14) {
    return "2 weeks";
  }

  if (durationDays === 28 || durationDays === 30 || durationDays === 31) {
    return "1 month";
  }

  if (durationDays === 90 || durationDays === 91) {
    return "3 months";
  }

  if (durationDays === 180 || durationDays === 182) {
    return "6 months";
  }

  if (durationDays === 365 || durationDays === 366) {
    return "1 year";
  }

  return `${durationDays} days`;
}

export default async function MembershipsPage() {
  const plans = await prisma.membershipPlan.findMany({
    where: {
      active: true,
    },
    orderBy: [
      {
        price: "asc",
      },
      {
        name: "asc",
      },
    ],
    select: {
      id: true,
      name: true,
      price: true,
      durationDays: true,
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
            Tankz Fitness
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Memberships built around your goals
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Choose an active Tankz Fitness plan and start training with expert
            coaching, high-energy sessions and a supportive community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {plans.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
              Coming soon
            </span>

            <h2 className="mt-6 font-display text-4xl text-foreground">
              New membership plans are on the way
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              There are currently no active membership plans available. Please
              check back soon or contact the Tankz Fitness team.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
            >
              Return home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan, index) => {
                const featured = plans.length > 1 && index === 1;

                return (
                  <article
                    key={plan.id}
                    className={`relative flex flex-col overflow-hidden rounded-3xl border p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      featured
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-card-foreground"
                    }`}
                  >
                    {featured ? (
                      <span className="absolute right-5 top-5 rounded-full bg-background px-3 py-1 text-xs font-black uppercase tracking-wider text-foreground">
                        Popular
                      </span>
                    ) : null}

                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-[0.25em] ${
                          featured
                            ? "text-primary-foreground/75"
                            : "text-primary"
                        }`}
                      >
                        Membership plan
                      </p>

                      <h2 className="mt-4 pr-20 font-display text-4xl">
                        {plan.name}
                      </h2>

                      <div className="mt-8 flex items-end gap-2">
                        <span className="font-display text-5xl tracking-tight">
                          {currencyFormatter.format(Number(plan.price))}
                        </span>
                      </div>

                      <p
                        className={`mt-3 text-sm font-semibold uppercase tracking-wider ${
                          featured
                            ? "text-primary-foreground/75"
                            : "text-muted-foreground"
                        }`}
                      >
                        Valid for {formatDuration(plan.durationDays)}
                      </p>
                    </div>

                    <div
                      className={`my-8 h-px ${
                        featured
                          ? "bg-primary-foreground/20"
                          : "bg-border"
                      }`}
                    />

                    <ul className="space-y-4 text-sm font-medium">
                      <li className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                            featured
                              ? "bg-primary-foreground text-primary"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          ✓
                        </span>

                        Access for the full membership period
                      </li>

                      <li className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                            featured
                              ? "bg-primary-foreground text-primary"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          ✓
                        </span>

                        Train with the Tankz Fitness community
                      </li>

                      <li className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                            featured
                              ? "bg-primary-foreground text-primary"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          ✓
                        </span>

                        Support from the Tankz Fitness team
                      </li>
                    </ul>

                    <Link
                      href="/#contact"
                      className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-black uppercase tracking-wider transition ${
                        featured
                          ? "bg-primary-foreground text-primary hover:opacity-90"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      Enquire about this plan
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="mt-14 rounded-3xl border border-border bg-muted/40 px-6 py-10 text-center sm:px-10">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Not sure which plan is right for you?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
                Speak with the Tankz Fitness team and we will help you choose a
                membership that matches your schedule and training goals.
              </p>

              <Link
                href="/#contact"
                className="mt-7 inline-flex items-center justify-center rounded-full border border-foreground px-7 py-3 text-sm font-bold uppercase tracking-wider text-foreground transition hover:bg-foreground hover:text-background"
              >
                Contact the team
              </Link>
            </div>
          </>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
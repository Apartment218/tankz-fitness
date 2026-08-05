import Link from "next/link";

import { prisma } from "@/lib/prisma";

export async function HomeCtaSection() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      businessName: "Tankz Fitness",
    },
    update: {},
  });

  return (
    <section id="contact" className="bg-red-600 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-100">
            Your next chapter starts here
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            Stop guessing. Start training with a plan.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-red-100">
            Book a consultation, talk through your goals and find the coaching
            option that fits you best.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href={settings.primaryCtaHref ?? "/#contact"}
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-black uppercase tracking-wider text-red-600 transition hover:bg-zinc-950 hover:text-white"
          >
            {settings.primaryCtaText ?? "Book a consultation"}
          </Link>

          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-red-600"
            >
              Email us
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
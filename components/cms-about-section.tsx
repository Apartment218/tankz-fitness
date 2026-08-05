import Link from "next/link";

import { prisma } from "@/lib/prisma";

export async function CmsAboutSection() {
  const content = await prisma.homepageContent.findUnique({
    where: { id: "main" },
  });

  if (!content?.aboutVisible) {
    return null;
  }

  const title =
    content.aboutTitle ??
    "More than workouts. A coaching system built for lasting progress.";

  const body =
    content.aboutBody ??
    "Tankz Fitness combines focused training, honest accountability and a plan that fits real life. Whether your goal is fat loss, strength, confidence or performance, every step is built around you.";

  return (
    <section id="about" className="relative overflow-hidden bg-white">
      <div className="absolute left-0 top-0 h-48 w-48 rounded-br-[8rem] bg-red-600/5" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
        <div className="relative">
          {content.aboutImageUrl ? (
            <img
              src={content.aboutImageUrl}
              alt={title}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl"
            />
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-950 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(220,38,38,.42),transparent_24%),linear-gradient(140deg,transparent,rgba(255,255,255,.08))]" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
                  Built for real people
                </p>
                <p className="mt-3 max-w-md text-4xl font-black leading-tight text-white">
                  Train with direction. Progress with confidence.
                </p>
              </div>
            </div>
          )}

          <div className="absolute -bottom-6 -right-4 rounded-2xl bg-red-600 p-6 text-white shadow-xl sm:-right-8">
            <p className="text-4xl font-black">01</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.2em]">
              Plan built for you
            </p>
          </div>
        </div>

        <div className="lg:pl-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
            {content.aboutEyebrow ?? "Your coaching experience"}
          </p>

          <h2 className="mt-5 max-w-3xl font-display text-5xl leading-[0.96] tracking-tight text-zinc-950 sm:text-6xl">
            {title}
          </h2>

          <div className="mt-7 whitespace-pre-line text-lg leading-8 text-zinc-600">
            {body}
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {[
              ["Personal strategy", "Training shaped around your goals and lifestyle."],
              ["Real accountability", "Regular support that keeps momentum moving."],
              ["Visible progress", "Clear milestones, measurements and adjustments."],
              ["Long-term habits", "A system you can maintain beyond a quick fix."],
            ].map(([heading, copy]) => (
              <div
                key={heading}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
              >
                <h3 className="font-black text-zinc-950">{heading}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{copy}</p>
              </div>
            ))}
          </div>

          <Link
            href={content.aboutButtonHref ?? "/#contact"}
            className="mt-9 inline-flex items-center justify-center rounded-full bg-zinc-950 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-600"
          >
            {content.aboutButtonText ?? "Book your consultation"}
          </Link>
        </div>
      </div>
    </section>
  );
}
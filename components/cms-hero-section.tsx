import Link from "next/link";

import { AnimatedCounter } from "@/components/animated-counter";
import { prisma } from "@/lib/prisma";

function renderHighlightedTitle(
  title: string,
  highlightedWord: string | null,
) {
  if (!highlightedWord) {
    return title;
  }

  const index = title
    .toLowerCase()
    .indexOf(highlightedWord.toLowerCase());

  if (index === -1) {
    return (
      <>
        {title}{" "}
        <span className="text-red-500">
          {highlightedWord}
        </span>
      </>
    );
  }

  const before = title.slice(0, index);
  const highlighted = title.slice(
    index,
    index + highlightedWord.length,
  );
  const after = title.slice(
    index + highlightedWord.length,
  );

  return (
    <>
      {before}
      <span className="text-red-500">
        {highlighted}
      </span>
      {after}
    </>
  );
}

export async function CmsHeroSection() {
  const [hero, legacyContent] = await Promise.all([
    prisma.homepageHero.findUnique({
      where: {
        id: "main",
      },
      include: {
        stats: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        badges: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),

    prisma.homepageContent.findUnique({
      where: {
        id: "main",
      },
    }),
  ]);

  if (hero && !hero.active) {
    return null;
  }

  const title =
    hero?.title ??
    legacyContent?.heroTitle ??
    "Train with purpose. Transform for life.";

  const subtitle =
    hero?.subtitle ??
    legacyContent?.heroSubtitle ??
    "Personal coaching, clear structure and real accountability.";

  const primaryText =
    hero?.primaryButtonText ??
    legacyContent?.heroPrimaryText ??
    "Start Today";

  const primaryHref =
    hero?.primaryButtonLink ??
    legacyContent?.heroPrimaryHref ??
    "/#contact";

  const secondaryText =
    hero?.secondaryButtonText ??
    legacyContent?.heroSecondaryText;

  const secondaryHref =
    hero?.secondaryButtonLink ??
    legacyContent?.heroSecondaryHref ??
    "/services";

  const imageUrl =
    hero?.backgroundImageUrl ??
    legacyContent?.heroImageUrl ??
    null;

  const videoUrl =
    hero?.backgroundType === "VIDEO"
      ? hero.backgroundVideoUrl
      : null;

  const overlayOpacity = hero?.overlayOpacity ?? 65;

  const stats =
    hero?.stats?.filter(
      (stat) => stat.value && stat.label,
    ) ?? [];

  const badges =
    hero?.badges
      ?.map((badge) => badge.text.trim())
      .filter(Boolean) ?? [];

  return (
    <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 -z-30">
        {videoUrl ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={imageUrl ?? undefined}
          >
            <source src={videoUrl} />
          </video>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.45),transparent_30%),linear-gradient(135deg,#09090b_0%,#18181b_52%,#09090b_100%)]" />
        )}
      </div>

      <div
        className="absolute inset-0 -z-20 bg-black"
        style={{
          opacity: overlayOpacity / 100,
        }}
      />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.24),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.38)_58%,rgba(0,0,0,0.62)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-zinc-950 to-transparent" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="w-full">
          <div className="max-w-5xl">
            <div className="inline-flex animate-[fadeUp_.8s_ease-out_both] items-center gap-3 rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.95)]" />

              <span className="text-xs font-black uppercase tracking-[0.24em] text-zinc-200">
                Coaching built for real results
              </span>
            </div>

            <h1 className="mt-7 max-w-5xl animate-[fadeUp_.9s_.1s_ease-out_both] font-display text-6xl leading-[0.88] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-9xl">
              {renderHighlightedTitle(
                title,
                hero?.highlightedWord ?? null,
              )}
            </h1>

            {subtitle ? (
              <p className="mt-7 max-w-2xl animate-[fadeUp_.9s_.2s_ease-out_both] text-lg leading-8 text-zinc-200 sm:text-xl">
                {subtitle}
              </p>
            ) : null}

            {badges.length > 0 ? (
              <div className="mt-7 flex animate-[fadeUp_.9s_.3s_ease-out_both] flex-wrap gap-3">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md"
                  >
                    <span className="text-red-400">✓</span>
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-9 flex animate-[fadeUp_.9s_.4s_ease-out_both] flex-wrap gap-4">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-red-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500"
              >
                {primaryText}
              </Link>

              {secondaryText ? (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-wider text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-zinc-950"
                >
                  {secondaryText}
                </Link>
              ) : null}
            </div>
          </div>

          {stats.length > 0 ? (
            <div className="mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.slice(0, 4).map((stat, index) => (
                <div
                  key={stat.id}
                  className="rounded-2xl border border-white/15 bg-black/30 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-red-400/60 hover:bg-black/45"
                  style={{
                    animation: `fadeUp .8s ${
                      0.45 + index * 0.1
                    }s ease-out both`,
                  }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    className="font-display text-4xl leading-none text-white sm:text-5xl"
                  />

                  <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 md:flex">
        <span className="text-[10px] font-black uppercase tracking-[0.28em]">
          Scroll
        </span>

        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-red-500 to-transparent" />
      </div>
    </section>
  );
}
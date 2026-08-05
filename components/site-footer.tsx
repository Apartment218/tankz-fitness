import Link from "next/link";

import { prisma } from "@/lib/prisma";

export async function SiteFooter() {
  const [settings, pages] = await Promise.all([
    prisma.siteSettings.upsert({
      where: { id: "main" },
      create: {
        id: "main",
        businessName: "Tankz Fitness",
      },
      update: {},
    }),

    prisma.websitePage.findMany({
      where: {
        published: true,
        showInFooter: true,
      },
      orderBy: [
        { footerOrder: "asc" },
        { title: "asc" },
      ],
    }),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_.6fr_.6fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={`${settings.businessName} logo`}
                  className="max-h-14 w-auto max-w-[240px] object-contain"
                />
              ) : (
                <span className="font-display text-4xl">
                  {settings.businessName}
                </span>
              )}
            </Link>

            {settings.tagline ? (
              <p className="mt-5 max-w-xl text-xl font-black">
                {settings.tagline}
              </p>
            ) : null}

            <p className="mt-4 max-w-xl leading-7 text-zinc-400">
              {settings.footerText ??
                "Personal training and online coaching designed around your goals, lifestyle and ambition."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
                >
                  Instagram
                </a>
              ) : null}

              {settings.facebookUrl ? (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
                >
                  Facebook
                </a>
              ) : null}

              {settings.tiktokUrl ? (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
                >
                  TikTok
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.24em] text-red-500">
              Explore
            </h2>

            <nav className="mt-5 flex flex-col gap-3">
              <Link href="/" className="text-zinc-400 transition hover:text-white">
                Home
              </Link>
              <Link href="/services" className="text-zinc-400 transition hover:text-white">
                Services
              </Link>
              <Link href="/#about" className="text-zinc-400 transition hover:text-white">
                About
              </Link>

              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="text-zinc-400 transition hover:text-white"
                >
                  {page.navigationLabel ?? page.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.24em] text-red-500">
              Contact
            </h2>

            <div className="mt-5 space-y-3 text-zinc-400">
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="block transition hover:text-white"
                >
                  {settings.email}
                </a>
              ) : null}

              {settings.phone ? (
                <a
                  href={`tel:${settings.phone}`}
                  className="block transition hover:text-white"
                >
                  {settings.phone}
                </a>
              ) : null}

              {settings.address ? (
                <p className="whitespace-pre-line leading-7">
                  {settings.address}
                </p>
              ) : null}
            </div>

            <Link
              href={settings.primaryCtaHref ?? "/#contact"}
              className="mt-7 inline-flex rounded-full bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-500"
            >
              {settings.primaryCtaText ?? "Start today"}
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-zinc-800 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.businessName}. All rights reserved.
          </p>

          <p>Built for progress.</p>
        </div>
      </div>
    </footer>
  );
}
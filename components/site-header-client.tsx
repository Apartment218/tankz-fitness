"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
};

type SiteHeaderClientProps = {
  businessName: string;
  logoUrl: string | null;
  primaryCtaText: string;
  primaryCtaHref: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  navigation: NavigationItem[];
};

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export function SiteHeaderClient({
  businessName,
  logoUrl,
  primaryCtaText,
  primaryCtaHref,
  instagramUrl,
  facebookUrl,
  navigation,
}: SiteHeaderClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function active(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    const path = href.split("#")[0];

    return Boolean(path && path !== "/" && pathname.startsWith(path));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${businessName} logo`}
                className="max-h-12 w-auto max-w-[210px] object-contain"
              />
            ) : (
              <span className="font-display text-3xl tracking-tight">
                {businessName}
              </span>
            )}
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={`relative py-2 text-xs font-black uppercase tracking-[0.16em] transition ${
                  active(item.href)
                    ? "text-red-500"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {item.label}

                {active(item.href) ? (
                  <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-6 rounded-full bg-red-500" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-zinc-400 transition hover:text-white"
              >
                IG
              </a>
            ) : null}

            {facebookUrl ? (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-zinc-400 transition hover:text-white"
              >
                FB
              </a>
            ) : null}

            <Link
              href={primaryCtaHref}
              className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-500"
            >
              {primaryCtaText}
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-zinc-950 px-4 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wider ${
                  active(item.href)
                    ? "bg-red-600 text-white"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={primaryCtaHref}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-black uppercase tracking-wider text-zinc-950"
            >
              {primaryCtaText}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
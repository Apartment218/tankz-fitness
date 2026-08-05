import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PublicWebsitePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicWebsitePageProps): Promise<Metadata> {
  const { slug } = await params;

  const page = await prisma.websitePage.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      excerpt: true,
      imageUrl: true,
      published: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  if (!page?.published) {
    return {};
  }

  return {
    title: page.seoTitle ?? page.title,
    description:
      page.seoDescription ??
      page.excerpt ??
      undefined,
    openGraph: {
      title: page.seoTitle ?? page.title,
      description:
        page.seoDescription ??
        page.excerpt ??
        undefined,
      images: page.imageUrl
        ? [
            {
              url: page.imageUrl,
            },
          ]
        : undefined,
    },
  };
}

export default async function PublicWebsitePage({
  params,
}: PublicWebsitePageProps) {
  const { slug } = await params;

  const page = await prisma.websitePage.findUnique({
    where: {
      slug,
    },
  });

  if (!page?.published) {
    notFound();
  }

  const paragraphs =
    page.content
      ?.split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <article>
        <header className="relative overflow-hidden bg-zinc-950 text-white">
          {page.imageUrl ? (
            <div className="absolute inset-0">
              <img
                src={page.imageUrl}
                alt=""
                className="h-full w-full object-cover opacity-35"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/35" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(220,38,38,.32),transparent_28%)]" />
          )}

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
              Tankz Fitness
            </p>

            <h1 className="mt-5 max-w-5xl font-display text-6xl leading-[0.92] tracking-tight sm:text-7xl">
              {page.title}
            </h1>

            {page.excerpt ? (
              <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl">
                {page.excerpt}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          {paragraphs.length > 0 ? (
            <div className="space-y-7">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  className="whitespace-pre-line text-lg leading-9 text-zinc-700"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-lg leading-8 text-zinc-600">
              This page is being updated.
            </p>
          )}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
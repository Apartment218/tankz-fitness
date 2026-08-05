import type { Metadata } from "next";

import { CmsAboutSection } from "@/components/cms-about-section";
import { CmsFollowSection } from "@/components/cms-follow-section";
import { CmsHeroSection } from "@/components/cms-hero-section";
import { HomeCtaSection } from "@/components/home-cta-section";
import { GallerySection } from "@/components/gallery-section";
import { FaqSection } from "@/components/faq-section";
import { HomepageStatsSection } from "@/components/homepage-stats-section";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TeamSection } from "@/components/team-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { TransformationsSection } from "@/components/transformations-section";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([
    prisma.homepageContent.findUnique({
      where: { id: "main" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "main" },
    }),
  ]);

  const title =
    content?.seoTitle ??
    `${settings?.businessName ?? "Tankz Fitness"} | Personal Training`;

  const description =
    content?.seoDescription ??
    content?.heroSubtitle ??
    "Personal training and online coaching built around your goals.";

  const canonical =
    content?.canonicalUrl ??
    settings?.siteUrl ??
    undefined;

  const socialTitle = content?.openGraphTitle ?? title;
  const socialDescription =
    content?.openGraphDescription ?? description;
  const socialImage =
    content?.openGraphImageUrl ??
    content?.heroImageUrl ??
    settings?.logoUrl ??
    undefined;

  return {
    title,
    description,
    keywords:
      content?.seoKeywords
        ?.split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean) ?? undefined,
    alternates: canonical ? { canonical } : undefined,
    robots: content?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      title: socialTitle,
      description: socialDescription,
      url: canonical,
      siteName: settings?.businessName ?? "Tankz Fitness",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: socialImage ? [socialImage] : undefined,
    },
    icons: settings?.faviconUrl
      ? { icon: settings.faviconUrl }
      : undefined,
  };
}

export default async function Page() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "main" },
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: settings?.businessName ?? "Tankz Fitness",
    url: settings?.siteUrl ?? undefined,
    logo: settings?.logoUrl ?? undefined,
    image: settings?.logoUrl ?? undefined,
    email: settings?.email ?? undefined,
    telephone: settings?.phone ?? undefined,
    address: settings?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
        }
      : undefined,
    sameAs: [
      settings?.instagramUrl,
      settings?.facebookUrl,
      settings?.youtubeUrl,
      settings?.tiktokUrl,
    ].filter(Boolean),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <SiteHeader />
      <CmsHeroSection />
      <HomepageStatsSection />
      <CmsAboutSection />
      <ServicesSection />
      <TeamSection />
      <TransformationsSection />
      <TestimonialsSection />
      <GallerySection />
      <FaqSection />
      <HomeCtaSection />
      <CmsFollowSection />
      <SiteFooter />
    </main>
  );
}
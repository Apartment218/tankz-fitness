import { prisma } from "@/lib/prisma";

import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const [settings, pages] = await Promise.all([
    prisma.siteSettings.upsert({
      where: {
        id: "main",
      },
      create: {
        id: "main",
        businessName: "Tankz Fitness",
      },
      update: {},
    }),

    prisma.websitePage.findMany({
      where: {
        published: true,
        showInHeader: true,
      },
      orderBy: [
        {
          headerOrder: "asc",
        },
        {
          title: "asc",
        },
      ],
      select: {
        title: true,
        slug: true,
        navigationLabel: true,
      },
    }),
  ]);

  const customNavigation = pages.map((page) => ({
    label: page.navigationLabel ?? page.title,
    href: `/${page.slug}`,
  }));

  const navigation = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/#about",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Transformations",
      href: "/#transformations",
    },
    {
      label: "Testimonials",
      href: "/#testimonials",
    },
    {
      label: "Gallery",
      href: "/gallery",
    },
    {
      label: "FAQ",
      href: "/faq",
    },
    ...customNavigation,
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  return (
    <SiteHeaderClient
      businessName={settings.businessName}
      logoUrl={settings.logoUrl}
      primaryCtaText={
        settings.primaryCtaText ?? "Start Today"
      }
      primaryCtaHref={
        settings.primaryCtaHref ?? "/contact"
      }
      instagramUrl={settings.instagramUrl}
      facebookUrl={settings.facebookUrl}
      navigation={navigation}
    />
  );
}
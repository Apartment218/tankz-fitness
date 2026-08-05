import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optional(formData: FormData, name: string) {
  return readText(formData, name) || null;
}

export async function updateHomepage(formData: FormData) {
  "use server";

  const heroTitle = readText(formData, "heroTitle");

  if (!heroTitle) {
    throw new Error("Hero title is required.");
  }

  const data = {
    heroEyebrow: optional(formData, "heroEyebrow"),
    heroTitle,
    heroSubtitle: optional(formData, "heroSubtitle"),
    heroPrimaryText: optional(formData, "heroPrimaryText"),
    heroPrimaryHref: optional(formData, "heroPrimaryHref"),
    heroSecondaryText: optional(formData, "heroSecondaryText"),
    heroSecondaryHref: optional(formData, "heroSecondaryHref"),
    heroImageUrl: optional(formData, "heroImageUrl"),
    heroVisible: formData.get("heroVisible") === "on",

    aboutEyebrow: optional(formData, "aboutEyebrow"),
    aboutTitle: optional(formData, "aboutTitle"),
    aboutBody: optional(formData, "aboutBody"),
    aboutImageUrl: optional(formData, "aboutImageUrl"),
    aboutButtonText: optional(formData, "aboutButtonText"),
    aboutButtonHref: optional(formData, "aboutButtonHref"),
    aboutVisible: formData.get("aboutVisible") === "on",

    servicesEyebrow: optional(formData, "servicesEyebrow"),
    servicesTitle: optional(formData, "servicesTitle"),
    servicesBody: optional(formData, "servicesBody"),
    servicesVisible: formData.get("servicesVisible") === "on",

    statsEyebrow: optional(formData, "statsEyebrow"),
    statsTitle: optional(formData, "statsTitle"),
    statOneValue: optional(formData, "statOneValue"),
    statOneLabel: optional(formData, "statOneLabel"),
    statTwoValue: optional(formData, "statTwoValue"),
    statTwoLabel: optional(formData, "statTwoLabel"),
    statThreeValue: optional(formData, "statThreeValue"),
    statThreeLabel: optional(formData, "statThreeLabel"),
    statFourValue: optional(formData, "statFourValue"),
    statFourLabel: optional(formData, "statFourLabel"),
    statsVisible: formData.get("statsVisible") === "on",

    followEyebrow: optional(formData, "followEyebrow"),
    followTitle: optional(formData, "followTitle"),
    followBody: optional(formData, "followBody"),
    followVisible: formData.get("followVisible") === "on",

    seoTitle: optional(formData, "seoTitle"),
    seoDescription: optional(formData, "seoDescription"),
    seoKeywords: optional(formData, "seoKeywords"),
    canonicalUrl: optional(formData, "canonicalUrl"),
    openGraphTitle: optional(formData, "openGraphTitle"),
    openGraphDescription: optional(
      formData,
      "openGraphDescription",
    ),
    openGraphImageUrl: optional(formData, "openGraphImageUrl"),
    noIndex: formData.get("noIndex") === "on",
  };

  await prisma.homepageContent.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      ...data,
    },
    update: data,
  });

  revalidatePath("/");
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/homepage");
}
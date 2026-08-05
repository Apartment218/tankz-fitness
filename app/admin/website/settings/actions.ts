import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readOptionalText(formData: FormData, name: string) {
  const value = readText(formData, name);

  return value || null;
}

export async function updateSiteSettings(formData: FormData) {
  "use server";

  const businessName = readText(formData, "businessName");

  if (!businessName) {
    throw new Error("Business name is required.");
  }

  await prisma.siteSettings.upsert({
    where: {
      id: "main",
    },
    create: {
      id: "main",
      businessName,
      tagline: readOptionalText(formData, "tagline"),
      logoUrl: readOptionalText(formData, "logoUrl"),
      faviconUrl: readOptionalText(formData, "faviconUrl"),
      phone: readOptionalText(formData, "phone"),
      email: readOptionalText(formData, "email"),
      address: readOptionalText(formData, "address"),
      instagramUrl: readOptionalText(
        formData,
        "instagramUrl",
      ),
      facebookUrl: readOptionalText(formData, "facebookUrl"),
      youtubeUrl: readOptionalText(formData, "youtubeUrl"),
      tiktokUrl: readOptionalText(formData, "tiktokUrl"),
      footerText: readOptionalText(formData, "footerText"),
      primaryCtaText: readOptionalText(
        formData,
        "primaryCtaText",
      ),
      primaryCtaHref: readOptionalText(
        formData,
        "primaryCtaHref",
      ),
    },
    update: {
      businessName,
      tagline: readOptionalText(formData, "tagline"),
      logoUrl: readOptionalText(formData, "logoUrl"),
      faviconUrl: readOptionalText(formData, "faviconUrl"),
      phone: readOptionalText(formData, "phone"),
      email: readOptionalText(formData, "email"),
      address: readOptionalText(formData, "address"),
      instagramUrl: readOptionalText(
        formData,
        "instagramUrl",
      ),
      facebookUrl: readOptionalText(formData, "facebookUrl"),
      youtubeUrl: readOptionalText(formData, "youtubeUrl"),
      tiktokUrl: readOptionalText(formData, "tiktokUrl"),
      footerText: readOptionalText(formData, "footerText"),
      primaryCtaText: readOptionalText(
        formData,
        "primaryCtaText",
      ),
      primaryCtaHref: readOptionalText(
        formData,
        "primaryCtaHref",
      ),
    },
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/settings");
}
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optional(formData: FormData, name: string) {
  return readText(formData, name) || null;
}

function integer(
  formData: FormData,
  name: string,
  fallback = 0,
) {
  const value = Number(readText(formData, name));

  return Number.isInteger(value) ? value : fallback;
}

export async function updateHomepageHero(
  formData: FormData,
) {
  "use server";

  const title = readText(formData, "title");

  if (!title) {
    throw new Error("Hero title is required.");
  }

  const backgroundType =
    readText(formData, "backgroundType") === "VIDEO"
      ? "VIDEO"
      : "IMAGE";

  const overlayOpacity = Math.min(
    90,
    Math.max(
      0,
      integer(formData, "overlayOpacity", 65),
    ),
  );

  const heroData = {
    title,
    highlightedWord: optional(
      formData,
      "highlightedWord",
    ),
    subtitle: optional(formData, "subtitle"),
    primaryButtonText:
      readText(formData, "primaryButtonText") ||
      "Start Today",
    primaryButtonLink:
      readText(formData, "primaryButtonLink") ||
      "/#contact",
    secondaryButtonText: optional(
      formData,
      "secondaryButtonText",
    ),
    secondaryButtonLink: optional(
      formData,
      "secondaryButtonLink",
    ),
    backgroundType,
    backgroundImageUrl: optional(
      formData,
      "backgroundImageUrl",
    ),
    backgroundVideoUrl: optional(
      formData,
      "backgroundVideoUrl",
    ),
    overlayOpacity,
    active: formData.get("active") === "on",
  } as const;

  await prisma.homepageHero.upsert({
    where: {
      id: "main",
    },
    create: {
      id: "main",
      ...heroData,
    },
    update: heroData,
  });

  const stats = [1, 2, 3, 4]
    .map((number, index) => ({
      value: readText(formData, `stat${number}Value`),
      label: readText(formData, `stat${number}Label`),
      sortOrder: index,
    }))
    .filter((stat) => stat.value && stat.label);

  const badges = [1, 2, 3, 4]
    .map((number, index) => ({
      text: readText(formData, `badge${number}Text`),
      sortOrder: index,
    }))
    .filter((badge) => badge.text);

  await prisma.$transaction([
    prisma.heroStat.deleteMany({
      where: {
        heroId: "main",
      },
    }),
    prisma.heroBadge.deleteMany({
      where: {
        heroId: "main",
      },
    }),
    ...(stats.length > 0
      ? [
          prisma.heroStat.createMany({
            data: stats.map((stat) => ({
              heroId: "main",
              ...stat,
            })),
          }),
        ]
      : []),
    ...(badges.length > 0
      ? [
          prisma.heroBadge.createMany({
            data: badges.map((badge) => ({
              heroId: "main",
              ...badge,
            })),
          }),
        ]
      : []),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/homepage");
  revalidatePath("/admin/website/homepage/hero");
}
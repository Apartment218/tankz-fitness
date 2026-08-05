import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optional(formData: FormData, name: string) {
  return readText(formData, name) || null;
}

function integer(formData: FormData, name: string) {
  const value = Number(readText(formData, name));

  return Number.isInteger(value) ? value : 0;
}

function refreshGallery() {
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/gallery");
}

export async function createGalleryImage(formData: FormData) {
  "use server";

  const imageUrl = readText(formData, "imageUrl");

  if (!imageUrl) {
    throw new Error("Choose an image before saving.");
  }

  await prisma.galleryImage.create({
    data: {
      title: optional(formData, "title"),
      caption: optional(formData, "caption"),
      category: optional(formData, "category"),
      imageUrl,
      altText: optional(formData, "altText"),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: integer(formData, "sortOrder"),
    },
  });

  refreshGallery();
}

export async function updateGalleryImage(
  imageId: string,
  formData: FormData,
) {
  "use server";

  const imageUrl = readText(formData, "imageUrl");

  if (!imageUrl) {
    throw new Error("Gallery image is required.");
  }

  await prisma.galleryImage.update({
    where: {
      id: imageId,
    },
    data: {
      title: optional(formData, "title"),
      caption: optional(formData, "caption"),
      category: optional(formData, "category"),
      imageUrl,
      altText: optional(formData, "altText"),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: integer(formData, "sortOrder"),
    },
  });

  refreshGallery();
}

export async function deleteGalleryImage(imageId: string) {
  "use server";

  await prisma.galleryImage.delete({
    where: {
      id: imageId,
    },
  });

  refreshGallery();
}
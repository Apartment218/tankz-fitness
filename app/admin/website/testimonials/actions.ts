import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readOptionalText(formData: FormData, name: string) {
  const value = readText(formData, name);

  return value.length > 0 ? value : null;
}

function readInteger(
  formData: FormData,
  name: string,
  fallback = 0,
) {
  const value = Number(readText(formData, name));

  return Number.isInteger(value) ? value : fallback;
}

function readRating(formData: FormData) {
  return Math.min(
    5,
    Math.max(1, readInteger(formData, "rating", 5)),
  );
}

function refreshTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/testimonials");
}

export async function createTestimonial(
  formData: FormData,
) {
  "use server";

  const clientName = readText(formData, "clientName");
  const quote = readText(formData, "quote");

  if (!clientName || !quote) {
    throw new Error(
      "Client name and testimonial are required.",
    );
  }

  await prisma.testimonial.create({
    data: {
      clientName,
      headline: readOptionalText(formData, "headline"),
      quote,
      result: readOptionalText(formData, "result"),
      imageUrl: readOptionalText(formData, "imageUrl"),
      rating: readRating(formData),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: readInteger(formData, "sortOrder"),
    },
  });

  refreshTestimonials();
}

export async function updateTestimonial(
  testimonialId: string,
  formData: FormData,
) {
  "use server";

  const clientName = readText(formData, "clientName");
  const quote = readText(formData, "quote");

  if (!clientName || !quote) {
    throw new Error(
      "Client name and testimonial are required.",
    );
  }

  await prisma.testimonial.update({
    where: {
      id: testimonialId,
    },
    data: {
      clientName,
      headline: readOptionalText(formData, "headline"),
      quote,
      result: readOptionalText(formData, "result"),
      imageUrl: readOptionalText(formData, "imageUrl"),
      rating: readRating(formData),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: readInteger(formData, "sortOrder"),
    },
  });

  refreshTestimonials();
}

export async function deleteTestimonial(
  testimonialId: string,
) {
  "use server";

  await prisma.testimonial.delete({
    where: {
      id: testimonialId,
    },
  });

  refreshTestimonials();
}
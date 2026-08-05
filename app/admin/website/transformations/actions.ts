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

function revalidateTransformationPages() {
  revalidatePath("/");
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/transformations");
}

export async function createTransformation(
  formData: FormData,
) {
  "use server";

  const title = readText(formData, "title");

  if (!title) {
    throw new Error("Transformation title is required.");
  }

  await prisma.transformation.create({
    data: {
      title,
      clientName: readOptionalText(formData, "clientName"),
      summary: readOptionalText(formData, "summary"),
      result: readOptionalText(formData, "result"),
      durationLabel: readOptionalText(
        formData,
        "durationLabel",
      ),
      beforeImageUrl: readOptionalText(
        formData,
        "beforeImageUrl",
      ),
      afterImageUrl: readOptionalText(
        formData,
        "afterImageUrl",
      ),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: readInteger(formData, "sortOrder"),
    },
  });

  revalidateTransformationPages();
}

export async function updateTransformation(
  transformationId: string,
  formData: FormData,
) {
  "use server";

  const title = readText(formData, "title");

  if (!title) {
    throw new Error("Transformation title is required.");
  }

  await prisma.transformation.update({
    where: {
      id: transformationId,
    },
    data: {
      title,
      clientName: readOptionalText(formData, "clientName"),
      summary: readOptionalText(formData, "summary"),
      result: readOptionalText(formData, "result"),
      durationLabel: readOptionalText(
        formData,
        "durationLabel",
      ),
      beforeImageUrl: readOptionalText(
        formData,
        "beforeImageUrl",
      ),
      afterImageUrl: readOptionalText(
        formData,
        "afterImageUrl",
      ),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: readInteger(formData, "sortOrder"),
    },
  });

  revalidateTransformationPages();
}

export async function deleteTransformation(
  transformationId: string,
) {
  "use server";

  await prisma.transformation.delete({
    where: {
      id: transformationId,
    },
  });

  revalidateTransformationPages();
}
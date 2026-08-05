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

function refreshFaq() {
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/faq");
}

export async function createFaq(formData: FormData) {
  "use server";

  const question = readText(formData, "question");
  const answer = readText(formData, "answer");

  if (!question || !answer) {
    throw new Error("Question and answer are required.");
  }

  await prisma.frequentlyAskedQuestion.create({
    data: {
      question,
      answer,
      category: optional(formData, "category"),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: integer(formData, "sortOrder"),
    },
  });

  refreshFaq();
}

export async function updateFaq(
  faqId: string,
  formData: FormData,
) {
  "use server";

  const question = readText(formData, "question");
  const answer = readText(formData, "answer");

  if (!question || !answer) {
    throw new Error("Question and answer are required.");
  }

  await prisma.frequentlyAskedQuestion.update({
    where: {
      id: faqId,
    },
    data: {
      question,
      answer,
      category: optional(formData, "category"),
      featured: formData.get("featured") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      active: formData.get("active") === "on",
      sortOrder: integer(formData, "sortOrder"),
    },
  });

  refreshFaq();
}

export async function deleteFaq(faqId: string) {
  "use server";

  await prisma.frequentlyAskedQuestion.delete({
    where: {
      id: faqId,
    },
  });

  refreshFaq();
}
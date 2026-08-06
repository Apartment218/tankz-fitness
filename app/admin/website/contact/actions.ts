"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function readRequiredText(
  formData: FormData,
  name: string,
) {
  const value = String(
    formData.get(name) ?? "",
  ).trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function readOptionalText(
  formData: FormData,
  name: string,
) {
  const value = String(
    formData.get(name) ?? "",
  ).trim();

  return value || null;
}

export async function updateContactPage(
  formData: FormData,
) {
  const businessName = readRequiredText(
    formData,
    "businessName",
  );

  const phone = readOptionalText(
    formData,
    "phone",
  );

  const email = readOptionalText(
    formData,
    "email",
  );

  const address = readOptionalText(
    formData,
    "address",
  );

  const heroEyebrow = readRequiredText(
    formData,
    "heroEyebrow",
  );

  const heroTitle = readRequiredText(
    formData,
    "heroTitle",
  );

  const heroBody = readRequiredText(
    formData,
    "heroBody",
  );

  const highlightOne = readRequiredText(
    formData,
    "highlightOne",
  );

  const highlightTwo = readRequiredText(
    formData,
    "highlightTwo",
  );

  const highlightThree = readRequiredText(
    formData,
    "highlightThree",
  );

  const stepsEyebrow = readRequiredText(
    formData,
    "stepsEyebrow",
  );

  const stepOneTitle = readRequiredText(
    formData,
    "stepOneTitle",
  );

  const stepOneBody = readRequiredText(
    formData,
    "stepOneBody",
  );

  const stepTwoTitle = readRequiredText(
    formData,
    "stepTwoTitle",
  );

  const stepTwoBody = readRequiredText(
    formData,
    "stepTwoBody",
  );

  const stepThreeTitle = readRequiredText(
    formData,
    "stepThreeTitle",
  );

  const stepThreeBody = readRequiredText(
    formData,
    "stepThreeBody",
  );

  const coachingPrompt = readRequiredText(
    formData,
    "coachingPrompt",
  );

  const coachingButtonText =
    readRequiredText(
      formData,
      "coachingButtonText",
    );

  const coachingButtonHref =
    readRequiredText(
      formData,
      "coachingButtonHref",
    );

  const formEyebrow = readRequiredText(
    formData,
    "formEyebrow",
  );

  const formTitle = readRequiredText(
    formData,
    "formTitle",
  );

  const formBody = readRequiredText(
    formData,
    "formBody",
  );

  const successTitle = readRequiredText(
    formData,
    "successTitle",
  );

  const successBody = readRequiredText(
    formData,
    "successBody",
  );

  const consentText = readRequiredText(
    formData,
    "consentText",
  );

  const mapEmbedUrl = readOptionalText(
    formData,
    "mapEmbedUrl",
  );

  const seoTitle = readOptionalText(
    formData,
    "seoTitle",
  );

  const seoDescription = readOptionalText(
    formData,
    "seoDescription",
  );

  await prisma.$transaction([
    prisma.siteSettings.upsert({
      where: {
        id: "main",
      },
      create: {
        id: "main",
        businessName,
        phone,
        email,
        address,
      },
      update: {
        businessName,
        phone,
        email,
        address,
      },
    }),

    prisma.contactPageContent.upsert({
      where: {
        id: "main",
      },
      create: {
        id: "main",
        heroEyebrow,
        heroTitle,
        heroBody,
        highlightOne,
        highlightTwo,
        highlightThree,
        stepsEyebrow,
        stepOneTitle,
        stepOneBody,
        stepTwoTitle,
        stepTwoBody,
        stepThreeTitle,
        stepThreeBody,
        coachingPrompt,
        coachingButtonText,
        coachingButtonHref,
        formEyebrow,
        formTitle,
        formBody,
        successTitle,
        successBody,
        consentText,
        mapEmbedUrl,
        seoTitle,
        seoDescription,
      },
      update: {
        heroEyebrow,
        heroTitle,
        heroBody,
        highlightOne,
        highlightTwo,
        highlightThree,
        stepsEyebrow,
        stepOneTitle,
        stepOneBody,
        stepTwoTitle,
        stepTwoBody,
        stepThreeTitle,
        stepThreeBody,
        coachingPrompt,
        coachingButtonText,
        coachingButtonHref,
        formEyebrow,
        formTitle,
        formBody,
        successTitle,
        successBody,
        consentText,
        mapEmbedUrl,
        seoTitle,
        seoDescription,
      },
    }),
  ]);

  revalidatePath("/contact");
  revalidatePath("/admin/website/contact");
  revalidatePath("/admin/website");

  redirect("/admin/website/contact?saved=1");
}
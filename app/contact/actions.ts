import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { LeadStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optional(formData: FormData, name: string) {
  return readText(formData, name) || null;
}

export async function submitContactForm(
  formData: FormData,
) {
  "use server";

  const firstName = readText(formData, "firstName");
  const email = readText(formData, "email");
  const message = readText(formData, "message");

  if (!firstName || !email || !message) {
    throw new Error(
      "First name, email address and message are required.",
    );
  }

  await prisma.lead.create({
    data: {
      firstName,
      lastName: optional(formData, "lastName"),
      email: email.toLowerCase(),
      phone: optional(formData, "phone"),
      goal: optional(formData, "goal"),
      subject: optional(formData, "subject"),
      message,
      status: LeadStatus.NEW,
      converted: false,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/contact");

  redirect("/contact?sent=1");
}
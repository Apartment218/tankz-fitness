import { revalidatePath } from "next/cache";

import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function readRequiredText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function readOptionalText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  return value || null;
}

function readPrice(formData: FormData) {
  const rawValue = String(formData.get("price") ?? "").trim();
  const value = Number(rawValue);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Price must be a valid positive number.");
  }

  return new Prisma.Decimal(value);
}

function readDurationDays(formData: FormData) {
  const rawValue = String(formData.get("durationDays") ?? "").trim();
  const value = Number(rawValue);

  if (!Number.isInteger(value) || value < 1) {
    throw new Error("Duration must be at least 1 day.");
  }

  return value;
}

function revalidateServicePages() {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  "use server";

  await prisma.membershipPlan.create({
    data: {
      name: readRequiredText(formData, "name"),
      description: readOptionalText(formData, "description"),
      price: readPrice(formData),
      durationDays: readDurationDays(formData),
      active: formData.get("active") === "on",
    },
  });

  revalidateServicePages();
}

export async function updateService(
  serviceId: string,
  formData: FormData,
) {
  "use server";

  await prisma.membershipPlan.update({
    where: {
      id: serviceId,
    },
    data: {
      name: readRequiredText(formData, "name"),
      description: readOptionalText(formData, "description"),
      price: readPrice(formData),
      durationDays: readDurationDays(formData),
      active: formData.get("active") === "on",
    },
  });

  revalidateServicePages();
}

export async function toggleService(
  serviceId: string,
  active: boolean,
) {
  "use server";

  await prisma.membershipPlan.update({
    where: {
      id: serviceId,
    },
    data: {
      active,
    },
  });

  revalidateServicePages();
}

export async function deleteService(serviceId: string) {
  "use server";

  const assignedCount = await prisma.membership.count({
    where: {
      planId: serviceId,
    },
  });

  if (assignedCount > 0) {
    throw new Error(
      "This service cannot be deleted because it is assigned to one or more clients. Deactivate it instead.",
    );
  }

  await prisma.membershipPlan.delete({
    where: {
      id: serviceId,
    },
  });

  revalidateServicePages();
}
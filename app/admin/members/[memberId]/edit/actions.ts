import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import {
  ClientGoal,
  MemberStatus,
  Prisma,
} from "@/lib/generated/prisma/client";
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

function readOptionalDate(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${name} must be a valid date.`);
  }

  return date;
}

function readOptionalDecimal(
  formData: FormData,
  name: string,
  options?: {
    minimum?: number;
    maximum?: number;
  },
) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    return null;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${name} must be a valid number.`);
  }

  if (
    options?.minimum !== undefined &&
    numberValue < options.minimum
  ) {
    throw new Error(
      `${name} must be at least ${options.minimum}.`,
    );
  }

  if (
    options?.maximum !== undefined &&
    numberValue > options.maximum
  ) {
    throw new Error(
      `${name} must be no more than ${options.maximum}.`,
    );
  }

  return new Prisma.Decimal(numberValue);
}

function readMemberStatus(formData: FormData) {
  const value = String(formData.get("status") ?? "").trim();

  if (!Object.values(MemberStatus).includes(value as MemberStatus)) {
    throw new Error("A valid client status is required.");
  }

  return value as MemberStatus;
}

function readClientGoal(formData: FormData) {
  const value = String(formData.get("goal") ?? "").trim();

  if (!value) {
    return null;
  }

  if (!Object.values(ClientGoal).includes(value as ClientGoal)) {
    throw new Error("The selected coaching goal is invalid.");
  }

  return value as ClientGoal;
}

export async function updateClient(
  memberId: string,
  formData: FormData,
) {
  "use server";

  const firstName = readRequiredText(formData, "firstName");
  const lastName = readRequiredText(formData, "lastName");

  const email = readRequiredText(formData, "email").toLowerCase();

  const existingClient = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    select: {
      id: true,
    },
  });

  if (!existingClient) {
    notFound();
  }

  const emailOwner = await prisma.member.findFirst({
    where: {
      email,
      NOT: {
        id: memberId,
      },
    },
    select: {
      id: true,
    },
  });

  if (emailOwner) {
    throw new Error(
      "Another client already uses this email address.",
    );
  }

  await prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      firstName,
      lastName,
      email,
      phone: readOptionalText(formData, "phone"),
      dateOfBirth: readOptionalDate(formData, "dateOfBirth"),
      addressLine1: readOptionalText(formData, "addressLine1"),
      addressLine2: readOptionalText(formData, "addressLine2"),
      city: readOptionalText(formData, "city"),
      postcode: readOptionalText(formData, "postcode"),
      emergencyName: readOptionalText(
        formData,
        "emergencyName",
      ),
      emergencyPhone: readOptionalText(
        formData,
        "emergencyPhone",
      ),
      notes: readOptionalText(formData, "notes"),
      status: readMemberStatus(formData),
      goal: readClientGoal(formData),
      goalDescription: readOptionalText(
        formData,
        "goalDescription",
      ),
      startingWeightKg: readOptionalDecimal(
        formData,
        "startingWeightKg",
        {
          minimum: 1,
          maximum: 500,
        },
      ),
      currentWeightKg: readOptionalDecimal(
        formData,
        "currentWeightKg",
        {
          minimum: 1,
          maximum: 500,
        },
      ),
      targetWeightKg: readOptionalDecimal(
        formData,
        "targetWeightKg",
        {
          minimum: 1,
          maximum: 500,
        },
      ),
      heightCm: readOptionalDecimal(formData, "heightCm", {
        minimum: 50,
        maximum: 300,
      }),
      bodyFatPercentage: readOptionalDecimal(
        formData,
        "bodyFatPercentage",
        {
          minimum: 0,
          maximum: 100,
        },
      ),
      consultationDate: readOptionalDate(
        formData,
        "consultationDate",
      ),
      coachNotes: readOptionalText(formData, "coachNotes"),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath(`/admin/members/${memberId}/edit`);

  redirect(`/admin/members/${memberId}`);
}

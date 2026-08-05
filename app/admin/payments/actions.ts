"use server";

import { revalidatePath } from "next/cache";

import {
  PaymentMethod,
  PaymentStatus,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type PaymentActionResult = {
  success: boolean;
  message: string;
};

function getOptionalText(
  formData: FormData,
  field: string
): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

function getAmount(formData: FormData): string {
  const value = formData.get("amount");

  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Amount is required.");
  }

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than £0.");
  }

  return amount.toFixed(2);
}

function getCurrency(formData: FormData): string {
  const value = formData.get("currency");

  if (typeof value !== "string" || !value.trim()) {
    return "GBP";
  }

  const currency = value.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error(
      "Currency must be a valid three-letter code."
    );
  }

  return currency;
}

function getStatus(formData: FormData): PaymentStatus {
  const value = formData.get("status");

  if (
    typeof value !== "string" ||
    !Object.values(PaymentStatus).includes(
      value as PaymentStatus
    )
  ) {
    throw new Error("A valid payment status is required.");
  }

  return value as PaymentStatus;
}

function getMethod(
  formData: FormData
): PaymentMethod | null {
  const value = formData.get("method");

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  if (
    !Object.values(PaymentMethod).includes(
      value as PaymentMethod
    )
  ) {
    throw new Error("A valid payment method is required.");
  }

  return value as PaymentMethod;
}

function getPaidAt(
  formData: FormData,
  status: PaymentStatus
): Date | null {
  const value = formData.get("paidAt");

  if (typeof value === "string" && value.trim()) {
    const paidAt = new Date(value);

    if (Number.isNaN(paidAt.getTime())) {
      throw new Error("Paid date is invalid.");
    }

    return paidAt;
  }

  if (status === PaymentStatus.PAID) {
    return new Date();
  }

  return null;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function isRecordNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

function getErrorMessage(error: unknown): string {
  if (isUniqueConstraintError(error)) {
    return "A payment with this reference already exists.";
  }

  if (isRecordNotFoundError(error)) {
    return "The payment could not be found.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export async function createPayment(
  formData: FormData
): Promise<PaymentActionResult> {
  try {
    const memberId = getOptionalText(formData, "memberId");
    const amount = getAmount(formData);
    const currency = getCurrency(formData);
    const status = getStatus(formData);
    const method = getMethod(formData);
    const reference = getOptionalText(
      formData,
      "reference"
    );
    const description = getOptionalText(
      formData,
      "description"
    );
    const paidAt = getPaidAt(formData, status);

    if (memberId) {
      const memberExists = await prisma.member.count({
        where: {
          id: memberId,
        },
      });

      if (!memberExists) {
        throw new Error(
          "The selected member could not be found."
        );
      }
    }

    await prisma.payment.create({
      data: {
        memberId,
        amount,
        currency,
        status,
        method,
        reference,
        description,
        paidAt,
      },
    });

    revalidatePath("/admin/payments");

    return {
      success: true,
      message: "Payment created successfully.",
    };
  } catch (error) {
    console.error("Create payment error:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function updatePayment(
  paymentId: string,
  formData: FormData
): Promise<PaymentActionResult> {
  try {
    if (!paymentId.trim()) {
      throw new Error("Payment ID is required.");
    }

    const memberId = getOptionalText(formData, "memberId");
    const amount = getAmount(formData);
    const currency = getCurrency(formData);
    const status = getStatus(formData);
    const method = getMethod(formData);
    const reference = getOptionalText(
      formData,
      "reference"
    );
    const description = getOptionalText(
      formData,
      "description"
    );
    const paidAt = getPaidAt(formData, status);

    if (memberId) {
      const memberExists = await prisma.member.count({
        where: {
          id: memberId,
        },
      });

      if (!memberExists) {
        throw new Error(
          "The selected member could not be found."
        );
      }
    }

    await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        memberId,
        amount,
        currency,
        status,
        method,
        reference,
        description,
        paidAt,
      },
    });

    revalidatePath("/admin/payments");

    return {
      success: true,
      message: "Payment updated successfully.",
    };
  } catch (error) {
    console.error("Update payment error:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function deletePayment(
  paymentId: string
): Promise<PaymentActionResult> {
  try {
    if (!paymentId.trim()) {
      throw new Error("Payment ID is required.");
    }

    await prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });

    revalidatePath("/admin/payments");

    return {
      success: true,
      message: "Payment deleted successfully.",
    };
  } catch (error) {
    console.error("Delete payment error:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
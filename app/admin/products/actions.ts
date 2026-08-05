"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type ProductActionResult = {
  success: boolean;
  message: string;
};

function getRequiredText(
  formData: FormData,
  field: string,
  label: string
): string {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }

  return value.trim();
}

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

function getPrice(formData: FormData): string {
  const value = formData.get("price");

  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Price is required.");
  }

  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be £0 or greater.");
  }

  return price.toFixed(2);
}

function getStock(formData: FormData): number {
  const value = formData.get("stock");

  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Stock is required.");
  }

  const stock = Number(value);

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a whole number of 0 or greater.");
  }

  return stock;
}

function getActive(formData: FormData): boolean {
  const value = formData.get("active");

  return value === "true" || value === "on";
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function getErrorMessage(error: unknown): string {
  if (isUniqueConstraintError(error)) {
    return "A product with this SKU already exists.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export async function createProduct(
  formData: FormData
): Promise<ProductActionResult> {
  try {
    const name = getRequiredText(formData, "name", "Product name");
    const description = getOptionalText(formData, "description");
    const price = getPrice(formData);
    const stock = getStock(formData);
    const sku = getOptionalText(formData, "sku");
    const active = getActive(formData);

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        sku,
        active,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully.",
    };
  } catch (error) {
    console.error("Create product error:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function updateProduct(
  productId: string,
  formData: FormData
): Promise<ProductActionResult> {
  try {
    if (!productId.trim()) {
      throw new Error("Product ID is required.");
    }

    const name = getRequiredText(formData, "name", "Product name");
    const description = getOptionalText(formData, "description");
    const price = getPrice(formData);
    const stock = getStock(formData);
    const sku = getOptionalText(formData, "sku");
    const active = getActive(formData);

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price,
        stock,
        sku,
        active,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully.",
    };
  } catch (error) {
    console.error("Update product error:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function deleteProduct(
  productId: string
): Promise<ProductActionResult> {
  try {
    if (!productId.trim()) {
      throw new Error("Product ID is required.");
    }

    const orderItemCount = await prisma.orderItem.count({
      where: {
        productId,
      },
    });

    if (orderItemCount > 0) {
      return {
        success: false,
        message:
          "This product cannot be deleted because it appears in an existing order. Mark it as inactive instead.",
      };
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully.",
    };
  } catch (error) {
    console.error("Delete product error:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateWebsitePages(slug?: string) {
  revalidatePath("/admin/website");
  revalidatePath("/admin/website/pages");
  revalidatePath("/");

  if (slug) {
    revalidatePath(`/${slug}`);
  }
}

export async function createWebsitePage(formData: FormData) {
  "use server";

  const title = readText(formData, "title");
  const requestedSlug = readText(formData, "slug");
  const slug = createSlug(requestedSlug || title);

  if (!title) {
    throw new Error("Page title is required.");
  }

  if (!slug) {
    throw new Error("Enter a valid page title or URL slug.");
  }

  const existingPage = await prisma.websitePage.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (existingPage) {
    throw new Error(
      "A website page already uses this URL slug.",
    );
  }

  const page = await prisma.websitePage.create({
    data: {
      title,
      slug,
      navigationLabel: optional(
        formData,
        "navigationLabel",
      ),
      excerpt: optional(formData, "excerpt"),
      content: optional(formData, "content"),
      imageUrl: optional(formData, "imageUrl"),
      published: formData.get("published") === "on",
      showInHeader: formData.get("showInHeader") === "on",
      showInFooter: formData.get("showInFooter") === "on",
      headerOrder: integer(formData, "headerOrder"),
      footerOrder: integer(formData, "footerOrder"),
      seoTitle: optional(formData, "seoTitle"),
      seoDescription: optional(
        formData,
        "seoDescription",
      ),
    },
  });

  revalidateWebsitePages(page.slug);
  redirect(`/admin/website/pages/${page.id}`);
}

export async function updateWebsitePage(
  pageId: string,
  formData: FormData,
) {
  "use server";

  const currentPage = await prisma.websitePage.findUnique({
    where: {
      id: pageId,
    },
    select: {
      slug: true,
    },
  });

  if (!currentPage) {
    throw new Error("Website page not found.");
  }

  const title = readText(formData, "title");
  const slug = createSlug(readText(formData, "slug"));

  if (!title || !slug) {
    throw new Error("Page title and URL slug are required.");
  }

  const slugOwner = await prisma.websitePage.findFirst({
    where: {
      slug,
      NOT: {
        id: pageId,
      },
    },
    select: {
      id: true,
    },
  });

  if (slugOwner) {
    throw new Error(
      "Another website page already uses this URL slug.",
    );
  }

  await prisma.websitePage.update({
    where: {
      id: pageId,
    },
    data: {
      title,
      slug,
      navigationLabel: optional(
        formData,
        "navigationLabel",
      ),
      excerpt: optional(formData, "excerpt"),
      content: optional(formData, "content"),
      imageUrl: optional(formData, "imageUrl"),
      published: formData.get("published") === "on",
      showInHeader: formData.get("showInHeader") === "on",
      showInFooter: formData.get("showInFooter") === "on",
      headerOrder: integer(formData, "headerOrder"),
      footerOrder: integer(formData, "footerOrder"),
      seoTitle: optional(formData, "seoTitle"),
      seoDescription: optional(
        formData,
        "seoDescription",
      ),
    },
  });

  revalidateWebsitePages(currentPage.slug);
  revalidateWebsitePages(slug);
}

export async function deleteWebsitePage(pageId: string) {
  "use server";

  const page = await prisma.websitePage.delete({
    where: {
      id: pageId,
    },
  });

  revalidateWebsitePages(page.slug);
  redirect("/admin/website/pages");
}
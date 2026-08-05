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

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/staff");
  revalidatePath("/admin/website/team");
}

export async function updatePublicTeamMember(
  staffId: string,
  formData: FormData,
) {
  "use server";

  await prisma.staff.update({
    where: {
      id: staffId,
    },
    data: {
      publicProfile: formData.get("publicProfile") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      featured: formData.get("featured") === "on",
      sortOrder: integer(formData, "sortOrder"),
      jobTitle: optional(formData, "jobTitle"),
      bio: optional(formData, "bio"),
      qualifications: optional(formData, "qualifications"),
      specialities: optional(formData, "specialities"),
      imageUrl: optional(formData, "imageUrl"),
      instagramUrl: optional(formData, "instagramUrl"),
      bookingHref: optional(formData, "bookingHref"),
    },
  });

  refresh();
}
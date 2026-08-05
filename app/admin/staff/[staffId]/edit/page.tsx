import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { StaffRole } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type EditStaffPageProps = {
  params: Promise<{
    staffId: string;
  }>;
};

const STAFF_ROLES = [
  StaffRole.ADMIN,
  StaffRole.MANAGER,
  StaffRole.TRAINER,
  StaffRole.RECEPTION,
];

function formatRole(role: StaffRole) {
  return role
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function EditStaffPage({
  params,
}: EditStaffPageProps) {
  const { staffId } = await params;

  const staffMember = await prisma.staff.findUnique({
    where: {
      id: staffId,
    },
  });

  if (!staffMember) {
    notFound();
  }

  async function updateStaffMember(formData: FormData) {
    "use server";

    const firstName = String(
      formData.get("firstName") ?? "",
    ).trim();

    const lastName = String(
      formData.get("lastName") ?? "",
    ).trim();

    const email = String(
      formData.get("email") ?? "",
    )
      .trim()
      .toLowerCase();

    const phoneValue = String(
      formData.get("phone") ?? "",
    ).trim();

    const roleValue = String(
      formData.get("role") ?? "",
    ).trim();

    const active =
      String(formData.get("active") ?? "") === "true";

    if (!firstName || !lastName || !email) {
      throw new Error(
        "First name, last name and email are required.",
      );
    }

    if (!STAFF_ROLES.includes(roleValue as StaffRole)) {
      throw new Error("Please select a valid staff role.");
    }

    const conflictingStaff =
      await prisma.staff.findFirst({
        where: {
          email,
          NOT: {
            id: staffId,
          },
        },
        select: {
          id: true,
        },
      });

    if (conflictingStaff) {
      throw new Error(
        "Another staff member already uses this email address.",
      );
    }

    await prisma.staff.update({
      where: {
        id: staffId,
      },
      data: {
        firstName,
        lastName,
        email,
        phone: phoneValue || null,
        role: roleValue as StaffRole,
        active,
      },
    });

    revalidatePath("/admin/staff");
    revalidatePath(`/admin/staff/${staffId}`);
    revalidatePath(`/admin/staff/${staffId}/edit`);
    revalidatePath("/admin/sessions");

    redirect(`/admin/staff/${staffId}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-black">
      <header>
        <Link
          href={`/admin/staff/${staffMember.id}`}
          className="font-bold text-red-600 hover:underline"
        >
          ← Back to staff profile
        </Link>

        <h1 className="mt-4 text-4xl font-black">
          Edit Staff Member
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Update {staffMember.firstName}{" "}
          {staffMember.lastName}&apos;s details.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form
          action={updateStaffMember}
          className="space-y-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-bold">
                First name
              </span>

              <input
                type="text"
                name="firstName"
                required
                autoComplete="given-name"
                defaultValue={staffMember.firstName}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-bold">
                Last name
              </span>

              <input
                type="text"
                name="lastName"
                required
                autoComplete="family-name"
                defaultValue={staffMember.lastName}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block font-bold">
              Email address
            </span>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              defaultValue={staffMember.email}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
            />

            <span className="mt-2 block text-sm text-gray-500">
              Each staff member must have a unique email
              address.
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block font-bold">
              Phone number
            </span>

            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              defaultValue={staffMember.phone ?? ""}
              placeholder="Optional phone number"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-500 focus:border-red-600"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-bold">
              Staff role
            </span>

            <select
              name="role"
              required
              defaultValue={staffMember.role}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
            >
              {STAFF_ROLES.map((role) => (
                <option key={role} value={role}>
                  {formatRole(role)}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="font-bold">
              Staff status
            </legend>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="active"
                  value="true"
                  defaultChecked={staffMember.active}
                  className="mt-1 h-4 w-4 accent-red-600"
                />

                <span>
                  <span className="block font-bold">
                    Active
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    The staff member can be assigned to class
                    sessions.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="active"
                  value="false"
                  defaultChecked={!staffMember.active}
                  className="mt-1 h-4 w-4 accent-red-600"
                />

                <span>
                  <span className="block font-bold">
                    Inactive
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Keep the profile but prevent new session
                    assignments.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-black text-amber-900">
              Existing sessions
            </h2>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              Making a staff member inactive will not remove
              them from sessions already assigned to them.
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
            <Link
              href={`/admin/staff/${staffMember.id}`}
              className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
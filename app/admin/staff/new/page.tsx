import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { StaffRole } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

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

async function createStaffMember(formData: FormData) {
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

  if (
    !STAFF_ROLES.includes(roleValue as StaffRole)
  ) {
    throw new Error("Please select a valid staff role.");
  }

  const existingStaff =
    await prisma.staff.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

  if (existingStaff) {
    throw new Error(
      "A staff member already uses this email address.",
    );
  }

  const staffMember = await prisma.staff.create({
    data: {
      firstName,
      lastName,
      email,
      phone: phoneValue || null,
      role: roleValue as StaffRole,
      active,
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/admin/staff");

  redirect(`/admin/staff/${staffMember.id}`);
}

export default function NewStaffPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 text-black">
      <header>
        <Link
          href="/admin/staff"
          className="font-bold text-red-600 hover:underline"
        >
          ← Back to staff
        </Link>

        <h1 className="mt-4 text-4xl font-black">
          Add Staff Member
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Create a new Tankz Fitness staff profile.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form
          action={createStaffMember}
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
                placeholder="Enter first name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-500 focus:border-red-600"
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
                placeholder="Enter last name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-500 focus:border-red-600"
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
              placeholder="staff@tankzfitness.co.uk"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-500 focus:border-red-600"
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
              defaultValue={StaffRole.TRAINER}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
            >
              {STAFF_ROLES.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {formatRole(role)}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="font-bold">
              Account status
            </legend>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="active"
                  value="true"
                  defaultChecked
                  className="mt-1 h-4 w-4 accent-red-600"
                />

                <span>
                  <span className="block font-bold">
                    Active
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    The staff member can be assigned to
                    sessions.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="active"
                  value="false"
                  className="mt-1 h-4 w-4 accent-red-600"
                />

                <span>
                  <span className="block font-bold">
                    Inactive
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Keep the profile without using it for new
                    assignments.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="font-black text-blue-900">
              Staff profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-800">
              After creating the profile, you will be taken
              to the staff member&apos;s details page. Their
              assigned class sessions will appear there.
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
            <Link
              href="/admin/staff"
              className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Create Staff Member
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
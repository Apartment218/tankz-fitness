import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

async function createClass(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();

  const description = String(
    formData.get("description") ?? "",
  ).trim();

  const durationMin = Number(
    formData.get("durationMin"),
  );

  const capacity = Number(
    formData.get("capacity"),
  );

  const active =
    formData.get("active") === "on";

  if (!name) {
    throw new Error("Class name is required.");
  }

  if (
    !Number.isInteger(durationMin) ||
    durationMin < 1
  ) {
    throw new Error(
      "Duration must be a whole number greater than zero.",
    );
  }

  if (
    !Number.isInteger(capacity) ||
    capacity < 1
  ) {
    throw new Error(
      "Capacity must be a whole number greater than zero.",
    );
  }

  const fitnessClass =
    await prisma.fitnessClass.create({
      data: {
        name,
        description:
          description.length > 0
            ? description
            : null,
        durationMin,
        capacity,
        active,
      },
    });

  redirect(
    `/admin/classes/${fitnessClass.id}`,
  );
}

export default function NewClassPage() {
  return (
    <div className="mx-auto max-w-3xl text-black">
      <div className="mb-8">
        <Link
          href="/admin/classes"
          className="font-bold text-red-600 hover:underline"
        >
          ← Back to classes
        </Link>

        <h1 className="mt-4 text-4xl font-bold">
          Add fitness class
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Create a new class for the Tankz Fitness
          timetable.
        </p>
      </div>

      <form
        action={createClass}
        className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block font-bold">
              Class name
            </span>

            <input
              type="text"
              name="name"
              required
              autoFocus
              placeholder="Example: Strength Circuit"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-500 focus:border-red-600"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-bold">
              Description
            </span>

            <textarea
              name="description"
              rows={5}
              placeholder="Describe the class, training style and who it is suitable for..."
              className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-500 focus:border-red-600"
            />
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-bold">
                Duration
              </span>

              <div className="relative">
                <input
                  type="number"
                  name="durationMin"
                  required
                  min={1}
                  step={1}
                  defaultValue={45}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-black outline-none focus:border-red-600"
                />

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center font-semibold text-gray-500">
                  minutes
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block font-bold">
                Maximum capacity
              </span>

              <div className="relative">
                <input
                  type="number"
                  name="capacity"
                  required
                  min={1}
                  step={1}
                  defaultValue={20}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-24 text-black outline-none focus:border-red-600"
                />

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center font-semibold text-gray-500">
                  members
                </span>
              </div>
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <input
              type="checkbox"
              name="active"
              defaultChecked
              className="h-5 w-5 accent-red-600"
            />

            <div>
              <span className="block font-bold">
                Active class
              </span>

              <span className="text-sm text-gray-600">
                Active classes can be used when creating
                timetable sessions.
              </span>
            </div>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            href="/admin/classes"
            className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
          >
            Create class
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";

type StaffListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  active: boolean;
  sessionCount: number;
};

type StaffListProps = {
  staff: StaffListItem[];
  totalStaff?: number;
  availableRoles?: string[];
  currentSearch?: string;
  currentRole?: string;
  currentStatus?: string;
};

function formatRole(role: string) {
  return role
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function StaffList({
  staff,
  totalStaff,
  availableRoles,
  currentSearch = "",
  currentRole = "ALL",
  currentStatus = "ALL",
}: StaffListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [role, setRole] = useState(currentRole);
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const roles =
    availableRoles ??
    Array.from(
      new Set(staff.map((member) => member.role)),
    ).sort();

  const totalResults = totalStaff ?? staff.length;

  const filtersActive =
    currentSearch.trim() !== "" ||
    currentRole !== "ALL" ||
    currentStatus !== "ALL";

  useEffect(() => {
    setSearch(currentSearch);
    setRole(currentRole);
    setStatus(currentStatus);
  }, [currentRole, currentSearch, currentStatus]);

  function updateFilters(
    nextSearch: string,
    nextRole: string,
    nextStatus: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("page");

    const trimmedSearch = nextSearch.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    if (nextRole !== "ALL") {
      params.set("role", nextRole);
    } else {
      params.delete("role");
    }

    if (nextStatus !== "ALL") {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilters(search, role, status);
  }

  function handleRoleChange(nextRole: string) {
    setRole(nextRole);
    updateFilters(search, nextRole, status);
  }

  function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus);
    updateFilters(search, role, nextStatus);
  }

  function clearFilters() {
    setSearch("");
    setRole("ALL");
    setStatus("ALL");

    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <section className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Search staff
            </span>

            <div className="flex gap-2">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Name, email or phone"
                className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100"
              />

              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-zinc-950 px-5 py-3 font-bold text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60"
              >
                Search
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Role
            </span>

            <select
              value={role}
              disabled={isPending}
              onChange={(event) =>
                handleRoleChange(event.target.value)
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 disabled:cursor-wait disabled:opacity-60"
            >
              <option value="ALL">All roles</option>

              {roles.map((staffRole) => (
                <option
                  key={staffRole}
                  value={staffRole}
                >
                  {formatRole(staffRole)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Status
            </span>

            <select
              value={status}
              disabled={isPending}
              onChange={(event) =>
                handleStatusChange(event.target.value)
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 disabled:cursor-wait disabled:opacity-60"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!filtersActive || isPending}
              className="w-full rounded-xl border border-zinc-300 bg-white px-5 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
          <p className="text-sm font-semibold text-zinc-600">
            Found{" "}
            <span className="font-black text-zinc-950">
              {totalResults}
            </span>{" "}
            {totalResults === 1
              ? "staff member"
              : "staff members"}
          </p>

          {isPending ? (
            <p className="text-sm font-bold text-red-600">
              Updating results...
            </p>
          ) : filtersActive ? (
            <p className="text-sm font-bold text-red-600">
              Filters applied
            </p>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-zinc-50">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-black text-zinc-700">
                  Name
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-black text-zinc-700">
                  Role
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-black text-zinc-700">
                  Contact
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-center text-sm font-black text-zinc-700">
                  Sessions
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-center text-sm font-black text-zinc-700">
                  Status
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-right text-sm font-black text-zinc-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <p className="font-black text-zinc-800">
                      No staff members found
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Try changing or clearing the current
                      filters.
                    </p>

                    {filtersActive && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        disabled={isPending}
                        className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-zinc-200 transition hover:bg-zinc-50"
                  >
                    <td className="whitespace-nowrap px-6 py-5">
                      <Link
                        href={`/admin/staff/${member.id}`}
                        className="font-black text-zinc-950 transition hover:text-red-600"
                      >
                        {member.firstName}{" "}
                        {member.lastName}
                      </Link>
                    </td>

                    <td className="whitespace-nowrap px-6 py-5">
                      <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
                        {formatRole(member.role)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <a
                        href={`mailto:${member.email}`}
                        className="block break-words font-semibold text-red-600 hover:underline"
                      >
                        {member.email}
                      </a>

                      <p className="mt-1 text-sm text-zinc-500">
                        {member.phone ??
                          "No phone number"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-6 py-5 text-center font-bold text-zinc-950">
                      {member.sessionCount}
                    </td>

                    <td className="whitespace-nowrap px-6 py-5 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          member.active
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {member.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-5 text-right">
                      <Link
                        href={`/admin/staff/${member.id}`}
                        className="font-bold text-red-600 transition hover:text-red-700 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
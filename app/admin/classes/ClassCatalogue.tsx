"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Badge,
  Button,
  EmptyState,
} from "@/components/tankz-ui";

type ClassCatalogueItem = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  capacity: number;
  active: boolean;
  sessionCount: number;
  latestTrainer: string | null;
  latestSessionAt: string | null;
};

type ClassCatalogueProps = {
  classes: ClassCatalogueItem[];
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "No sessions scheduled";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ClassCatalogue({
  classes,
}: ClassCatalogueProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredClasses = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return classes.filter((fitnessClass) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        fitnessClass.name.toLowerCase().includes(searchTerm) ||
        fitnessClass.description
          .toLowerCase()
          .includes(searchTerm) ||
        fitnessClass.latestTrainer
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && fitnessClass.active) ||
        (status === "INACTIVE" && !fitnessClass.active);

      return Boolean(matchesSearch && matchesStatus);
    });
  }, [classes, search, status]);

  const filtersAreActive =
    search.trim().length > 0 || status !== "ALL";

  function clearFilters() {
    setSearch("");
    setStatus("ALL");
  }

  return (
    <div>
      <div className="border-b border-zinc-200 p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Search classes
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by class, description or trainer..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Status
            </span>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          {filtersAreActive ? (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
            >
              Clear
            </Button>
          ) : null}
        </div>

        <p className="mt-4 text-sm font-semibold text-zinc-600">
          {filteredClasses.length === 0
            ? "No classes found"
            : `Showing ${filteredClasses.length} of ${classes.length} classes`}
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title="No classes created"
            description="Create your first class to start scheduling group training sessions."
          />

          <div className="mt-5 flex justify-center">
            <Button href="/admin/classes/new">
              Add first class
            </Button>
          </div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title="No matching classes"
            description="Try changing or clearing your current search filters."
          />

          <div className="mt-5 flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredClasses.map((fitnessClass) => (
            <article
              key={fitnessClass.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                    Group training
                  </p>

                  <Link
                    href={`/admin/classes/${fitnessClass.id}`}
                    className="mt-2 block text-xl font-black text-zinc-950 transition hover:text-red-600"
                  >
                    {fitnessClass.name}
                  </Link>
                </div>

                <Badge
                  variant={fitnessClass.active ? "success" : "neutral"}
                >
                  {fitnessClass.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600">
                {fitnessClass.description}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    Duration
                  </dt>

                  <dd className="mt-1 font-bold text-zinc-950">
                    {fitnessClass.durationMin} min
                  </dd>
                </div>

                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    Capacity
                  </dt>

                  <dd className="mt-1 font-bold text-zinc-950">
                    {fitnessClass.capacity}
                  </dd>
                </div>

                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    Sessions
                  </dt>

                  <dd className="mt-1 font-bold text-zinc-950">
                    {fitnessClass.sessionCount}
                  </dd>
                </div>

                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    Trainer
                  </dt>

                  <dd className="mt-1 truncate font-bold text-zinc-950">
                    {fitnessClass.latestTrainer ?? "Not assigned"}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-sm font-medium text-zinc-500">
                Latest session:{" "}
                {formatDateTime(fitnessClass.latestSessionAt)}
              </p>

              <div className="mt-auto pt-6">
                <Button
                  href={`/admin/classes/${fitnessClass.id}`}
                  fullWidth
                  variant="secondary"
                >
                  View class
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
import Link from "next/link";

import { prisma } from "@/lib/prisma";

function splitLines(value: string | null) {
  return value
    ?.split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

export async function TeamSection() {
  const team = await prisma.staff.findMany({
    where: {
      active: true,
      publicProfile: true,
      showOnHome: true,
    },
    orderBy: [
      {
        featured: "desc",
      },
      {
        sortOrder: "asc",
      },
      {
        firstName: "asc",
      },
    ],
    take: 4,
  });

  if (team.length === 0) {
    return null;
  }

  return (
    <section id="team" className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
              Meet your coaches
            </p>

            <h2 className="mt-5 font-display text-5xl leading-[0.95] text-zinc-950 sm:text-6xl">
              Expert guidance. Personal attention. Real accountability.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Work with coaches who understand how to turn your goals into a
              practical plan you can follow.
            </p>
          </div>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-600"
          >
            Find your coach
          </Link>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => {
            const specialities = splitLines(member.specialities).slice(0, 3);

            return (
              <article
                key={member.id}
                className={`group overflow-hidden rounded-[2rem] border bg-zinc-50 ${
                  member.featured
                    ? "border-red-300 shadow-lg shadow-red-100"
                    : "border-zinc-200"
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-end bg-[radial-gradient(circle_at_65%_20%,rgba(220,38,38,.45),transparent_24%),linear-gradient(140deg,transparent,rgba(255,255,255,.08))] p-7">
                      <p className="text-6xl font-black text-white">
                        {member.firstName.charAt(0)}
                        {member.lastName.charAt(0)}
                      </p>
                    </div>
                  )}

                  {member.featured ? (
                    <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white">
                      Featured coach
                    </span>
                  ) : null}
                </div>

                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
                    {member.jobTitle ?? member.role.replaceAll("_", " ")}
                  </p>

                  <h3 className="mt-3 text-2xl font-black text-zinc-950">
                    {member.firstName} {member.lastName}
                  </h3>

                  {member.bio ? (
                    <p className="mt-4 line-clamp-4 leading-7 text-zinc-600">
                      {member.bio}
                    </p>
                  ) : null}

                  {specialities.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {specialities.map((speciality) => (
                        <span
                          key={speciality}
                          className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-bold text-zinc-700"
                        >
                          {speciality}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={member.bookingHref ?? "/#contact"}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-600"
                    >
                      Work with {member.firstName}
                    </Link>

                    {member.instagramUrl ? (
                      <a
                        href={member.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 text-xs font-black uppercase text-zinc-700 transition hover:border-red-600 hover:text-red-600"
                      >
                        IG
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
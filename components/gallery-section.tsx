import Link from "next/link";

import { prisma } from "@/lib/prisma";

export async function GallerySection() {
  const images = await prisma.galleryImage.findMany({
    where: {
      active: true,
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
        createdAt: "desc",
      },
    ],
    take: 7,
  });

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="overflow-hidden bg-zinc-950 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
              Inside Tankz Fitness
            </p>

            <h2 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl">
              Real training. Real energy. Real people.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              A closer look at the coaching, community and
              work that goes into every result.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:border-red-500 hover:bg-red-600"
          >
            View full gallery
          </Link>
        </div>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {images.map((image, index) => {
            const large =
              image.featured || index === 0 || index === 5;

            return (
              <figure
                key={image.id}
                className={`group relative overflow-hidden rounded-[1.5rem] bg-zinc-900 ${
                  large
                    ? "col-span-2 row-span-2"
                    : "col-span-1 row-span-1"
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={
                    image.altText ??
                    image.title ??
                    "Tankz Fitness gallery image"
                  }
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-70 transition group-hover:opacity-90" />

                {(image.title || image.category) ? (
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    {image.category ? (
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                        {image.category}
                      </p>
                    ) : null}

                    {image.title ? (
                      <p className="mt-1 text-lg font-black text-white">
                        {image.title}
                      </p>
                    ) : null}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
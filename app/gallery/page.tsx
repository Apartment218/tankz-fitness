import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery | Tankz Fitness",
  description:
    "Explore training, coaching and community images from Tankz Fitness.",
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    where: {
      active: true,
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
  });

  return (
    <main className="min-h-screen bg-zinc-950">
      <SiteHeader />

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
            Gallery
          </p>

          <h1 className="mt-5 max-w-5xl font-display text-6xl leading-[0.92] text-white sm:text-7xl">
            The work behind the results.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
            Coaching, training and community moments from
            inside Tankz Fitness.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {images.length === 0 ? (
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
              Gallery images are coming soon.
            </div>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {images.map((image) => (
                <figure
                  key={image.id}
                  className="group mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-zinc-900"
                >
                  <img
                    src={image.imageUrl}
                    alt={
                      image.altText ??
                      image.title ??
                      "Tankz Fitness gallery image"
                    }
                    loading="lazy"
                    className="w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />

                  {(image.title ||
                    image.caption ||
                    image.category) ? (
                    <figcaption className="p-5">
                      {image.category ? (
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
                          {image.category}
                        </p>
                      ) : null}

                      {image.title ? (
                        <h2 className="mt-2 text-xl font-black text-white">
                          {image.title}
                        </h2>
                      ) : null}

                      {image.caption ? (
                        <p className="mt-2 leading-7 text-zinc-400">
                          {image.caption}
                        </p>
                      ) : null}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
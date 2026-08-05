import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  PageContainer,
  PageHeader,
  Section,
} from "@/components/tankz-ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { prisma } from "@/lib/prisma";

import {
  createGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textarea =
  "min-h-28 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-zinc-300 text-red-600"
      />

      <span className="font-bold text-zinc-900">
        {label}
      </span>
    </label>
  );
}

export default async function GalleryAdminPage() {
  const images = await prisma.galleryImage.findMany({
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
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Gallery"
        description="Upload real gym, coaching and client images for the public website."
        actions={
          <>
            <Button href="/admin/website" variant="outline">
              Website overview
            </Button>

            <Button href="/gallery" variant="outline">
              View gallery
            </Button>
          </>
        }
      />

      <Section
        title="Add gallery image"
        description="Upload an image and choose where it should appear."
      >
        <form
          action={createGalleryImage}
          className="grid gap-5 lg:grid-cols-2"
        >
          <input
            name="title"
            placeholder="Image title"
            className={input}
          />

          <input
            name="category"
            placeholder="Category, e.g. Coaching"
            className={input}
          />

          <textarea
            name="caption"
            placeholder="Optional caption"
            className={`${textarea} lg:col-span-2`}
          />

          <input
            name="altText"
            placeholder="Image description for accessibility and SEO"
            className={`${input} lg:col-span-2`}
          />

          <input
            type="number"
            name="sortOrder"
            defaultValue="0"
            className={input}
          />

          <div className="lg:col-span-2">
            <ImageUpload
              name="imageUrl"
              label="Gallery image"
              folder="gallery"
              description="Use a high-quality JPG, PNG or WEBP image."
            />
          </div>

          <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
            <Toggle
              name="active"
              label="Published"
              defaultChecked
            />

            <Toggle
              name="showOnHome"
              label="Show on homepage"
              defaultChecked
            />

            <Toggle
              name="featured"
              label="Featured image"
              defaultChecked={false}
            />
          </div>

          <div className="lg:col-span-2">
            <Button type="submit" size="lg">
              Add image
            </Button>
          </div>
        </form>
      </Section>

      <Section
        title="Manage gallery"
        description={`${images.length} image${
          images.length === 1 ? "" : "s"
        } stored in Tankz HQ.`}
      >
        {images.length === 0 ? (
          <EmptyState
            title="No gallery images yet"
            description="Upload your first image above."
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {images.map((image) => (
              <Card key={image.id}>
                <div className="aspect-[16/9] overflow-hidden rounded-t-2xl bg-zinc-200">
                  <img
                    src={image.imageUrl}
                    alt={image.altText ?? image.title ?? ""}
                    className="h-full w-full object-cover"
                  />
                </div>

                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>
                        {image.title ?? "Untitled image"}
                      </CardTitle>

                      <CardDescription>
                        {image.category ?? "No category"}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          image.active ? "success" : "neutral"
                        }
                      >
                        {image.active ? "Published" : "Hidden"}
                      </Badge>

                      {image.showOnHome ? (
                        <Badge variant="info">Homepage</Badge>
                      ) : null}

                      {image.featured ? (
                        <Badge variant="warning">Featured</Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form
                    action={updateGalleryImage.bind(
                      null,
                      image.id,
                    )}
                    className="grid gap-5 lg:grid-cols-2"
                  >
                    <input
                      name="title"
                      defaultValue={image.title ?? ""}
                      placeholder="Image title"
                      className={input}
                    />

                    <input
                      name="category"
                      defaultValue={image.category ?? ""}
                      placeholder="Category"
                      className={input}
                    />

                    <textarea
                      name="caption"
                      defaultValue={image.caption ?? ""}
                      placeholder="Caption"
                      className={`${textarea} lg:col-span-2`}
                    />

                    <input
                      name="altText"
                      defaultValue={image.altText ?? ""}
                      placeholder="Image description"
                      className={`${input} lg:col-span-2`}
                    />

                    <input
                      type="number"
                      name="sortOrder"
                      defaultValue={image.sortOrder}
                      className={input}
                    />

                    <div className="lg:col-span-2">
                      <ImageUpload
                        name="imageUrl"
                        label="Gallery image"
                        folder="gallery"
                        initialUrl={image.imageUrl}
                      />
                    </div>

                    <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
                      <Toggle
                        name="active"
                        label="Published"
                        defaultChecked={image.active}
                      />

                      <Toggle
                        name="showOnHome"
                        label="Show on homepage"
                        defaultChecked={image.showOnHome}
                      />

                      <Toggle
                        name="featured"
                        label="Featured image"
                        defaultChecked={image.featured}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Button type="submit">
                        Save image
                      </Button>
                    </div>
                  </form>

                  <form
                    action={deleteGalleryImage.bind(
                      null,
                      image.id,
                    )}
                    className="mt-4 border-t border-zinc-200 pt-4"
                  >
                    <Button
                      type="submit"
                      variant="danger"
                      size="sm"
                    >
                      Delete image
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
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
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "./actions";

export const dynamic = "force-dynamic";

const inputClassName =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textareaClassName =
  "min-h-32 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

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

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="tracking-wider text-amber-500"
      aria-label={`${rating} out of 5 stars`}
    >
      {"★".repeat(rating)}
      <span className="text-zinc-300">
        {"★".repeat(5 - rating)}
      </span>
    </span>
  );
}

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({
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
        title="Testimonials"
        description="Add client reviews and choose which stories appear on the public homepage."
        actions={
          <>
            <Button
              href="/admin/website"
              variant="outline"
            >
              Website overview
            </Button>

            <Button href="/" variant="outline">
              View homepage
            </Button>
          </>
        }
      />

      <Section
        title="Add testimonial"
        description="Create a client review with an optional photograph and result."
      >
        <form
          action={createTestimonial}
          className="grid gap-5 lg:grid-cols-2"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Client name
            </span>

            <input
              type="text"
              name="clientName"
              required
              placeholder="Sarah M."
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Headline
            </span>

            <input
              type="text"
              name="headline"
              placeholder="The strongest I have ever felt"
              className={inputClassName}
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Testimonial
            </span>

            <textarea
              name="quote"
              required
              placeholder="Write the client's review here."
              className={textareaClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Result
            </span>

            <input
              type="text"
              name="result"
              placeholder="Lost 12kg in 16 weeks"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Star rating
            </span>

            <select
              name="rating"
              defaultValue="5"
              className={inputClassName}
            >
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Display order
            </span>

            <input
              type="number"
              name="sortOrder"
              defaultValue="0"
              className={inputClassName}
            />
          </label>

          <div className="lg:col-span-2">
            <ImageUpload
              name="imageUrl"
              label="Client photo"
              folder="testimonials"
              description="Optional. A square portrait works best."
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
              label="Featured"
              defaultChecked={false}
            />
          </div>

          <div className="lg:col-span-2">
            <Button type="submit" size="lg">
              Add testimonial
            </Button>
          </div>
        </form>
      </Section>

      <Section
        title="Manage testimonials"
        description={`${testimonials.length} testimonial${
          testimonials.length === 1 ? "" : "s"
        } stored in Tankz HQ.`}
      >
        {testimonials.length === 0 ? (
          <EmptyState
            title="No testimonials yet"
            description="Add your first client review above."
          />
        ) : (
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {testimonial.imageUrl ? (
                        <img
                          src={testimonial.imageUrl}
                          alt=""
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-lg font-black text-white">
                          {testimonial.clientName
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <CardTitle>
                          {testimonial.clientName}
                        </CardTitle>

                        <CardDescription>
                          <Stars
                            rating={testimonial.rating}
                          />
                          {testimonial.result
                            ? ` • ${testimonial.result}`
                            : ""}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          testimonial.active
                            ? "success"
                            : "neutral"
                        }
                      >
                        {testimonial.active
                          ? "Published"
                          : "Hidden"}
                      </Badge>

                      {testimonial.showOnHome ? (
                        <Badge variant="info">
                          Homepage
                        </Badge>
                      ) : null}

                      {testimonial.featured ? (
                        <Badge variant="warning">
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form
                    action={updateTestimonial.bind(
                      null,
                      testimonial.id,
                    )}
                    className="grid gap-5 lg:grid-cols-2"
                  >
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Client name
                      </span>

                      <input
                        type="text"
                        name="clientName"
                        required
                        defaultValue={
                          testimonial.clientName
                        }
                        className={inputClassName}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Headline
                      </span>

                      <input
                        type="text"
                        name="headline"
                        defaultValue={
                          testimonial.headline ?? ""
                        }
                        className={inputClassName}
                      />
                    </label>

                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Testimonial
                      </span>

                      <textarea
                        name="quote"
                        required
                        defaultValue={testimonial.quote}
                        className={textareaClassName}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Result
                      </span>

                      <input
                        type="text"
                        name="result"
                        defaultValue={
                          testimonial.result ?? ""
                        }
                        className={inputClassName}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Star rating
                      </span>

                      <select
                        name="rating"
                        defaultValue={String(
                          testimonial.rating,
                        )}
                        className={inputClassName}
                      >
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Display order
                      </span>

                      <input
                        type="number"
                        name="sortOrder"
                        defaultValue={
                          testimonial.sortOrder
                        }
                        className={inputClassName}
                      />
                    </label>

                    <div className="lg:col-span-2">
                      <ImageUpload
                        name="imageUrl"
                        label="Client photo"
                        folder="testimonials"
                        initialUrl={
                          testimonial.imageUrl
                        }
                      />
                    </div>

                    <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
                      <Toggle
                        name="active"
                        label="Published"
                        defaultChecked={
                          testimonial.active
                        }
                      />

                      <Toggle
                        name="showOnHome"
                        label="Show on homepage"
                        defaultChecked={
                          testimonial.showOnHome
                        }
                      />

                      <Toggle
                        name="featured"
                        label="Featured"
                        defaultChecked={
                          testimonial.featured
                        }
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Button type="submit">
                        Save testimonial
                      </Button>
                    </div>
                  </form>

                  <form
                    action={deleteTestimonial.bind(
                      null,
                      testimonial.id,
                    )}
                    className="mt-4 border-t border-zinc-200 pt-4"
                  >
                    <Button
                      type="submit"
                      variant="danger"
                      size="sm"
                    >
                      Delete testimonial
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
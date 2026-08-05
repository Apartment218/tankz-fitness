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
  createTransformation,
  deleteTransformation,
  updateTransformation,
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

export default async function TransformationsAdminPage() {
  const transformations =
    await prisma.transformation.findMany({
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
        title="Transformations"
        description="Create and manage client result stories shown on the public website."
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
        title="Add transformation"
        description="Upload before and after images, add the result and publish the story."
      >
        <form
          action={createTransformation}
          className="grid gap-5 lg:grid-cols-2"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Transformation title
            </span>

            <input
              type="text"
              name="title"
              required
              placeholder="Stronger, fitter and 15kg down"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Client name
            </span>

            <input
              type="text"
              name="clientName"
              placeholder="Optional"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Result
            </span>

            <input
              type="text"
              name="result"
              placeholder="Lost 15kg"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Duration
            </span>

            <input
              type="text"
              name="durationLabel"
              placeholder="16 weeks"
              className={inputClassName}
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Transformation story
            </span>

            <textarea
              name="summary"
              placeholder="Describe the client's starting point, journey and result."
              className={textareaClassName}
            />
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

          <div className="lg:col-span-2 grid gap-5 lg:grid-cols-2">
            <ImageUpload
              name="beforeImageUrl"
              label="Before image"
              folder="transformations/before"
              description="Use a clear portrait or full-body image."
            />

            <ImageUpload
              name="afterImageUrl"
              label="After image"
              folder="transformations/after"
              description="Use a similar angle and crop for the best comparison."
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
              Add transformation
            </Button>
          </div>
        </form>
      </Section>

      <Section
        title="Manage transformations"
        description={`${transformations.length} transformation${
          transformations.length === 1 ? "" : "s"
        } stored in Tankz HQ.`}
      >
        {transformations.length === 0 ? (
          <EmptyState
            title="No transformations yet"
            description="Add your first client result story above."
          />
        ) : (
          <div className="space-y-6">
            {transformations.map((transformation) => (
              <Card key={transformation.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle>
                        {transformation.title}
                      </CardTitle>

                      <CardDescription>
                        {transformation.clientName ??
                          "Client name not shown"}
                        {transformation.result
                          ? ` • ${transformation.result}`
                          : ""}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          transformation.active
                            ? "success"
                            : "neutral"
                        }
                      >
                        {transformation.active
                          ? "Published"
                          : "Hidden"}
                      </Badge>

                      {transformation.showOnHome ? (
                        <Badge variant="info">
                          Homepage
                        </Badge>
                      ) : null}

                      {transformation.featured ? (
                        <Badge variant="warning">
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form
                    action={updateTransformation.bind(
                      null,
                      transformation.id,
                    )}
                    className="grid gap-5 lg:grid-cols-2"
                  >
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Transformation title
                      </span>

                      <input
                        type="text"
                        name="title"
                        required
                        defaultValue={transformation.title}
                        className={inputClassName}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Client name
                      </span>

                      <input
                        type="text"
                        name="clientName"
                        defaultValue={
                          transformation.clientName ?? ""
                        }
                        className={inputClassName}
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
                          transformation.result ?? ""
                        }
                        className={inputClassName}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Duration
                      </span>

                      <input
                        type="text"
                        name="durationLabel"
                        defaultValue={
                          transformation.durationLabel ?? ""
                        }
                        className={inputClassName}
                      />
                    </label>

                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Transformation story
                      </span>

                      <textarea
                        name="summary"
                        defaultValue={
                          transformation.summary ?? ""
                        }
                        className={textareaClassName}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Display order
                      </span>

                      <input
                        type="number"
                        name="sortOrder"
                        defaultValue={
                          transformation.sortOrder
                        }
                        className={inputClassName}
                      />
                    </label>

                    <div className="lg:col-span-2 grid gap-5 lg:grid-cols-2">
                      <ImageUpload
                        name="beforeImageUrl"
                        label="Before image"
                        folder="transformations/before"
                        initialUrl={
                          transformation.beforeImageUrl
                        }
                      />

                      <ImageUpload
                        name="afterImageUrl"
                        label="After image"
                        folder="transformations/after"
                        initialUrl={
                          transformation.afterImageUrl
                        }
                      />
                    </div>

                    <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
                      <Toggle
                        name="active"
                        label="Published"
                        defaultChecked={
                          transformation.active
                        }
                      />

                      <Toggle
                        name="showOnHome"
                        label="Show on homepage"
                        defaultChecked={
                          transformation.showOnHome
                        }
                      />

                      <Toggle
                        name="featured"
                        label="Featured"
                        defaultChecked={
                          transformation.featured
                        }
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Button type="submit">
                        Save transformation
                      </Button>
                    </div>
                  </form>

                  <form
                    action={deleteTransformation.bind(
                      null,
                      transformation.id,
                    )}
                    className="mt-4 border-t border-zinc-200 pt-4"
                  >
                    <Button
                      type="submit"
                      variant="danger"
                      size="sm"
                    >
                      Delete transformation
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
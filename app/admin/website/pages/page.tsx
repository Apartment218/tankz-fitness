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

import { createWebsitePage } from "./actions";

export const dynamic = "force-dynamic";

const inputClassName =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textareaClassName =
  "min-h-32 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

function Toggle({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
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

export default async function WebsitePagesPage() {
  const pages = await prisma.websitePage.findMany({
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Website pages"
        description="Create public pages and choose whether they appear in the website header or footer."
        actions={
          <>
            <Button
              href="/admin/website"
              variant="outline"
            >
              Website overview
            </Button>

            <Button href="/" variant="outline">
              View website
            </Button>
          </>
        }
      />

      <Section
        title="Create a page"
        description="Add an About, FAQ, Pricing, Privacy, Terms or any other public page."
      >
        <form
          action={createWebsitePage}
          className="grid gap-5 lg:grid-cols-2"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Page title
            </span>

            <input
              type="text"
              name="title"
              required
              placeholder="About Tankz Fitness"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              URL slug
            </span>

            <input
              type="text"
              name="slug"
              placeholder="about"
              className={inputClassName}
            />

            <span className="mt-2 block text-xs text-zinc-500">
              Leave blank to create it from the title.
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Navigation label
            </span>

            <input
              type="text"
              name="navigationLabel"
              placeholder="About"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Short introduction
            </span>

            <input
              type="text"
              name="excerpt"
              placeholder="A short description shown beneath the heading."
              className={inputClassName}
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Page content
            </span>

            <textarea
              name="content"
              placeholder="Write the page content here. Separate paragraphs with a blank line."
              className={textareaClassName}
            />
          </label>

          <div className="lg:col-span-2">
            <ImageUpload
              name="imageUrl"
              label="Page cover image"
              folder="pages"
              description="Optional image displayed at the top of the public page."
            />
          </div>

          <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
            <Toggle
              name="published"
              label="Publish page"
            />

            <Toggle
              name="showInHeader"
              label="Show in header"
            />

            <Toggle
              name="showInFooter"
              label="Show in footer"
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Header order
            </span>

            <input
              type="number"
              name="headerOrder"
              defaultValue="0"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Footer order
            </span>

            <input
              type="number"
              name="footerOrder"
              defaultValue="0"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              SEO title
            </span>

            <input
              type="text"
              name="seoTitle"
              placeholder="Optional search result title"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              SEO description
            </span>

            <input
              type="text"
              name="seoDescription"
              placeholder="Optional search result description"
              className={inputClassName}
            />
          </label>

          <div className="lg:col-span-2">
            <Button type="submit" size="lg">
              Create page
            </Button>
          </div>
        </form>
      </Section>

      <Section
        title="Manage pages"
        description={`${pages.length} page${
          pages.length === 1 ? "" : "s"
        } stored in Tankz HQ.`}
      >
        {pages.length === 0 ? (
          <EmptyState
            title="No website pages yet"
            description="Create your first public page above."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{page.title}</CardTitle>

                      <CardDescription>
                        /{page.slug}
                      </CardDescription>
                    </div>

                    <Badge
                      variant={
                        page.published
                          ? "success"
                          : "warning"
                      }
                    >
                      {page.published
                        ? "Published"
                        : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="line-clamp-3 min-h-16 text-sm leading-6 text-zinc-600">
                    {page.excerpt ??
                      "No page introduction has been added."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {page.showInHeader ? (
                      <Badge variant="info">Header</Badge>
                    ) : null}

                    {page.showInFooter ? (
                      <Badge variant="neutral">
                        Footer
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      href={`/admin/website/pages/${page.id}`}
                    >
                      Edit page
                    </Button>

                    {page.published ? (
                      <Button
                        href={`/${page.slug}`}
                        variant="outline"
                      >
                        View page
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
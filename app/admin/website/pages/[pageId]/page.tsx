import { notFound } from "next/navigation";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageContainer,
  PageHeader,
} from "@/components/tankz-ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { prisma } from "@/lib/prisma";

import {
  deleteWebsitePage,
  updateWebsitePage,
} from "../actions";

export const dynamic = "force-dynamic";

const inputClassName =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textareaClassName =
  "min-h-48 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

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

export default async function EditWebsitePage({
  params,
}: {
  params: Promise<{
    pageId: string;
  }>;
}) {
  const { pageId } = await params;

  const page = await prisma.websitePage.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title={`Edit ${page.title}`}
        description={`Manage the content, navigation and SEO for /${page.slug}.`}
        actions={
          <>
            <Button
              href="/admin/website/pages"
              variant="outline"
            >
              Back to pages
            </Button>

            {page.published ? (
              <Button
                href={`/${page.slug}`}
                variant="outline"
              >
                View public page
              </Button>
            ) : null}
          </>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Page settings</CardTitle>

              <CardDescription>
                Last updated{" "}
                {page.updatedAt.toLocaleString("en-GB")}
              </CardDescription>
            </div>

            <Badge
              variant={
                page.published ? "success" : "warning"
              }
            >
              {page.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <form
            action={updateWebsitePage.bind(null, page.id)}
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
                defaultValue={page.title}
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
                required
                defaultValue={page.slug}
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Navigation label
              </span>

              <input
                type="text"
                name="navigationLabel"
                defaultValue={
                  page.navigationLabel ?? ""
                }
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
                defaultValue={page.excerpt ?? ""}
                className={inputClassName}
              />
            </label>

            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Page content
              </span>

              <textarea
                name="content"
                defaultValue={page.content ?? ""}
                className={textareaClassName}
              />
            </label>

            <div className="lg:col-span-2">
              <ImageUpload
                name="imageUrl"
                label="Page cover image"
                folder="pages"
                initialUrl={page.imageUrl}
              />
            </div>

            <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
              <Toggle
                name="published"
                label="Publish page"
                defaultChecked={page.published}
              />

              <Toggle
                name="showInHeader"
                label="Show in header"
                defaultChecked={page.showInHeader}
              />

              <Toggle
                name="showInFooter"
                label="Show in footer"
                defaultChecked={page.showInFooter}
              />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Header order
              </span>

              <input
                type="number"
                name="headerOrder"
                defaultValue={page.headerOrder}
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
                defaultValue={page.footerOrder}
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
                defaultValue={page.seoTitle ?? ""}
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
                defaultValue={
                  page.seoDescription ?? ""
                }
                className={inputClassName}
              />
            </label>

            <div className="lg:col-span-2">
              <Button type="submit" size="lg">
                Save page
              </Button>
            </div>
          </form>

          <form
            action={deleteWebsitePage.bind(null, page.id)}
            className="mt-8 border-t border-zinc-200 pt-6"
          >
            <Button
              type="submit"
              variant="danger"
            >
              Delete page
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
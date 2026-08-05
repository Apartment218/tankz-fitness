import {
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

import { updateHomepage } from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100";
const textarea =
  "min-h-32 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100";

function Toggle({
  name,
  label,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="h-5 w-5 rounded border-zinc-300 text-red-600"
      />
      <span className="font-bold text-zinc-950">{label}</span>
    </label>
  );
}

export default async function HomepageEditorPage() {
  const content = await prisma.homepageContent.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      heroTitle: "Train with purpose. Transform for life.",
    },
    update: {},
  });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Homepage editor"
        description="Edit homepage content, statistics and search-engine settings from one place."
        actions={
          <>
            <Button href="/admin/website" variant="outline">
              Website overview
            </Button>
            <Button href="/" variant="outline">
              View homepage
            </Button>
          </>
        }
      />

      <form action={updateHomepage} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero section</CardTitle>
            <CardDescription>
              Control the first message visitors see.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Toggle
                name="heroVisible"
                label="Show hero section"
                checked={content.heroVisible}
              />
            </div>
            <input name="heroEyebrow" defaultValue={content.heroEyebrow ?? ""} placeholder="Eyebrow" className={input} />
            <input name="heroTitle" required defaultValue={content.heroTitle} placeholder="Main heading" className={input} />
            <textarea name="heroSubtitle" defaultValue={content.heroSubtitle ?? ""} placeholder="Supporting text" className={`${textarea} lg:col-span-2`} />
            <input name="heroPrimaryText" defaultValue={content.heroPrimaryText ?? ""} placeholder="Primary button text" className={input} />
            <input name="heroPrimaryHref" defaultValue={content.heroPrimaryHref ?? ""} placeholder="Primary button link" className={input} />
            <input name="heroSecondaryText" defaultValue={content.heroSecondaryText ?? ""} placeholder="Secondary button text" className={input} />
            <input name="heroSecondaryHref" defaultValue={content.heroSecondaryHref ?? ""} placeholder="Secondary button link" className={input} />
            <div className="lg:col-span-2">
              <ImageUpload
                name="heroImageUrl"
                label="Hero background image"
                folder="homepage/hero"
                initialUrl={content.heroImageUrl}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About section</CardTitle>
            <CardDescription>
              Edit your story and coaching message.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Toggle
                name="aboutVisible"
                label="Show about section"
                checked={content.aboutVisible}
              />
            </div>
            <input name="aboutEyebrow" defaultValue={content.aboutEyebrow ?? ""} placeholder="Eyebrow" className={input} />
            <input name="aboutTitle" defaultValue={content.aboutTitle ?? ""} placeholder="Heading" className={input} />
            <textarea name="aboutBody" defaultValue={content.aboutBody ?? ""} placeholder="Body text" className={`${textarea} lg:col-span-2`} />
            <input name="aboutButtonText" defaultValue={content.aboutButtonText ?? ""} placeholder="Button text" className={input} />
            <input name="aboutButtonHref" defaultValue={content.aboutButtonHref ?? ""} placeholder="Button link" className={input} />
            <div className="lg:col-span-2">
              <ImageUpload
                name="aboutImageUrl"
                label="About image"
                folder="homepage/about"
                initialUrl={content.aboutImageUrl}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services introduction</CardTitle>
            <CardDescription>
              Edit the text shown above homepage services.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <Toggle
              name="servicesVisible"
              label="Show services section"
              checked={content.servicesVisible}
            />
            <input name="servicesEyebrow" defaultValue={content.servicesEyebrow ?? ""} placeholder="Eyebrow" className={input} />
            <input name="servicesTitle" defaultValue={content.servicesTitle ?? ""} placeholder="Heading" className={input} />
            <textarea name="servicesBody" defaultValue={content.servicesBody ?? ""} placeholder="Supporting text" className={textarea} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homepage statistics</CardTitle>
            <CardDescription>
              Add four trust-building figures beneath the hero.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Toggle
                name="statsVisible"
                label="Show statistics section"
                checked={content.statsVisible}
              />
            </div>
            <input name="statsEyebrow" defaultValue={content.statsEyebrow ?? ""} placeholder="Eyebrow" className={input} />
            <input name="statsTitle" defaultValue={content.statsTitle ?? ""} placeholder="Heading" className={input} />

            {[
              ["statOneValue", "statOneLabel", content.statOneValue, content.statOneLabel],
              ["statTwoValue", "statTwoLabel", content.statTwoValue, content.statTwoLabel],
              ["statThreeValue", "statThreeLabel", content.statThreeValue, content.statThreeLabel],
              ["statFourValue", "statFourLabel", content.statFourValue, content.statFourLabel],
            ].map(([valueName, labelName, value, label], index) => (
              <div key={valueName as string} className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
                <input
                  name={valueName as string}
                  defaultValue={(value as string | null) ?? ""}
                  placeholder={`Stat ${index + 1} value`}
                  className={input}
                />
                <input
                  name={labelName as string}
                  defaultValue={(label as string | null) ?? ""}
                  placeholder={`Stat ${index + 1} label`}
                  className={input}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social section</CardTitle>
            <CardDescription>
              Edit the follow/social section.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <Toggle
              name="followVisible"
              label="Show social section"
              checked={content.followVisible}
            />
            <input name="followEyebrow" defaultValue={content.followEyebrow ?? ""} placeholder="Eyebrow" className={input} />
            <input name="followTitle" defaultValue={content.followTitle ?? ""} placeholder="Heading" className={input} />
            <textarea name="followBody" defaultValue={content.followBody ?? ""} placeholder="Supporting text" className={textarea} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homepage SEO</CardTitle>
            <CardDescription>
              Control how the homepage appears in search engines and when shared.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-2">
            <input name="seoTitle" defaultValue={content.seoTitle ?? ""} placeholder="SEO title" className={input} />
            <input name="canonicalUrl" defaultValue={content.canonicalUrl ?? ""} placeholder="Canonical URL" className={input} />
            <textarea name="seoDescription" defaultValue={content.seoDescription ?? ""} placeholder="Meta description" className={`${textarea} lg:col-span-2`} />
            <input name="seoKeywords" defaultValue={content.seoKeywords ?? ""} placeholder="Keywords separated by commas" className={`${input} lg:col-span-2`} />
            <input name="openGraphTitle" defaultValue={content.openGraphTitle ?? ""} placeholder="Social share title" className={input} />
            <textarea name="openGraphDescription" defaultValue={content.openGraphDescription ?? ""} placeholder="Social share description" className={textarea} />
            <div className="lg:col-span-2">
              <ImageUpload
                name="openGraphImageUrl"
                label="Social sharing image"
                folder="seo"
                initialUrl={content.openGraphImageUrl}
                description="Recommended size: 1200 × 630 pixels."
              />
            </div>
            <div className="lg:col-span-2">
              <Toggle
                name="noIndex"
                label="Hide homepage from search engines"
                checked={content.noIndex}
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 flex justify-end rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <Button type="submit" size="lg">
            Save homepage
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
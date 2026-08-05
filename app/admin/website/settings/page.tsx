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

import { updateSiteSettings } from "./actions";

export const dynamic = "force-dynamic";

const inputClasses =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textareaClasses =
  "min-h-28 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

export default async function WebsiteSettingsPage() {
  const settings = await prisma.siteSettings.upsert({
    where: {
      id: "main",
    },
    create: {
      id: "main",
      businessName: "Tankz Fitness",
    },
    update: {},
  });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Website settings"
        description="Control the public brand, contact information, social profiles, footer and main website call-to-action."
        actions={
          <>
            <Button href="/admin/website" variant="outline">
              Website overview
            </Button>

            <Button href="/" variant="outline">
              View website
            </Button>
          </>
        }
      />

      <form action={updateSiteSettings} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand identity</CardTitle>

            <CardDescription>
              Manage the business name, tagline, logo and browser icon.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Business name
              </span>

              <input
                type="text"
                name="businessName"
                required
                defaultValue={settings.businessName}
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Tagline
              </span>

              <input
                type="text"
                name="tagline"
                defaultValue={settings.tagline ?? ""}
                placeholder="Personal training built around you"
                className={inputClasses}
              />
            </label>

            <div className="lg:col-span-2">
              <ImageUpload
                name="logoUrl"
                label="Website logo"
                folder="branding/logos"
                initialUrl={settings.logoUrl}
                description="This logo appears in the public header and footer."
              />
            </div>

            <div className="lg:col-span-2">
              <ImageUpload
                name="faviconUrl"
                label="Browser icon"
                folder="branding/favicons"
                initialUrl={settings.faviconUrl}
                description="Upload a square image for the browser tab icon."
                maxSizeMb={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>

            <CardDescription>
              These details appear in the website footer and contact areas.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Email
              </span>

              <input
                type="email"
                name="email"
                defaultValue={settings.email ?? ""}
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Phone
              </span>

              <input
                type="tel"
                name="phone"
                defaultValue={settings.phone ?? ""}
                className={inputClasses}
              />
            </label>

            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Address
              </span>

              <textarea
                name="address"
                defaultValue={settings.address ?? ""}
                className={textareaClasses}
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social links</CardTitle>

            <CardDescription>
              Add the complete public URL for each social profile.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Instagram
              </span>

              <input
                type="url"
                name="instagramUrl"
                defaultValue={settings.instagramUrl ?? ""}
                placeholder="https://instagram.com/..."
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Facebook
              </span>

              <input
                type="url"
                name="facebookUrl"
                defaultValue={settings.facebookUrl ?? ""}
                placeholder="https://facebook.com/..."
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                YouTube
              </span>

              <input
                type="url"
                name="youtubeUrl"
                defaultValue={settings.youtubeUrl ?? ""}
                placeholder="https://youtube.com/..."
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                TikTok
              </span>

              <input
                type="url"
                name="tiktokUrl"
                defaultValue={settings.tiktokUrl ?? ""}
                placeholder="https://tiktok.com/@..."
                className={inputClasses}
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Primary call to action</CardTitle>

            <CardDescription>
              Control the main button displayed throughout the public website.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Button text
              </span>

              <input
                type="text"
                name="primaryCtaText"
                defaultValue={settings.primaryCtaText ?? ""}
                placeholder="Start Today"
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Button link
              </span>

              <input
                type="text"
                name="primaryCtaHref"
                defaultValue={settings.primaryCtaHref ?? ""}
                placeholder="/#contact"
                className={inputClasses}
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer</CardTitle>

            <CardDescription>
              Set the descriptive text displayed at the bottom of the website.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Footer text
              </span>

              <textarea
                name="footerText"
                defaultValue={settings.footerText ?? ""}
                placeholder="Personal training, online coaching and transformation support."
                className={textareaClasses}
              />
            </label>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 flex justify-end rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <Button type="submit" size="lg">
            Save website settings
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
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
import { MediaUpload } from "@/components/admin/media-upload";
import { prisma } from "@/lib/prisma";

import { updateHomepageHero } from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textarea =
  "min-h-32 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

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

      <span className="font-bold text-zinc-950">
        {label}
      </span>
    </label>
  );
}

export default async function HomepageHeroAdminPage() {
  const hero = await prisma.homepageHero.upsert({
    where: {
      id: "main",
    },
    create: {
      id: "main",
      title: "Build the strongest version of yourself.",
      primaryButtonText: "Start Today",
      primaryButtonLink: "/#contact",
    },
    update: {},
    include: {
      stats: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      badges: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  const statValues = Array.from(
    { length: 4 },
    (_, index) => hero.stats[index] ?? null,
  );

  const badgeValues = Array.from(
    { length: 4 },
    (_, index) => hero.badges[index] ?? null,
  );

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Homepage CMS"
        title="Premium hero"
        description="Manage the homepage headline, background video or image, calls to action, statistics and trust badges."
        actions={
          <>
            <Button
              href="/admin/website/homepage"
              variant="outline"
            >
              Homepage editor
            </Button>

            <Button href="/" variant="outline">
              View homepage
            </Button>
          </>
        }
      />

      <form
        action={updateHomepageHero}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Hero content</CardTitle>
            <CardDescription>
              Edit the main message visitors see when they
              arrive on the website.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Toggle
                name="active"
                label="Show premium hero on homepage"
                checked={hero.active}
              />
            </div>

            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Main headline
              </span>

              <input
                name="title"
                required
                defaultValue={hero.title}
                placeholder="Build the strongest version of yourself."
                className={input}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Highlighted word or phrase
              </span>

              <input
                name="highlightedWord"
                defaultValue={hero.highlightedWord ?? ""}
                placeholder="strongest"
                className={input}
              />

              <span className="mt-2 block text-xs text-zinc-500">
                This phrase will be styled in the brand accent
                colour.
              </span>
            </label>

            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Supporting text
              </span>

              <textarea
                name="subtitle"
                defaultValue={hero.subtitle ?? ""}
                placeholder="Personal coaching, clear structure and real accountability."
                className={textarea}
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero buttons</CardTitle>
            <CardDescription>
              Configure the primary and secondary calls to
              action.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 lg:grid-cols-2">
            <input
              name="primaryButtonText"
              defaultValue={hero.primaryButtonText}
              placeholder="Primary button text"
              className={input}
            />

            <input
              name="primaryButtonLink"
              defaultValue={hero.primaryButtonLink}
              placeholder="/#contact"
              className={input}
            />

            <input
              name="secondaryButtonText"
              defaultValue={
                hero.secondaryButtonText ?? ""
              }
              placeholder="Secondary button text"
              className={input}
            />

            <input
              name="secondaryButtonLink"
              defaultValue={
                hero.secondaryButtonLink ?? ""
              }
              placeholder="/services"
              className={input}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Background media</CardTitle>
            <CardDescription>
              Choose whether the hero uses a still image or a
              cinematic background video.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <input
                  type="radio"
                  name="backgroundType"
                  value="IMAGE"
                  defaultChecked={
                    hero.backgroundType === "IMAGE"
                  }
                  className="h-5 w-5"
                />

                <span>
                  <span className="block font-black text-zinc-950">
                    Background image
                  </span>

                  <span className="mt-1 block text-sm text-zinc-600">
                    Faster loading and ideal as a video
                    fallback.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <input
                  type="radio"
                  name="backgroundType"
                  value="VIDEO"
                  defaultChecked={
                    hero.backgroundType === "VIDEO"
                  }
                  className="h-5 w-5"
                />

                <span>
                  <span className="block font-black text-zinc-950">
                    Background video
                  </span>

                  <span className="mt-1 block text-sm text-zinc-600">
                    MP4, WEBM or MOV with automatic image
                    fallback.
                  </span>
                </span>
              </label>
            </div>

            <MediaUpload
              name="backgroundImageUrl"
              label="Hero background image"
              folder="homepage/hero/images"
              mediaType="image"
              initialUrl={hero.backgroundImageUrl}
              description="Recommended size: at least 1920 × 1080 pixels."
            />

            <MediaUpload
              name="backgroundVideoUrl"
              label="Hero background video"
              folder="homepage/hero/videos"
              mediaType="video"
              initialUrl={hero.backgroundVideoUrl}
              description="For best performance, use a short muted MP4 or WEBM video under 30 MB."
              maxSizeMb={80}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">
                Dark overlay strength: {hero.overlayOpacity}%
              </span>

              <input
                type="range"
                name="overlayOpacity"
                min="0"
                max="90"
                step="5"
                defaultValue={hero.overlayOpacity}
                className="w-full accent-red-600"
              />

              <span className="mt-2 block text-xs text-zinc-500">
                Higher values make the headline easier to read.
              </span>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero statistics</CardTitle>
            <CardDescription>
              Add up to four short trust-building statistics.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 lg:grid-cols-2">
            {statValues.map((stat, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:grid-cols-2"
              >
                <input
                  name={`stat${index + 1}Value`}
                  defaultValue={stat?.value ?? ""}
                  placeholder="500+"
                  className={input}
                />

                <input
                  name={`stat${index + 1}Label`}
                  defaultValue={stat?.label ?? ""}
                  placeholder="Clients helped"
                  className={input}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trust badges</CardTitle>
            <CardDescription>
              Add up to four short credibility statements.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            {badgeValues.map((badge, index) => (
              <input
                key={index}
                name={`badge${index + 1}Text`}
                defaultValue={badge?.text ?? ""}
                placeholder={
                  index === 0
                    ? "Qualified personal trainer"
                    : "Add another trust badge"
                }
                className={input}
              />
            ))}
          </CardContent>
        </Card>

        <div className="sticky bottom-4 flex justify-end rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <Button type="submit" size="lg">
            Save premium hero
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
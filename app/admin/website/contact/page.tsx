import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { updateContactPage } from "./actions";

export const dynamic = "force-dynamic";

type ContactAdminPageProps = {
  searchParams: Promise<{
    saved?: string;
  }>;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-4 focus:ring-red-100";

const textareaClassName =
  "mt-2 min-h-32 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-4 focus:ring-red-100";

function FieldLabel({
  children,
  helpText,
}: {
  children: React.ReactNode;
  helpText?: string;
}) {
  return (
    <span className="block">
      <span className="block text-sm font-black text-zinc-900">
        {children}
      </span>

      {helpText ? (
        <span className="mt-1 block text-xs leading-5 text-zinc-500">
          {helpText}
        </span>
      ) : null}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-zinc-200 px-6 py-5 sm:px-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950">
        {title}
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

export default async function ContactAdminPage({
  searchParams,
}: ContactAdminPageProps) {
  const [{ saved }, settings, content] =
    await Promise.all([
      searchParams,

      prisma.siteSettings.upsert({
        where: {
          id: "main",
        },
        create: {
          id: "main",
          businessName:
            "Tankz Fitness",
        },
        update: {},
      }),

      prisma.contactPageContent.upsert({
        where: {
          id: "main",
        },
        create: {
          id: "main",
        },
        update: {},
      }),
    ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Website CMS
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
            Contact page
          </h1>

          <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-600">
            Edit the public contact page,
            business contact details,
            enquiry messaging and search
            engine information.
          </p>
        </div>

        <Link
          href="/contact"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-black text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          View public page
        </Link>
      </header>

      {saved === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="font-black text-emerald-900">
            Contact page saved
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            Your changes are now visible
            on the public website.
          </p>
        </div>
      ) : null}

      <form
        action={updateContactPage}
        className="space-y-8"
      >
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Contact details"
            title="Business information"
            description="These details appear in the contact cards on the public page."
          />

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <label className="block">
              <FieldLabel>
                Business name
              </FieldLabel>

              <input
                type="text"
                name="businessName"
                required
                defaultValue={
                  settings.businessName
                }
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Email address
              </FieldLabel>

              <input
                type="email"
                name="email"
                defaultValue={
                  settings.email ?? ""
                }
                placeholder="hello@tankzfitness.co.uk"
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Phone number
              </FieldLabel>

              <input
                type="tel"
                name="phone"
                defaultValue={
                  settings.phone ?? ""
                }
                placeholder="07123 456789"
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Address
              </FieldLabel>

              <input
                type="text"
                name="address"
                defaultValue={
                  settings.address ?? ""
                }
                placeholder="Gym address"
                className={
                  inputClassName
                }
              />
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Hero section"
            title="Main contact message"
            description="This is the first content visitors see when they open the Contact page."
          />

          <div className="grid gap-6 p-6 sm:p-8">
            <label className="block">
              <FieldLabel>
                Eyebrow text
              </FieldLabel>

              <input
                type="text"
                name="heroEyebrow"
                required
                defaultValue={
                  content.heroEyebrow
                }
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Main heading
              </FieldLabel>

              <textarea
                name="heroTitle"
                required
                defaultValue={
                  content.heroTitle
                }
                className={
                  textareaClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Supporting text
              </FieldLabel>

              <textarea
                name="heroBody"
                required
                defaultValue={
                  content.heroBody
                }
                className={
                  textareaClassName
                }
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-3">
              <label className="block">
                <FieldLabel>
                  Highlight one
                </FieldLabel>

                <input
                  type="text"
                  name="highlightOne"
                  required
                  defaultValue={
                    content.highlightOne
                  }
                  className={
                    inputClassName
                  }
                />
              </label>

              <label className="block">
                <FieldLabel>
                  Highlight two
                </FieldLabel>

                <input
                  type="text"
                  name="highlightTwo"
                  required
                  defaultValue={
                    content.highlightTwo
                  }
                  className={
                    inputClassName
                  }
                />
              </label>

              <label className="block">
                <FieldLabel>
                  Highlight three
                </FieldLabel>

                <input
                  type="text"
                  name="highlightThree"
                  required
                  defaultValue={
                    content.highlightThree
                  }
                  className={
                    inputClassName
                  }
                />
              </label>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Customer journey"
            title="What happens next"
            description="Explain the three steps visitors can expect after submitting an enquiry."
          />

          <div className="grid gap-8 p-6 sm:p-8">
            <label className="block">
              <FieldLabel>
                Section heading
              </FieldLabel>

              <input
                type="text"
                name="stepsEyebrow"
                required
                defaultValue={
                  content.stepsEyebrow
                }
                className={
                  inputClassName
                }
              />
            </label>

            <div className="grid gap-6 xl:grid-cols-3">
              <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm font-black text-red-600">
                  Step 01
                </p>

                <label className="mt-4 block">
                  <FieldLabel>
                    Title
                  </FieldLabel>

                  <input
                    type="text"
                    name="stepOneTitle"
                    required
                    defaultValue={
                      content.stepOneTitle
                    }
                    className={
                      inputClassName
                    }
                  />
                </label>

                <label className="mt-5 block">
                  <FieldLabel>
                    Description
                  </FieldLabel>

                  <textarea
                    name="stepOneBody"
                    required
                    defaultValue={
                      content.stepOneBody
                    }
                    className={
                      textareaClassName
                    }
                  />
                </label>
              </article>

              <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm font-black text-red-600">
                  Step 02
                </p>

                <label className="mt-4 block">
                  <FieldLabel>
                    Title
                  </FieldLabel>

                  <input
                    type="text"
                    name="stepTwoTitle"
                    required
                    defaultValue={
                      content.stepTwoTitle
                    }
                    className={
                      inputClassName
                    }
                  />
                </label>

                <label className="mt-5 block">
                  <FieldLabel>
                    Description
                  </FieldLabel>

                  <textarea
                    name="stepTwoBody"
                    required
                    defaultValue={
                      content.stepTwoBody
                    }
                    className={
                      textareaClassName
                    }
                  />
                </label>
              </article>

              <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm font-black text-red-600">
                  Step 03
                </p>

                <label className="mt-4 block">
                  <FieldLabel>
                    Title
                  </FieldLabel>

                  <input
                    type="text"
                    name="stepThreeTitle"
                    required
                    defaultValue={
                      content.stepThreeTitle
                    }
                    className={
                      inputClassName
                    }
                  />
                </label>

                <label className="mt-5 block">
                  <FieldLabel>
                    Description
                  </FieldLabel>

                  <textarea
                    name="stepThreeBody"
                    required
                    defaultValue={
                      content.stepThreeBody
                    }
                    className={
                      textareaClassName
                    }
                  />
                </label>
              </article>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <label className="block">
                <FieldLabel>
                  Coaching prompt
                </FieldLabel>

                <input
                  type="text"
                  name="coachingPrompt"
                  required
                  defaultValue={
                    content.coachingPrompt
                  }
                  className={
                    inputClassName
                  }
                />
              </label>

              <label className="block">
                <FieldLabel>
                  Button text
                </FieldLabel>

                <input
                  type="text"
                  name="coachingButtonText"
                  required
                  defaultValue={
                    content.coachingButtonText
                  }
                  className={
                    inputClassName
                  }
                />
              </label>

              <label className="block">
                <FieldLabel>
                  Button destination
                </FieldLabel>

                <input
                  type="text"
                  name="coachingButtonHref"
                  required
                  defaultValue={
                    content.coachingButtonHref
                  }
                  className={
                    inputClassName
                  }
                />
              </label>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Enquiry form"
            title="Form messaging"
            description="Edit the heading, explanation, success message and consent text around the enquiry form."
          />

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <label className="block">
              <FieldLabel>
                Form eyebrow
              </FieldLabel>

              <input
                type="text"
                name="formEyebrow"
                required
                defaultValue={
                  content.formEyebrow
                }
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Form heading
              </FieldLabel>

              <input
                type="text"
                name="formTitle"
                required
                defaultValue={
                  content.formTitle
                }
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block sm:col-span-2">
              <FieldLabel>
                Form introduction
              </FieldLabel>

              <textarea
                name="formBody"
                required
                defaultValue={
                  content.formBody
                }
                className={
                  textareaClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Success heading
              </FieldLabel>

              <input
                type="text"
                name="successTitle"
                required
                defaultValue={
                  content.successTitle
                }
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                Success message
              </FieldLabel>

              <textarea
                name="successBody"
                required
                defaultValue={
                  content.successBody
                }
                className={
                  textareaClassName
                }
              />
            </label>

            <label className="block sm:col-span-2">
              <FieldLabel>
                Consent text
              </FieldLabel>

              <textarea
                name="consentText"
                required
                defaultValue={
                  content.consentText
                }
                className={
                  textareaClassName
                }
              />
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <SectionHeader
            eyebrow="Search and location"
            title="SEO and map settings"
            description="These optional fields control search result text and allow a Google Maps embed to be added later."
          />

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <label className="block sm:col-span-2">
              <FieldLabel
                helpText="Use a Google Maps embed URL, not the normal browser address."
              >
                Google Maps embed URL
              </FieldLabel>

              <input
                type="url"
                name="mapEmbedUrl"
                defaultValue={
                  content.mapEmbedUrl ??
                  ""
                }
                placeholder="https://www.google.com/maps/embed?..."
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                SEO page title
              </FieldLabel>

              <input
                type="text"
                name="seoTitle"
                defaultValue={
                  content.seoTitle ?? ""
                }
                placeholder="Contact Tankz Fitness"
                className={
                  inputClassName
                }
              />
            </label>

            <label className="block">
              <FieldLabel>
                SEO description
              </FieldLabel>

              <textarea
                name="seoDescription"
                defaultValue={
                  content.seoDescription ??
                  ""
                }
                placeholder="Describe the Contact page for search engines."
                className={
                  textareaClassName
                }
              />
            </label>
          </div>
        </section>

        <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-white">
              Ready to publish?
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              Saving updates the public
              Contact page immediately.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500"
          >
            Save contact page
          </button>
        </div>
      </form>
    </div>
  );
}
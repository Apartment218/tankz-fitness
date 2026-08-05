import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

import { submitContactForm } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Tankz Fitness",
  description:
    "Contact Tankz Fitness to discuss personal training, online coaching, strength, fat loss and your fitness goals.",
};

const inputClassName =
  "w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-4 focus:ring-red-100";

const textareaClassName =
  "min-h-40 w-full resize-y rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-4 focus:ring-red-100";

type ContactPageProps = {
  searchParams: Promise<{
    sent?: string;
  }>;
};

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const [{ sent }, settings] = await Promise.all([
    searchParams,
    prisma.siteSettings.upsert({
      where: {
        id: "main",
      },
      create: {
        id: "main",
        businessName: "Tankz Fitness",
      },
      update: {},
    }),
  ]);

  const contactItems = [
    settings.phone
      ? {
          label: "Call us",
          value: settings.phone,
          href: `tel:${settings.phone.replace(/\s+/g, "")}`,
        }
      : null,
    settings.email
      ? {
          label: "Email us",
          value: settings.email,
          href: `mailto:${settings.email}`,
        }
      : null,
    settings.address
      ? {
          label: "Visit us",
          value: settings.address,
          href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            settings.address,
          )}`,
        }
      : null,
  ].filter(
    (
      item,
    ): item is {
      label: string;
      value: string;
      href: string;
    } => item !== null,
  );

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,.36),transparent_28%),radial-gradient(circle_at_10%_80%,rgba(255,255,255,.08),transparent_22%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(255,255,255,.03),transparent_35%,rgba(220,38,38,.08))]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
              Contact Tankz Fitness
            </p>

            <h1 className="mt-5 font-display text-6xl leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
              Your strongest chapter starts with one conversation.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              Tell us where you are now, where you want to go and what has been holding you back. We will help you choose the right coaching path.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {[
                "Personal training",
                "Online coaching",
                "Strength and fat loss",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 self-end">
            {contactItems.length > 0 ? (
              contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Visit us" ? "_blank" : undefined}
                  rel={item.label === "Visit us" ? "noreferrer" : undefined}
                  className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-400/50 hover:bg-white/10"
                >
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                    {item.label}
                  </p>

                  <p className="mt-3 text-xl font-black text-white">
                    {item.value}
                  </p>
                </a>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                  Get in touch
                </p>

                <p className="mt-3 text-xl font-black text-white">
                  Use the form below and we will contact you.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(220,38,38,.08),transparent_24%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8 lg:py-24">
          <aside className="self-start rounded-[2rem] bg-zinc-950 p-8 text-white shadow-2xl lg:sticky lg:top-28">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-red-500">
              What happens next?
            </p>

            <div className="mt-8 space-y-7">
              {[
                {
                  number: "01",
                  title: "We review your goals",
                  body: "Your enquiry arrives directly in Tankz HQ so it is never lost in a crowded inbox.",
                },
                {
                  number: "02",
                  title: "We contact you",
                  body: "A coach will get in touch to learn more about your experience, schedule and ambitions.",
                },
                {
                  number: "03",
                  title: "We build the right plan",
                  body: "You will get a clear recommendation based on the level of support you actually need.",
                },
              ].map((step) => (
                <div key={step.number} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="font-display text-3xl text-red-500">
                    {step.number}
                  </span>

                  <div>
                    <h2 className="text-lg font-black">{step.title}</h2>
                    <p className="mt-2 leading-7 text-zinc-400">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="text-sm font-bold text-zinc-400">
                Ready to subscribe immediately?
              </p>

              <Link
                href="/services"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500"
              >
                View monthly coaching
              </Link>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-red-600">
                Start the conversation
              </p>

              <h2 className="mt-4 font-display text-5xl leading-[0.95] text-zinc-950 sm:text-6xl">
                Tell us what you want to achieve.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
                Complete the form and your enquiry will be added directly to our lead management system.
              </p>
            </div>

            {sent === "1" ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <p className="font-black text-emerald-900">
                  Your message has been sent.
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-700">
                  Thank you for contacting Tankz Fitness. A member of the team will be in touch.
                </p>
              </div>
            ) : null}

            <form action={submitContactForm} className="mt-9 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-700">First name</span>
                <input type="text" name="firstName" required autoComplete="given-name" placeholder="John" className={inputClassName} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-700">Last name</span>
                <input type="text" name="lastName" autoComplete="family-name" placeholder="Smith" className={inputClassName} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-700">Email address</span>
                <input type="email" name="email" required autoComplete="email" placeholder="john@example.com" className={inputClassName} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-700">Phone number</span>
                <input type="tel" name="phone" autoComplete="tel" placeholder="07123 456789" className={inputClassName} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-700">Main goal</span>
                <select name="goal" defaultValue="" className={inputClassName}>
                  <option value="" disabled>Choose your goal</option>
                  <option value="Weight loss">Weight loss</option>
                  <option value="Muscle gain">Build muscle</option>
                  <option value="Strength">Get stronger</option>
                  <option value="General fitness">Improve general fitness</option>
                  <option value="Sports performance">Sports performance</option>
                  <option value="Online coaching">Online coaching</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-700">Enquiry type</span>
                <select name="subject" defaultValue="Personal training enquiry" className={inputClassName}>
                  <option value="Personal training enquiry">Personal training</option>
                  <option value="Online coaching enquiry">Online coaching</option>
                  <option value="Membership enquiry">Membership</option>
                  <option value="Nutrition enquiry">Nutrition support</option>
                  <option value="General enquiry">General enquiry</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-zinc-700">Tell us about yourself</span>
                <textarea name="message" required placeholder="What would you like to achieve, and what support are you looking for?" className={textareaClassName} />
              </label>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-7 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700 sm:w-auto"
                >
                  Send my enquiry
                </button>

                <p className="mt-4 text-xs leading-6 text-zinc-500">
                  By submitting this form, you agree that Tankz Fitness may contact you about your enquiry.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
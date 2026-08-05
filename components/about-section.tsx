export function AboutSection() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/gym-training.png"
        alt="Athletes training in a dark gym"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-background/80" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:py-28">
        <h2 className="leading-[0.9]">
          <span className="block font-display text-5xl tracking-tight text-foreground md:text-7xl">
            FIND A WAY,
          </span>
          <span className="mt-1 block font-script text-4xl text-foreground md:text-6xl">
            not an excuse.
          </span>
        </h2>

        <div className="mt-10 space-y-4 text-center text-sm uppercase leading-relaxed tracking-wide text-muted-foreground md:text-base">
          <p>
            I decided to launch Tankz Fitness because I wanted to make a change, I wanted to inspire
            people. People constantly ask me how I do it all — from being a full time coach to
            studying for a masters and creating a healthy work life balance.
          </p>
          <p>
            I get endless amounts of questions about maintaining results, remaining focused and
            staying consistent. So, I decided to open Tankz Fitness to create a home where I can support
            you along your fitness journey.
          </p>
        </div>

        {/* Two panels */}
        <div className="mt-14 grid gap-0 md:grid-cols-2">
          <div className="bg-card p-8 text-center md:p-10">
            <h3 className="font-display text-3xl tracking-tight text-card-foreground md:text-4xl">
              WHO WE ARE
            </h3>
            <span className="mx-auto mt-3 block h-0.5 w-14 bg-card-foreground/70" />
            <p className="mt-6 text-sm uppercase leading-relaxed tracking-wide text-card-foreground/90">
              At Tankz Fitness we believe if you work hard it pays off. So, are you prepared to put in
              the work? Healthy living is a mindset, and Tankz Fitness has explored every avenue for you
              to achieve just this.
            </p>
          </div>
          <div className="bg-primary p-8 text-center md:p-10">
            <h3 className="font-display text-3xl tracking-tight text-primary-foreground md:text-4xl">
              WHO YOU ARE
            </h3>
            <span className="mx-auto mt-3 block h-0.5 w-14 bg-primary-foreground/70" />
            <p className="mt-6 text-sm uppercase leading-relaxed tracking-wide text-primary-foreground">
              You&apos;re amazing, you&apos;re confident, you&apos;re capable of anything and you can
              do it! We get you, and we&apos;re here to give you everything you need.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="w-full max-w-xs border border-foreground/80 bg-background/40 py-4 text-center text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto sm:px-10"
          >
            Online Live Workouts
          </a>
          <a
            href="#"
            className="w-full max-w-xs border border-foreground/80 bg-background/40 py-4 text-center text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto sm:px-10"
          >
            Book a Gym Class
          </a>
        </div>
      </div>
    </section>
  )
}

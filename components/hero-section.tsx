export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden md:min-h-[85vh]"
    >
      <img
        src="/gym-hero.png"
        alt="Dark, atmospheric gym interior"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <span className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/70 text-4xl font-display text-primary">
          JG
        </span>
        <h1 className="flex flex-col items-center leading-none sm:flex-row sm:items-baseline sm:gap-2">
          <span className="font-display text-6xl tracking-tight text-foreground sm:text-8xl md:text-9xl">
            Tankz Backend
          </span>
          <span className="font-script text-5xl text-muted-foreground sm:text-7xl md:text-8xl">
            Fitness
          </span>
        </h1>
        <p className="mt-6 max-w-md text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Collop Gate Farm · Manchester
        </p>
      </div>
    </section>
  )
}

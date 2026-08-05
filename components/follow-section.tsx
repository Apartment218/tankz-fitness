const FEED = ["/feed-1.png", "/feed-2.png", "/feed-3.png", "/feed-4.png"]

export function FollowSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-display text-3xl uppercase tracking-tight text-primary md:text-4xl">
          Follow us @tankzfitness
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4">
          {FEED.map((src, i) => (
            <a
              key={src}
              href="#"
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={src || "/placeholder.svg"}
                alt={`Tankz Fitness training moment ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/25" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

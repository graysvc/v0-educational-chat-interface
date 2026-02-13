import Link from "next/link"

export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 pb-12 pt-16 text-center md:pb-16 md:pt-20">
      <h1 className="max-w-2xl text-balance text-3xl font-medium leading-snug text-foreground md:text-5xl md:leading-tight">
        Este es el espacio para practicar con Inteligencia Artificial.
      </h1>

      <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
        {"Podés escribir lo que quieras. No hay respuestas correctas o incorrectas."}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/chat"
          className="inline-flex h-12 items-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Empezar a practicar
        </Link>
        <Link
          href="/videos"
          className="inline-flex h-12 items-center rounded-xl border border-border bg-card px-8 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Ver videos
        </Link>
      </div>
    </section>
  )
}

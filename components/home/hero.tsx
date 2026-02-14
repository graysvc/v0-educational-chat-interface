import Link from "next/link"

export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 pb-14 pt-16 text-center md:pb-20 md:pt-24">
      <h1 className="max-w-2xl text-balance text-3xl font-medium leading-snug text-foreground md:text-5xl md:leading-tight">
        Bienvenido al espacio de práctica
      </h1>

      <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
        {"Practicá con inteligencia artificial de forma simple y segura."}
      </p>

      <div className="mt-12">
        <Link
          href="/chat"
          className="inline-flex h-14 items-center rounded-xl bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Empezar a practicar
        </Link>
      </div>
    </section>
  )
}

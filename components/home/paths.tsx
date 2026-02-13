import Link from "next/link"
import { PlayCircle, HelpCircle, PenLine } from "lucide-react"

const paths = [
  {
    icon: PlayCircle,
    title: "Mirá un video corto",
    text: "Explicaciones claras, paso a paso.",
    label: "Ver videos",
    href: "/videos",
  },
  {
    icon: HelpCircle,
    title: "Preguntas frecuentes",
    text: "Respuestas simples a las dudas más comunes.",
    label: "Ir a ayuda",
    href: "/ayuda",
  },
  {
    icon: PenLine,
    title: "Practicá escribiendo",
    text: "Probá una pregunta y mirá qué pasa.",
    label: "Ir al chat",
    href: "/chat",
  },
]

export function Paths() {
  return (
    <section className="px-6 py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Tres formas simples de usar este espacio
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {paths.map((path) => {
            const Icon = path.icon
            return (
              <Link
                key={path.title}
                href={path.href}
                className="group flex flex-col items-start rounded-2xl border border-border bg-card p-7 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {path.title}
                </h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-muted-foreground">
                  {path.text}
                </p>
                <span
                  className="mt-6 inline-flex h-11 items-center rounded-lg border border-border bg-background px-6 text-base font-semibold text-foreground transition-colors group-hover:bg-accent"
                >
                  {path.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

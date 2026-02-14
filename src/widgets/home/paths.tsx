import Link from "next/link";
import { PlayCircle, HelpCircle, PenLine } from "lucide-react";

const paths = [
  {
    icon: PlayCircle,
    tag: "VIDEO",
    text: "Mirá cómo funciona, paso a paso.",
    label: "Ver video",
    href: "/videos",
  },
  {
    icon: HelpCircle,
    tag: "AYUDA",
    text: "Encontrá respuestas a las dudas más comunes.",
    label: "Ver ayuda",
    href: "/ayuda",
  },
  {
    icon: PenLine,
    tag: "PRACTICAR",
    text: "Escribí tu primera pregunta y probá.",
    label: "Empezar",
    href: "/chat",
  },
];

export function Paths() {
  return (
    <section className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-base font-semibold uppercase tracking-widest text-muted-foreground md:text-lg">
          Tres maneras de empezar
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.tag}
                href={path.href}
                className="group flex flex-col items-start rounded-2xl border-2 border-border bg-card p-8 transition-all hover:border-muted-foreground/30 hover:bg-accent hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon
                  className="h-7 w-7 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-foreground">
                  {path.tag}
                </h3>
                <p className="mt-3 flex-1 text-lg leading-relaxed text-muted-foreground">
                  {path.text}
                </p>
                <span className="mt-7 inline-flex h-12 items-center rounded-lg border-2 border-border bg-background px-6 text-base font-semibold text-foreground transition-all group-hover:border-muted-foreground/30 group-hover:bg-accent">
                  {path.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

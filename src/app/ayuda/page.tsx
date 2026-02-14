import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/widgets/layout";

export const metadata: Metadata = {
  title: "Ayuda - Modo Practica",
  description: "Respuestas simples para las dudas mas comunes.",
};

const faqs = [
  {
    q: "Necesito saber algo de inteligencia artificial para usar esto?",
    a: "No. Este espacio esta pensado justamente para empezar desde cero.",
  },
  {
    q: "Puedo preguntar cualquier cosa?",
    a: "Si. Podes preguntar lo que quieras, como si hablaras con alguien.",
  },
  {
    q: "Hay preguntas correctas o incorrectas?",
    a: "No. Todas las preguntas son validas.",
  },
  {
    q: "Que pasa si no entiendo una respuesta?",
    a: "Podes decirlo y pedir que te lo expliquen de otra forma.",
  },
  {
    q: "Esto guarda mis datos personales?",
    a: "No. No guardamos datos personales ni necesitas registrarte.",
  },
  {
    q: "Puedo usarlo todas las veces que quiera?",
    a: "Si. Podes volver cuando tengas ganas.",
  },
  {
    q: "Y si me equivoco o escribo algo mal?",
    a: "No pasa nada. Aca se puede probar sin miedo.",
  },
];

export default function AyudaPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-12 flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Link>
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Ayuda
          </p>
          <h1 className="mt-4 text-center text-balance text-2xl font-medium leading-snug text-foreground md:text-4xl md:leading-tight">
            Respuestas para seguir avanzando
          </h1>
          <p className="mt-5 text-center text-base leading-relaxed text-muted-foreground md:text-lg">
            No hay preguntas tontas. Todas son bienvenidas.
          </p>

          <div className="mt-14 divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-7">
                <h2 className="text-lg font-semibold leading-relaxed text-foreground">
                  {faq.q}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/chat"
              className="inline-flex h-14 items-center rounded-xl bg-primary px-10 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ir al chat
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

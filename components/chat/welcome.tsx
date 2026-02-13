"use client"

import { BookOpen, HeartHandshake, Lightbulb, HelpCircle, Sparkles, PenLine } from "lucide-react"

interface WelcomeProps {
  onSelectPrompt: (prompt: string) => void
  isReturning: boolean
  onPrefill: (text: string) => void
}

const firstTimePrompts = [
  {
    icon: HelpCircle,
    label: "Quiero probar una pregunta simple",
    subtext: "Empeza con algo facil.",
    value: "Hola, quiero probar hacerte una pregunta simple para ver como funciona esto.",
  },
  {
    icon: BookOpen,
    label: "Quiero entender algo del libro",
    subtext: "Pregunta sobre lo que estas leyendo.",
    value: "Quiero que me ayudes a entender algo del libro que estoy leyendo sobre inteligencia artificial.",
  },
  {
    icon: Sparkles,
    label: "Quiero practicar como preguntar mejor",
    subtext: "Te ayudo a reformular.",
    value: "Quiero practicar como hacer mejores preguntas a una inteligencia artificial. Ayudame a mejorar.",
  },
  {
    icon: PenLine,
    label: "Quiero escribir libremente",
    subtext: "Escribi lo que tengas en mente.",
    value: "Quiero escribir libremente y conversar con vos sobre lo que se me ocurra.",
  },
]

const returningOptions = [
  {
    icon: BookOpen,
    label: "Algo del libro",
    prefill: "Estoy leyendo el libro y me gustaría entender\u2026 ",
  },
  {
    icon: HeartHandshake,
    label: "Algo personal / cotidiano",
    prefill: "Hoy quiero hablar sobre algo personal: \u2026 ",
  },
  {
    icon: Lightbulb,
    label: "Algo que quiero aprender",
    prefill: "Quiero aprender sobre\u2026 ",
  },
]

export function Welcome({ onSelectPrompt, isReturning, onPrefill }: WelcomeProps) {
  if (isReturning) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Bienvenido de nuevo
          </p>
          <h1 className="mt-4 text-balance text-2xl font-medium leading-relaxed text-foreground md:text-3xl">
            {"¿De qué tenés ganas de hablar hoy?"}
          </h1>

          <div className="mt-10 flex flex-col gap-3">
            {returningOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onPrefill(option.prefill)}
                  className="flex w-full items-center gap-4 rounded-xl border border-border bg-card px-6 py-5 text-left transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="text-base font-medium text-foreground md:text-lg">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-lg leading-relaxed text-foreground md:text-xl">
          Este es un espacio para practicar.
        </p>
        <p className="mt-2 text-lg leading-relaxed text-foreground md:text-xl">
          {"Podes escribir lo que quieras."}
        </p>
        <p className="mt-2 text-lg leading-relaxed text-muted-foreground md:text-xl">
          No hay preguntas correctas ni incorrectas.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          {firstTimePrompts.map((prompt) => {
            const Icon = prompt.icon
            return (
              <button
                key={prompt.label}
                type="button"
                onClick={() => onSelectPrompt(prompt.value)}
                className="flex w-full items-start gap-4 rounded-xl border border-border bg-card px-6 py-5 text-left transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <span className="block text-base font-semibold text-foreground md:text-lg">
                    {prompt.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {prompt.subtext}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

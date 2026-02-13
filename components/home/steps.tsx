const steps = [
  {
    number: "1",
    text: "Escribí una pregunta.",
  },
  {
    number: "2",
    text: "Leé la respuesta con calma.",
  },
  {
    number: "3",
    text: "Si no entendés algo, volvé a preguntar.",
  },
]

export function Steps() {
  return (
    <section className="px-6 py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Primeros pasos
        </h2>

        <div className="mt-8 flex flex-col gap-5 md:flex-row md:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-1 items-start gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
                {step.number}
              </span>
              <p className="text-lg leading-relaxed text-foreground pt-0.5">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

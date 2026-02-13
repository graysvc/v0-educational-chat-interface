import { ShieldCheck } from "lucide-react"

export function Trust() {
  return (
    <section className="px-6 py-10 md:py-14">
      <div className="mx-auto flex max-w-lg items-start gap-5 rounded-2xl border border-border bg-card px-6 py-6 md:px-8 md:py-7">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Tu privacidad está protegida
          </h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {"No guardamos datos personales. No necesitás registrarte para empezar."}
          </p>
        </div>
      </div>
    </section>
  )
}

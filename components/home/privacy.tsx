import { Lock, CreditCard, BookOpen, Trash2, AlertTriangle } from "lucide-react"

const items = [
  {
    icon: Lock,
    title: "No pedimos datos personales",
    text: "No necesitás registrarte ni dejar tu nombre, email o teléfono para usar este espacio.",
  },
  {
    icon: CreditCard,
    title: "No solicitamos información sensible",
    text: "No pedimos tarjetas de crédito, contraseñas ni datos financieros. Si escribís información sensible por error, te lo vamos a indicar para que no lo compartas.",
  },
  {
    icon: BookOpen,
    title: "Es un espacio educativo",
    text: "Este chat está diseñado para practicar y aprender. No reemplaza asesoramiento profesional.",
  },
  {
    icon: Trash2,
    title: "No guardamos conversaciones personales",
    text: "No almacenamos datos identificables ni perfiles de usuario.",
  },
  {
    icon: AlertTriangle,
    title: "Te ayudamos a cuidar tu información",
    text: "Si detectamos que estás compartiendo algo privado, el sistema te lo va a advertir de forma clara y respetuosa.",
  },
]

export function Privacy() {
  return (
    <section className="px-6 py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
          Privacidad y uso responsable
        </h2>
        <p className="mt-4 text-center text-lg leading-relaxed text-muted-foreground">
          {"Queremos que te sientas seguro practicando. Así cuidamos tu información."}
        </p>

        <div className="mt-12 grid gap-6">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex items-start gap-5 rounded-2xl border-2 border-border bg-card px-7 py-7 md:px-8 md:py-8"
              >
                <Icon className="mt-0.5 h-7 w-7 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

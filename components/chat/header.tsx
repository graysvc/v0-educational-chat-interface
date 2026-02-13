import Link from "next/link"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-3 md:px-6">
      <Link
        href="/"
        className="rounded-md px-3 py-1.5 text-sm font-semibold tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Volver a preguntar
      </Link>
      <span className="text-sm text-muted-foreground">
        {"Estás conversando con el asistente."}
      </span>
    </header>
  )
}

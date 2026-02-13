import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-8">
      <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
        Volver a Preguntar
      </Link>
      <nav className="flex items-center gap-5" aria-label="Navegacion principal">
        <Link
          href="/ayuda"
          className="text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          Ayuda
        </Link>
        <Link
          href="/chat"
          className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Ir al chat
        </Link>
      </nav>
    </header>
  )
}

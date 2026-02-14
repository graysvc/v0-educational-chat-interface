import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-14">
      <p className="text-center text-lg text-muted-foreground">
        {"Ya somos más de "}
        <span className="font-bold text-foreground">{"3.482"}</span>
        {" personas aprendiendo a preguntar mejor."}
      </p>

      <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Enlaces del pie de página">
        <a
          href="mailto:info@volverapreguntar.com"
          className="text-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          Contacto
        </a>
        <span className="text-muted-foreground" aria-hidden="true">{"·"}</span>
        <Link
          href="/privacidad"
          className="text-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          Privacidad
        </Link>
      </nav>
    </footer>
  )
}

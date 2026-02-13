import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <p className="text-center text-lg text-foreground">
        {"Más de "}
        <span className="font-bold">{"3.482"}</span>
        {" personas ya empezaron a practicar."}
      </p>

      <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Enlaces del pie de página">
        <Link
          href="#"
          className="text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          Privacidad
        </Link>
        <span className="text-muted-foreground" aria-hidden="true">{"·"}</span>
        <Link
          href="#"
          className="text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          {"Términos y condiciones"}
        </Link>
      </nav>
    </footer>
  )
}

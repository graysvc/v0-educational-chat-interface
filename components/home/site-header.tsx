import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-center px-6 py-6 md:px-8">
      <Link href="/" className="text-lg font-bold uppercase tracking-widest text-foreground">
        Volver a Preguntar
      </Link>
    </header>
  )
}

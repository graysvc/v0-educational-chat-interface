import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/widgets/layout";
import { Terms } from "@/widgets/home";

export const metadata = {
  title: "Términos de uso - Volver a Preguntar",
  description:
    "Términos de uso del espacio interactivo de Volver a Preguntar.",
};

export default function TerminosPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="px-6 pt-8">
          <Link
            href="/"
            className="mx-auto flex max-w-3xl items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
        <Terms />
      </main>
      <SiteFooter />
    </div>
  );
}

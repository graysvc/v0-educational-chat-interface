import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/widgets/layout";
import { Privacy } from "@/widgets/home";

export const metadata = {
  title: "Privacidad y uso responsable - Volver a Preguntar",
  description:
    "Cómo cuidamos tu información y tu privacidad en este espacio de práctica.",
};

export default function PrivacidadPage() {
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
        <Privacy />
      </main>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Trust() {
  return (
    <section className="px-6 py-12 md:py-16">
      <Link
        href="/privacidad"
        className="mx-auto flex max-w-lg items-start gap-5 rounded-2xl border-2 border-border bg-card px-7 py-7 transition-all hover:border-muted-foreground/30 hover:bg-accent hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:px-8 md:py-8"
      >
        <ShieldCheck
          className="mt-0.5 h-7 w-7 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Tu privacidad está protegida
          </h2>
          <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
            {"No guardamos datos personales. No necesitás registrarte para empezar."}
          </p>
        </div>
      </Link>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ContactModal } from "./contact-modal";

export function SiteFooter() {
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="border-t border-border px-6 pb-14 pt-20">
      <p className="text-center text-lg text-muted-foreground">
        {"Ya somos más de "}
        <span className="font-bold text-foreground">{"3.482"}</span>
        {" personas aprendiendo a preguntar mejor."}
      </p>

      <nav
        className="mt-8 flex items-center justify-center gap-4"
        aria-label="Enlaces del pie de página"
      >
        <button
          type="button"
          onClick={() => setShowContact(true)}
          className="text-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          Contacto
        </button>
        <span className="text-muted-foreground" aria-hidden="true">
          {"·"}
        </span>
        <Link
          href="/privacidad"
          className="text-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          Privacidad
        </Link>
      </nav>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </footer>
  );
}

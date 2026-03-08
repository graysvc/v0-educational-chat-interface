"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { ContactForm } from "./contact-form";

interface ContactModalProps {
  onClose: () => void;
}

export function ContactModal({ onClose }: ContactModalProps) {
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Formulario de contacto"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-card p-8 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle className="h-10 w-10 text-primary" />
            <p className="mt-4 text-lg font-semibold text-foreground">Mensaje enviado</p>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              Te responderé lo antes posible.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <ContactForm onSent={() => setSent(true)} />
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useCallback } from "react";

interface CodeGateProps {
  onSubmit: (code: string) => void;
  error?: string;
  isValidating?: boolean;
}

export function CodeGate({ onSubmit, error, isValidating }: CodeGateProps) {
  const [code, setCode] = useState("");
  const isReady = code.trim().length === 6;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isReady || isValidating) return;
      onSubmit(code.trim().toUpperCase());
    },
    [code, isReady, isValidating, onSubmit],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border-2 border-border bg-card px-8 py-14 text-center md:px-10 md:py-16">
        <h2 className="text-2xl font-semibold leading-snug text-foreground md:text-3xl">
          {"Ingresá el código del libro"}
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {"Lo encontrás en las primeras páginas."}
        </p>

        <form onSubmit={handleSubmit} className="mt-12">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="Ej: AB23C4"
            autoFocus
            className="h-14 w-full rounded-xl border-2 border-border bg-background px-6 text-center text-2xl uppercase tracking-[0.3em] text-foreground placeholder:text-muted-foreground/50 placeholder:tracking-[0.3em] transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring md:h-16 md:text-3xl"
            aria-label="Código de acceso"
          />

          {error && (
            <p className="mt-5 text-lg text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isReady || isValidating}
            className={`mt-10 inline-flex h-14 w-full items-center justify-center rounded-xl text-lg font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-16 md:text-xl ${
              isReady && !isValidating
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            {isValidating ? "Verificando..." : "Ingresar"}
          </button>

          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            {"No necesitás registrarte. Solo ingresá el código."}
          </p>
        </form>
      </div>
    </div>
  );
}

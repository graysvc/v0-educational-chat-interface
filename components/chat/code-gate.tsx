"use client"

import React from "react"

import { useState, useCallback, useEffect } from "react"

const VALID_CODE = "AB232A"
const CODE_KEY = "volverAPreguntar_codeAccess"

interface CodeGateProps {
  onUnlock: () => void
}

export function CodeGate({ onUnlock }: CodeGateProps) {
  const [code, setCode] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = code.trim().toUpperCase()
      if (trimmed === VALID_CODE) {
        try {
          localStorage.setItem(CODE_KEY, "true")
        } catch {
          // localStorage not available
        }
        onUnlock()
      } else {
        setErrorMsg("Código incorrecto. Revisá e intentá de nuevo.")
      }
    },
    [code, onUnlock],
  )

  const isReady = code.trim().length === 6

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
            onChange={(e) => {
              setCode(e.target.value)
              setErrorMsg("")
            }}
            maxLength={6}
            placeholder="Ej: AB23C4"
            autoFocus
            className="h-14 w-full rounded-xl border-2 border-border bg-background px-6 text-center text-2xl tracking-[0.3em] uppercase text-foreground placeholder:text-muted-foreground/50 placeholder:tracking-[0.3em] transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring md:h-16 md:text-3xl"
            aria-label="Código de acceso"
          />

          {errorMsg && (
            <p className="mt-5 text-lg text-destructive" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!isReady}
            className={`mt-10 inline-flex h-14 w-full items-center justify-center rounded-xl text-lg font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-16 md:text-xl ${
              isReady
                ? "bg-[#3E5160] text-white hover:bg-[#4a6275]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Ingresar
          </button>

          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            {"No necesitás registrarte. Solo ingresá el código."}
          </p>
        </form>
      </div>
    </div>
  )
}

export function useCodeGate() {
  const [mounted, setMounted] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(CODE_KEY) === "true") {
        setIsUnlocked(true)
      }
    } catch {
      // localStorage not available
    }
    setMounted(true)
  }, [])

  const unlock = useCallback(() => {
    setIsUnlocked(true)
  }, [])

  return { isUnlocked, unlock, mounted }
}

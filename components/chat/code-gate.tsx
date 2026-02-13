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
      <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card px-10 py-12 text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          {"Ingresá el código que aparece en tu libro"}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {"Lo encontrás en las primeras páginas. Es un código de 6 caracteres."}
        </p>

        <form onSubmit={handleSubmit} className="mt-10">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setErrorMsg("")
            }}
            maxLength={6}
            autoFocus
            className="w-full rounded-xl border-2 border-border bg-background px-6 py-5 text-center text-2xl tracking-[0.25em] uppercase text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Código de acceso"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            {"Ejemplo: AB232A"}
          </p>

          {errorMsg && (
            <p className="mt-4 text-base text-destructive" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!isReady}
            className={`mt-8 inline-flex h-14 w-full items-center justify-center rounded-xl text-lg font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isReady
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Ingresar
          </button>

          <p className="mt-5 text-sm text-muted-foreground">
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

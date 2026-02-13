"use client"

import { forwardRef } from "react"
import { ArrowUp } from "lucide-react"

interface ChatInputProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  function ChatInput({ input, onInputChange, onSubmit, isLoading }, ref) {
    return (
      <div className="border-t border-border bg-background px-4 pb-6 pt-4 md:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!input.trim() || isLoading) return
            onSubmit()
          }}
          className="mx-auto flex max-w-2xl items-end gap-3"
        >
          <textarea
            ref={ref}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (!input.trim() || isLoading) return
                onSubmit()
              }
            }}
            placeholder="Escribí acá tu pregunta..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-border bg-card px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 md:text-lg"
            style={{ minHeight: "56px", maxHeight: "140px" }}
            aria-label="Escribí tu pregunta"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-[56px] shrink-0 items-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold tracking-wide uppercase text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
          >
            Enviar
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    )
  },
)

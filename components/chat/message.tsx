import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface MessageProps {
  message: UIMessage
}

/**
 * Splits raw text into paragraphs (on double newlines or single newlines)
 * and marks paragraphs that start with "¿" so they get extra top margin.
 */
function parseTextIntoParagraphs(text: string) {
  // Split on one or more newlines to get visual paragraphs
  const blocks = text.split(/\n+/).filter((b) => b.trim().length > 0)
  return blocks.map((block, i) => ({
    text: block,
    isQuestion: block.trimStart().startsWith("¿"),
    isFirst: i === 0,
  }))
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user"

  const renderedParts = useMemo(
    () =>
      message.parts.map((part, index) => {
        if (part.type === "text") {
          const paragraphs = parseTextIntoParagraphs(part.text)
          return (
            <div key={index} className="flex flex-col">
              {paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className={cn(
                    "text-[16px] md:text-[17px]",
                    // Extra top spacing for question lines (not the first paragraph)
                    p.isQuestion && !p.isFirst && "mt-3",
                    // Normal paragraph spacing
                    !p.isQuestion && !p.isFirst && "mt-1.5"
                  )}
                >
                  {p.text}
                </p>
              ))}
            </div>
          )
        }
        return null
      }),
    [message.parts]
  )

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[90%] rounded-2xl px-5 py-4 md:max-w-[600px] md:px-6 md:py-5",
          "leading-[1.75]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card border border-border text-foreground"
        )}
      >
        {renderedParts}
      </div>
    </div>
  )
}

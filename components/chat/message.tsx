import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"

interface MessageProps {
  message: UIMessage
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-4 md:max-w-[75%]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card border border-border text-foreground"
        )}
      >
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <p
                key={index}
                className="whitespace-pre-wrap text-base leading-relaxed md:text-lg"
              >
                {part.text}
              </p>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

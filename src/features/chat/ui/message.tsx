"use client";

import type { Message as MessageType } from "@/entities/message";
import { cn } from "@/shared/lib";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  const paragraphs = message.content.split(/\n\n+/);

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-6 py-5 md:max-w-[600px]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-foreground",
        )}
      >
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={cn(
              "whitespace-pre-wrap text-base leading-[1.75] md:text-lg",
              i > 0 && (p.startsWith("¿") ? "mt-3.5" : "mt-2"),
            )}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

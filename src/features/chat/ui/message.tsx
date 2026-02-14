"use client";

import type { Message as MessageType } from "@/entities/message";
import { cn } from "@/shared/lib";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-4 md:max-w-[75%]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap text-base leading-relaxed md:text-lg">
          {message.content}
        </p>
      </div>
    </div>
  );
}

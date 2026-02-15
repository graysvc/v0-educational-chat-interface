"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/entities/message";
import { Message as ChatMessage, ThinkingIndicator } from "@/features/chat";

interface Props {
  messages: Message[];
  isLoading: boolean;
  hasError: boolean;
}

export function ChatMessages({ messages, isLoading, hasError }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto" role="log" aria-label="Conversacion" aria-live="polite">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-4 md:px-6 md:py-6">
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {isLoading && messages[messages.length - 1]?.role === "user" && <ThinkingIndicator />}
        {hasError && (
          <div className="flex w-fit rounded-2xl rounded-bl-md border border-border bg-card px-5 py-4 text-base text-muted-foreground">
            Parece que algo no respondió. Probemos otra vez.
          </div>
        )}
      </div>
    </div>
  );
}

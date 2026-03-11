"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import type { Message as MessageType } from "@/entities/message";
import { cn } from "@/shared/lib";

interface MessageProps {
  message: MessageType;
}

const mdComponents: Components = {
  p: ({ children }) => (
    <p className="mb-3 text-base leading-[1.75] last:mb-0 md:text-lg">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0">{children}</ol>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-2 pl-5 last:mb-0">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-base leading-[1.75] md:text-lg">{children}</li>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/5 px-1.5 py-0.5 text-[0.9em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-black/5 p-3 last:mb-0">{children}</pre>
  ),
  h3: ({ children }) => (
    <p className="mb-1 text-base font-semibold md:text-lg">{children}</p>
  ),
  h4: ({ children }) => (
    <p className="mb-1 text-base font-semibold md:text-lg">{children}</p>
  ),
};

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

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
        {isUser ? (
          <p className="whitespace-pre-wrap text-base leading-[1.75] md:text-lg">
            {message.content}
          </p>
        ) : (
          <ReactMarkdown components={mdComponents}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

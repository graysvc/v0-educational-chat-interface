import { encode } from "gpt-tokenizer/model/gpt-4o-mini";
import type { Message } from "@/entities/message";
import { MAX_CONTEXT_MESSAGES, MAX_CONTEXT_TOKENS } from "@/shared/config";

export function truncateHistory(messages: Message[]): Message[] {
  let window = messages.slice(-MAX_CONTEXT_MESSAGES);

  while (window.length > 1) {
    const total = window.reduce((sum, m) => sum + encode(m.content).length, 0);
    if (total <= MAX_CONTEXT_TOKENS) break;
    window = window.slice(1);
  }

  return window;
}

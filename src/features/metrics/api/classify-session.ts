import type { Message } from "@/entities/message";

/** Fire-and-forget session classification. Does not block the UI. */
export function classifySession(
  messages: Message[],
  sessionId: string,
): void {
  const payload = messages.map((m) => ({ role: m.role, content: m.content }));

  fetch("/api/session-end", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: payload, session_id: sessionId }),
  }).catch(() => {});
}

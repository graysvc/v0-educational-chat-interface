import type { Message } from "@/entities/message";

export interface StreamOptions {
  messages: Message[];
  code: string;
  sessionId: string;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

/**
 * Consumes the SSE stream from /api/chat.
 * Uses fetch + ReadableStream with SSE buffer parsing.
 */
export async function streamChat({
  messages,
  code,
  sessionId,
  onChunk,
  onComplete,
  onError,
}: StreamOptions): Promise<void> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        code,
        sessionId,
      }),
    });

    if (!res.ok) {
      onError(`Error del servidor: ${res.status}`);
      return;
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop()!;

      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed.startsWith("data: ")) continue;
        const payload = trimmed.slice(6);
        if (payload === "[DONE]") { onComplete(); return; }
        try {
          const json = JSON.parse(payload);
          if (json.text) onChunk(json.text);
        } catch {}
      }
    }

    onComplete();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    onError("Error de conexion. Intenta de nuevo.");
  }
}

import type { Message } from "@/entities/message";

export interface StreamOptions {
  messages: Message[];
  code: string;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

/**
 * Consumes the SSE stream from /api/chat.
 * Uses fetch + ReadableStream (not Vercel AI SDK).
 */
export async function streamChat({
  messages,
  code,
  onChunk,
  onComplete,
  onError,
}: StreamOptions): Promise<void> {
  // TODO: Implement SSE consumption with fetch + ReadableStream
  // TODO: Parse chunks and call onChunk for each text fragment
  // TODO: Call onComplete when stream ends
  // TODO: Call onError on failure
  throw new Error("streamChat not implemented");
}

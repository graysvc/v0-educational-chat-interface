export interface FetchStreamOptions {
  url: string;
  body: Record<string, unknown>;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
}

/**
 * Generic SSE/stream fetch wrapper.
 * Uses fetch + ReadableStream to consume server-sent events.
 */
export async function fetchStream({
  url,
  body,
  onChunk,
  onComplete,
  onError,
  signal,
}: FetchStreamOptions): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      onError(`HTTP ${response.status}: ${response.statusText}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError("No readable stream in response");
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      onChunk(text);
    }

    onComplete();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    onError(err instanceof Error ? err.message : "Unknown stream error");
  }
}

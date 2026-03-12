import { NextRequest } from "next/server";
import { OPENAI_MODEL, MAX_TOKENS, SYSTEM_PROMPT, TABLES } from "@/shared/config";
import { supabase } from "@/shared/api";
import { updateSessionTokens, updateSignalCounters } from "@/features/session/api";
import { detectSignals } from "@/shared/lib/signals";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("Missing API key", { status: 500 });
  }

  const { messages, code, sessionId } = await req.json();

  if (!code || typeof code !== "string") {
    return new Response("Code required", { status: 401 });
  }

  if (!sessionId || typeof sessionId !== "string") {
    return new Response("Session ID required", { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLES.CODES)
    .select("code")
    .eq("code", code.toUpperCase().trim())
    .maybeSingle();

  if (error || !data) {
    return new Response("Invalid code", { status: 403 });
  }

  const { data: sessionRow } = await supabase
    .from(TABLES.SESSIONS)
    .select("code")
    .eq("id", sessionId)
    .maybeSingle();

  if (!sessionRow || sessionRow.code !== code.toUpperCase().trim()) {
    return new Response("Session does not belong to code", { status: 403 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Messages required", { status: 400 });
  }

  const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user");
  const signals = lastUserMsg ? detectSignals(lastUserMsg.content) : null;

  const userMessages = messages.map((m: { role: string; content: string }) => ({
    role: m.role,
    content: m.content,
  }));

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_tokens: MAX_TOKENS,
      stream: true,
      stream_options: { include_usage: true },
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...userMessages],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }

  const stream = new TransformStream<Uint8Array, Uint8Array>();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") {
            await writer.write(encoder.encode("data: [DONE]\n\n"));
            continue;
          }
          try {
            const json = JSON.parse(payload);
            if (json.usage) usage = json.usage;
            const text = json.choices?.[0]?.delta?.content;
            if (text) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          } catch {}
        }
      }
    } finally {
      await writer.close();
      if (usage) updateSessionTokens(sessionId, usage);
      if (signals) updateSignalCounters(sessionId, signals);
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

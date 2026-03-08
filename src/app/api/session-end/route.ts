import { NextResponse } from "next/server";
import { OPENAI_MODEL, CLASSIFICATION_PROMPT, TABLES } from "@/shared/config";
import { supabase } from "@/shared/api";

const MAX_RETRIES = 3;
const MAX_CLASSIFICATION_TOKENS = 150;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { messages, session_id } = body;
  if (!session_id || typeof session_id !== "string") {
    return NextResponse.json({ error: "session_id requerido" }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages requerido" }, { status: 400 });
  }

  const chatMessages = [
    { role: "system" as const, content: CLASSIFICATION_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  let classification = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_tokens: MAX_CLASSIFICATION_TOKENS,
        response_format: { type: "json_object" },
        messages: chatMessages,
      }),
    }).catch(() => null);

    if (res?.ok) {
      const data = await res.json().catch(() => null);
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        classification = JSON.parse(content);
        break;
      }
    }

    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }

  if (!classification) {
    return NextResponse.json({ error: "Classification failed after retries" }, { status: 502 });
  }

  await supabase.from(TABLES.SESSION_CLASSIFICATIONS).insert({
    session_id,
    topic: classification.topic ?? null,
    intent: classification.intent ?? null,
    emotion: classification.emotion ?? null,
    friction_level: classification.friction_level ?? null,
    session_outcome: classification.session_outcome ?? null,
    raw_json: classification,
  });

  return NextResponse.json({ ok: true });
}

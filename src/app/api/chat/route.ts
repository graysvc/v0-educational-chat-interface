import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // TODO: Validate code and check monthly usage limit (300 msgs/month)
  // TODO: Fetch to OpenAI with stream: true
  // TODO: Return ReadableStream as SSE
  // TODO: Intercept chunks for token counting + semantic classification

  const { messages, code } = await req.json();

  return new Response("Not implemented", { status: 501 });
}

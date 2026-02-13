import {
  consumeStream,
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `Eres un asistente amable y paciente para personas que están aprendiendo a usar inteligencia artificial por primera vez.
Respondé siempre en español, de forma clara, breve y cálida.
Usá un tono conversacional pero respetuoso.
Evitá jerga técnica.
Si la persona parece confundida, ofrecé una explicación más simple.
Mantené tus respuestas cortas (2-4 oraciones) a menos que la persona pida más detalle.
No uses emojis excesivos.
Si la persona pregunta algo fuera de tu alcance, respondé con honestidad y gentileza.`,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}

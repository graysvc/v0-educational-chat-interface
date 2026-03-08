import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_TO = "guido@grays.vc";
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Servicio de email no configurado." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0 || name.length > MAX_NAME) {
    return NextResponse.json({ error: "Nombre inválido." }, { status: 400 });
  }
  if (typeof email !== "string" || !emailRegex.test(email) || email.length > MAX_EMAIL) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length === 0 || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Mensaje inválido." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Volver a Preguntar <onboarding@resend.dev>",
    to: EMAIL_TO,
    subject: `Nuevo mensaje de contacto — ${name.trim()}`,
    replyTo: email.trim(),
    text: `Nombre: ${name.trim()}\nEmail: ${email.trim()}\n\nMensaje:\n${message.trim()}`,
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo enviar el mensaje." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

"use client";

import { useState } from "react";

interface ContactFormProps {
  onSent: () => void;
}

type Status = "idle" | "sending" | "error";

const inputClass =
  "rounded-xl border border-border bg-background px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ContactForm({ onSent }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
    }).catch(() => null);

    if (!res || !res.ok) {
      const data = await res?.json().catch(() => null);
      setErrorMsg(data?.error ?? "Hubo un error al enviar. Intentá de nuevo.");
      setStatus("error");
      return;
    }

    onSent();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-lg font-medium leading-relaxed text-foreground">
        Si querés comunicarte por el libro o dejar un mensaje, podés hacerlo acá.
      </p>

      <input
        type="text"
        required
        maxLength={100}
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />

      <input
        type="email"
        required
        maxLength={254}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />

      <textarea
        required
        maxLength={2000}
        rows={4}
        placeholder="Mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`resize-none ${inputClass}`}
      />

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}

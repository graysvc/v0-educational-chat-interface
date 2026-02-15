# Streaming SSE — Cliente

## Ubicacion

`src/features/chat/api/stream.ts` (capa `features/chat/api` en FSD)

## Proposito

Consume el stream SSE que emite `/api/chat` y lo convierte en callbacks (`onChunk`, `onComplete`, `onError`) que el hook `useChat` usa para actualizar la UI.

## Interface

```ts
interface StreamOptions {
  messages: Message[];  // Historial completo de la conversacion
  code: string;         // Codigo de acceso (ej: "AB232A")
  onChunk: (text: string) => void;   // Cada fragmento de texto
  onComplete: () => void;            // Stream termino
  onError: (error: string) => void;  // Algo fallo
}
```

## Flujo paso a paso

### 1. Fetch al API route

```ts
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    code,
  }),
});
```

- Solo envia `role` y `content` de cada mensaje.
- Si la respuesta no es ok → `onError` con el status code.

### 2. Lectura del stream

```ts
const reader = res.body!.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  // ...parseo de eventos
}
```

- `ReadableStream` + `getReader()` — no usa `EventSource` ni librerias externas.
- `TextDecoder` con `stream: true` para manejar caracteres multi-byte cortados entre chunks.

### 3. Parseo de eventos SSE

```ts
const parts = buffer.split("\n\n");
buffer = parts.pop()!; // Lo ultimo puede estar incompleto

for (const part of parts) {
  const trimmed = part.trim();
  if (!trimmed.startsWith("data: ")) continue;
  const payload = trimmed.slice(6);

  if (payload === "[DONE]") { onComplete(); return; }

  const json = JSON.parse(payload);
  if (json.text) onChunk(json.text);
}
```

**Por que split por `\n\n`?**

El protocolo SSE separa eventos con doble salto de linea. Un chunk TCP puede contener:
- Medio evento (se queda en el buffer hasta el proximo chunk)
- Un evento completo
- Varios eventos juntos

El split por `\n\n` + guardar el ultimo elemento como buffer resuelve todos los casos.

### 4. Formato de los eventos

El API route emite eventos simplificados:

```
data: {"text":"Hola"}\n\n
data: {"text":" que"}\n\n
data: {"text":" tal"}\n\n
data: [DONE]\n\n
```

- Cada `data: {"text":"..."}` genera un `onChunk(text)`.
- `data: [DONE]` genera `onComplete()`.

## Manejo de errores

```ts
try {
  // ...fetch y lectura
} catch (err) {
  if (err instanceof DOMException && err.name === "AbortError") return;
  onError("Error de conexion. Intenta de nuevo.");
}
```

- `AbortError` se ignora silenciosamente (el usuario cancelo).
- Cualquier otro error → `onError` con mensaje generico.
- Si `res.ok` es false → `onError` con el status code.

## Por que no se usa `fetchStream` de shared/api

El archivo `src/shared/api/fetch-stream.ts` existe pero no se usa porque:

1. Lee chunks raw sin parsear formato SSE.
2. No maneja event boundaries (un chunk TCP puede contener medio evento SSE).
3. `stream.ts` necesita buffer + split por `\n\n` para parseo correcto.

Se mantiene en shared para uso futuro generico.

## Diagrama de datos

```
/api/chat (SSE)
  │
  ▼
stream.ts
  ├── onChunk("Hola")      → useChat actualiza mensaje assistant
  ├── onChunk(" que tal")   → useChat actualiza mensaje assistant
  ├── onComplete()          → useChat marca status "done"
  └── onError("...")        → useChat marca status "error"
```

# API Route — Proxy a OpenAI

## Ubicacion

`src/app/api/chat/route.ts` (capa `app/api` en FSD)

## Proposito

Es el unico punto de contacto con OpenAI. El browser nunca ve la API key — todo pasa por este servidor intermedio.

## Flujo completo

```
Browser (POST /api/chat)
  → Next.js server (route.ts)
    → OpenAI API (stream: true)
    ← SSE chunks de OpenAI
  ← SSE simplificado al browser
```

## Request

**Metodo**: `POST`

**Body**:

```json
{
  "messages": [
    { "role": "user", "content": "Hola, que es una variable?" }
  ],
  "code": "AB232A"
}
```

- `messages`: array de mensajes con `role` y `content`. Solo se envian mensajes de usuario y assistant (el system prompt se agrega server-side).
- `code`: codigo de acceso. Se valida contra la tabla `codes` en Supabase antes de llamar a OpenAI (ver [Tabla codes](../database/tabla-codes.md)).

## Que hace internamente

### 1. Validacion

```ts
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) return new Response("Missing API key", { status: 500 });

if (!Array.isArray(messages) || messages.length === 0)
  return new Response("Messages required", { status: 400 });
```

- Si falta la API key en el entorno → 500.
- Si no hay mensajes → 400.

### 2. Sanitizacion de mensajes

```ts
const userMessages = messages.map((m: { role: string; content: string }) => ({
  role: m.role,
  content: m.content,
}));
```

Solo pasa `role` y `content` a OpenAI. Cualquier campo extra (id, timestamp, classification) se descarta.

### 3. Fetch a OpenAI

```ts
const res = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: OPENAI_MODEL,    // "gpt-4o-mini"
    max_tokens: MAX_TOKENS, // 1024
    stream: true,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...userMessages],
  }),
});
```

- El `SYSTEM_PROMPT` se antepone siempre como primer mensaje.
- `stream: true` activa Server-Sent Events en la respuesta de OpenAI.
- Modelo y tokens vienen de `shared/config/constants.ts`.

### 4. Transformacion del stream

OpenAI envia lineas como:

```
data: {"id":"...","choices":[{"delta":{"content":"Hola"}}]}
data: {"id":"...","choices":[{"delta":{"content":" que"}}]}
data: [DONE]
```

El route las transforma a un formato simplificado:

```
data: {"text":"Hola"}
data: {"text":" que"}
data: [DONE]
```

Esto se hace con un `TransformStream`:

```ts
const stream = new TransformStream<Uint8Array, Uint8Array>();
const writer = stream.writable.getWriter();

// En un IIFE async:
// 1. Lee chunks del body de OpenAI
// 2. Acumula en buffer, split por "\n"
// 3. Para cada linea "data: {...}":
//    - Parsea JSON
//    - Extrae choices[0].delta.content
//    - Re-emite como data: {"text":"..."}\n\n
// 4. "data: [DONE]" → re-emite tal cual
```

**Por que un buffer?** Un chunk TCP puede contener media linea o varias lineas juntas. El buffer acumula y splitea por `\n` para procesar solo lineas completas.

### 5. Response

```ts
return new Response(stream.readable, {
  headers: {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  },
});
```

## Seguridad de la API Key

| Entorno | Donde vive la key | Seguridad |
|---|---|---|
| Desarrollo | `.env.local` | Excluida por `.gitignore` |
| Produccion (Netlify) | Dashboard → Environment variables | Inyectada server-side |
| Runtime | Solo en `route.ts` (server) | Browser nunca la ve |

## Configuracion relacionada

| Constante | Archivo | Valor |
|---|---|---|
| `OPENAI_MODEL` | `shared/config/constants.ts` | `"gpt-4o-mini"` |
| `MAX_TOKENS` | `shared/config/constants.ts` | `1024` |
| `SYSTEM_PROMPT` | `shared/config/system-prompt.ts` | Personalidad del asistente |

## Manejo de errores

- API key faltante → `500 Missing API key`
- Sin codigo de acceso → `401 Code required`
- Codigo invalido → `403 Invalid code`
- Mensajes vacios → `400 Messages required`
- Error de OpenAI (rate limit, key invalida, etc.) → se reenvía el status y texto de OpenAI al browser

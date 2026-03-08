# Funcion RPC — `increment_session_tokens`

## Proposito

Incrementa atomicamente los contadores de tokens de una sesion. Evita el patron read-then-write que causa race conditions cuando multiples requests concurrentes actualizan la misma sesion.

## SQL (ejecutar en Supabase SQL Editor)

```sql
CREATE OR REPLACE FUNCTION increment_session_tokens(
  p_session_id uuid,
  p_prompt int,
  p_completion int,
  p_total int
) RETURNS void AS $$
  UPDATE sessions SET
    prompt_tokens = prompt_tokens + p_prompt,
    completion_tokens = completion_tokens + p_completion,
    total_tokens = total_tokens + p_total
  WHERE id = p_session_id;
$$ LANGUAGE sql;
```

## Como se usa

Desde el codigo TypeScript via `supabase.rpc()`:

```ts
// features/session/api/session-api.ts
await supabase.rpc("increment_session_tokens", {
  p_session_id: sessionId,
  p_prompt: usage.prompt_tokens,
  p_completion: usage.completion_tokens,
  p_total: usage.total_tokens,
});
```

## Por que RPC en vez de SELECT + UPDATE

| Aspecto | Antes (SELECT + UPDATE) | Ahora (RPC) |
|---|---|---|
| Atomicidad | No — lectura y escritura separadas | Si — una sola operacion SQL |
| Race condition | Posible — dos requests leen el mismo valor | Imposible — `prompt_tokens + p_prompt` es atomico |
| Queries | 2 (SELECT + UPDATE) | 1 (RPC) |
| Busqueda | Por `code` (ambiguo con codigo compartido) | Por `session_id` (UUID unico) |

## Contexto del cambio

Antes, `updateSessionTokens(code, usage)` usaba `findActiveSession(code)` para localizar la sesion y luego hacer UPDATE. Con un codigo compartido (ej. "EMPEZAR"), multiples sesiones activas bajo el mismo codigo causaban que los tokens se atribuyeran a la sesion equivocada.

Ahora, `updateSessionTokens(sessionId, usage)` recibe el UUID directamente desde el cliente y hace un UPDATE atomico sin ambiguedad.

## Archivos relacionados

| Archivo | Rol |
|---|---|
| `features/session/api/session-api.ts` | Llama `supabase.rpc("increment_session_tokens", ...)` |
| `app/api/chat/route.ts` | Pasa `sessionId` a `updateSessionTokens` |
| `features/chat/api/stream.ts` | Envia `sessionId` en el body del request |

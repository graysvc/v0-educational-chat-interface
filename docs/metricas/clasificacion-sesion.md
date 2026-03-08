# Clasificacion de sesion al expirar

## Que es

Al detectar que la sesion expiro (timeout), se envian los ultimos mensajes a gpt-4o-mini para obtener una clasificacion estructurada (JSON) de la sesion. No se guarda texto — solo tags.

## Flujo

```
Sesion expira (detectada por use-session, 3 capas)
  → chat-layout.tsx detecta isExpired
  → SI hay mensajes:
      → truncateHistory(messages) — sliding window (8 msgs / 1500 tokens)
      → classifySession(truncatedMsgs, sessionId) — fire-and-forget
      → POST /api/session-end { messages, session_id }
      → Servidor llama a gpt-4o-mini con prompt de clasificacion
      → Recibe JSON { topic, intent, emotion, friction_level, session_outcome }
      → Guarda en Supabase → session_classifications
  → Flujo existente: guarda draft, toast, lock()
```

## Retry server-side

Si la llamada a gpt-4o-mini falla, el servidor reintenta hasta 3 veces con backoff exponencial:

```
Intento 1 → falla → espera 1s
Intento 2 → falla → espera 2s
Intento 3 → falla → retorna 502 (clasificacion perdida)
```

Tiempo maximo: ~9s (dentro del limite de 10s de Netlify free tier).

## JSON de clasificacion

```json
{
  "topic": "tema principal de la conversacion",
  "intent": "aprender | practicar | explorar | resolver-duda | otro",
  "emotion": "positivo | neutral | frustrado | confundido | curioso",
  "friction_level": 0,
  "session_outcome": "productiva | parcial | abandonada | rebote"
}
```

Se usa `response_format: { type: "json_object" }` para garantizar JSON valido.

## Tabla Supabase: `session_classifications`

```sql
CREATE TABLE session_classifications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID NOT NULL REFERENCES sessions(id),
  topic            TEXT,
  intent           TEXT,
  emotion          TEXT,
  friction_level   INTEGER,
  session_outcome  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE session_classifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_session_classifications" ON session_classifications
  FOR INSERT TO anon WITH CHECK (true);
```

RLS: write-only (mismo patron que las otras tablas de metricas).

## Archivos principales

| Archivo | Rol |
|---|---|
| `shared/config/classification-prompt.ts` | Prompt de clasificacion para gpt-4o-mini |
| `app/api/session-end/route.ts` | Route handler: valida, llama LLM con retry, guarda en Supabase |
| `features/metrics/api/classify-session.ts` | Funcion cliente fire-and-forget |
| `widgets/chat/chat-layout.tsx` | Dispara clasificacion al detectar expiracion |

## Privacidad

- Los mensajes se envian al LLM para clasificar pero **NO se guardan en DB**
- Solo se almacena el JSON estructurado (tags)
- Cumple ARCHITECTURE.md: "metricas semanticas se procesan en tiempo real, solo se guardan tags"

## Validacion FSD

```
shared/config/classification-prompt.ts
  → No importa nada                                  ✅

app/api/session-end/route.ts
  → shared/config (capa inferior)                    ✅
  → shared/api (capa inferior)                       ✅

features/metrics/api/classify-session.ts
  → @/entities/message (capa inferior)               ✅

widgets/chat/chat-layout.tsx
  → @/features/chat (truncateHistory, capa inferior) ✅
  → @/features/metrics (classifySession, capa inferior) ✅
```

## Fases de implementacion

- **Fase 1 (actual)**: clasificacion por timeout de sesion (12h). Funciona con `fetch()` normal
- **Fase 2 (pendiente)**: clasificacion por cierre de pestaña. Usara `sendBeacon()` + proteccion contra doble disparo

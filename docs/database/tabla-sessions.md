# Tabla `sessions`

## Que es

Tabla en Supabase que registra cada sesion de uso del chat. Una sesion empieza cuando el usuario ingresa un codigo valido y termina por inactividad (timeout de 12 horas). Cada sesion acumula contadores de mensajes y tokens.

## Schema

```sql
CREATE TABLE sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT NOT NULL REFERENCES codes(code),
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at          TIMESTAMPTZ,
  last_active_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  device            TEXT NOT NULL DEFAULT 'desktop',
  message_count     INTEGER NOT NULL DEFAULT 0,
  prompt_tokens     INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_sessions_code_last_active
  ON sessions (code, last_active_at DESC);
```

| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | `UUID PK` | Identificador unico de la sesion |
| `code` | `TEXT FK → codes` | Codigo del libro que inicio la sesion |
| `started_at` | `TIMESTAMPTZ` | Cuando se creo la sesion |
| `ended_at` | `TIMESTAMPTZ` | No se usa activamente — se infiere como `last_active_at + 12h` |
| `last_active_at` | `TIMESTAMPTZ` | Ultimo mensaje enviado. Base para calcular timeout |
| `device` | `TEXT` | `"mobile"` o `"desktop"` (deteccion por `window.innerWidth < 768`) |
| `message_count` | `INTEGER` | Cantidad de mensajes del usuario en esta sesion |
| `prompt_tokens` | `INTEGER` | Tokens acumulados enviados a OpenAI (input) |
| `completion_tokens` | `INTEGER` | Tokens acumulados recibidos de OpenAI (output) |
| `total_tokens` | `INTEGER` | Suma de prompt + completion tokens |

## RLS (Row Level Security)

```sql
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_sessions" ON sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_sessions" ON sessions
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_sessions" ON sessions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
```

| Operacion | Policy | Para que |
|---|---|---|
| **INSERT** | `anon_insert_sessions` | Crear sesion nueva al desbloquear el chat |
| **SELECT** | `anon_select_sessions` | Buscar sesion activa para resumirla, consultar por ID |
| **UPDATE** | `anon_update_sessions` | Incrementar `message_count`, actualizar `last_active_at`, acumular tokens |
| **DELETE** | No hay policy | Las sesiones son datos de investigacion, no se borran |

## Indice

`idx_sessions_code_last_active` optimiza la query mas frecuente: buscar la sesion activa mas reciente para un codigo dado.

```sql
-- Query que usa el indice (findActiveSession):
SELECT * FROM sessions
WHERE code = $1
  AND last_active_at > $cutoff
  AND ended_at IS NULL
ORDER BY last_active_at DESC
LIMIT 1;
```

## Operaciones CRUD

Todas las operaciones viven en `features/session/api/session-api.ts`:

| Funcion | Operacion SQL | Cuando se usa |
|---|---|---|
| `findActiveSession(code)` | SELECT con filtro de timeout | Init: buscar sesion para resumir |
| `getSessionById(id)` | SELECT por ID | Init: verificar sesion de localStorage |
| `createSession(code, device)` | INSERT | No hay sesion activa, crear nueva |
| `touchSession(id, count)` | UPDATE message_count + last_active_at | Cada mensaje del usuario |
| `updateSessionTokens(code, usage)` | SELECT + UPDATE tokens | Cada respuesta de OpenAI |

## Conteo de tokens

### Por que tres columnas

OpenAI reporta los tokens en dos direcciones:

| Columna | Direccion | Que mide |
|---|---|---|
| `prompt_tokens` | Entrada (usuario → OpenAI) | Todo el contexto enviado: system prompt + historial + mensaje nuevo |
| `completion_tokens` | Salida (OpenAI → usuario) | La respuesta generada por el modelo |
| `total_tokens` | Ambas | `prompt_tokens + completion_tokens` |

Tener las tres columnas permite analizar:
- **Costo**: los prompt tokens y completion tokens tienen precios distintos en OpenAI
- **Eficiencia**: ratio entrada/salida por sesion
- **Tendencia**: si los prompt tokens crecen mucho, el historial se esta acumulando

### Pipeline de conteo

```
1. Usuario envia mensaje desde el browser

2. API route (app/api/chat/route.ts):
   ├── Llama a OpenAI con stream: true, stream_options: { include_usage: true }
   ├── Parsea cada chunk del stream SSE
   ├── Si un chunk tiene json.usage → lo guarda en variable local
   └── En finally block → llama updateSessionTokens(code, usage)

3. updateSessionTokens (features/session/api/session-api.ts):
   ├── findActiveSession(code) → obtiene la sesion actual con sus tokens
   └── UPDATE acumulando: prompt_tokens + new, completion_tokens + new, total_tokens + new
```

### Detalles de implementacion

**En la API route** (`app/api/chat/route.ts`):

```ts
// Se pide a OpenAI que incluya usage en el stream
stream_options: { include_usage: true },

// El ultimo chunk del stream (antes de [DONE]) contiene:
// { "usage": { "prompt_tokens": 150, "completion_tokens": 42, "total_tokens": 192 } }
if (json.usage) usage = json.usage;

// Fire-and-forget en el finally:
if (usage) updateSessionTokens(code, usage);
```

**En session-api** (`features/session/api/session-api.ts`):

```ts
export async function updateSessionTokens(code, usage) {
  const session = await findActiveSession(code);  // obtiene tokens actuales
  if (!session) return;
  await supabase.from("sessions").update({
    prompt_tokens:     session.prompt_tokens     + usage.prompt_tokens,
    completion_tokens: session.completion_tokens  + usage.completion_tokens,
    total_tokens:      session.total_tokens       + usage.total_tokens,
  }).eq("id", session.id);
}
```

### Validacion FSD del conteo

```
app/api/chat/route.ts          → extrae usage del stream, delega a feature   ✅
features/session/api/session-api.ts → logica de negocio (find + accumulate)  ✅
app importa de features (hacia abajo)                                        ✅
Ningun import cross-feature                                                  ✅
```

La API route no contiene logica de sesion — solo extrae el dato de OpenAI y delega a `updateSessionTokens()`.

## Concepto de "bounce"

Una sesion con `message_count = 0` indica que el usuario entro al chat pero no envio ningun mensaje (rebote).

```sql
-- Tasa de rebote
SELECT
  count(*) FILTER (WHERE message_count = 0) AS bounces,
  count(*) AS total,
  round(100.0 * count(*) FILTER (WHERE message_count = 0) / count(*), 1) AS bounce_rate
FROM sessions;
```

## Tipos en el codigo

```ts
// entities/session/types.ts

/** Row shape from Supabase (snake_case) */
interface SessionRow {
  id: string;
  code: string;
  started_at: string;
  ended_at: string | null;
  last_active_at: string;
  device: string;
  message_count: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/** Client-side session (camelCase) */
interface Session {
  id: string;
  code: string;
  startedAt: Date;
  endedAt: Date | null;
  lastActiveAt: Date;
  device: string;
  messageCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
```

El mapper `toSession()` en `features/session/model/session-mapper.ts` convierte `SessionRow` → `Session`.

## Archivos relacionados

| Archivo | Rol |
|---|---|
| `features/session/api/session-api.ts` | CRUD contra Supabase (find, get, create, touch, updateTokens) |
| `features/session/model/use-session.ts` | Hook que orquesta el lifecycle de la sesion |
| `features/session/model/session-storage.ts` | Helpers de localStorage para persistencia cliente |
| `features/session/model/session-mapper.ts` | `toSession()` — SessionRow → Session |
| `entities/session/types.ts` | `SessionRow` (snake_case) y `Session` (camelCase) |
| `app/api/chat/route.ts` | Extrae usage de OpenAI y llama `updateSessionTokens` |
| `shared/config/constants.ts` | `SESSION_TIMEOUT_MS`, `TABLES.SESSIONS` |

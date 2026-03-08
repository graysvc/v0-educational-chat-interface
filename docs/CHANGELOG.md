# Historial de cambios — Volver a Preguntar

Resumen de todas las sesiones de desarrollo, en orden cronologico.

---

## Sesion 1 — Arquitectura base

**Commit**: `e6c90a7` — Initial commit: Volver a Preguntar (FSD architecture)

Se creo el proyecto completo desde cero:

- Next.js 15.5 App Router + TypeScript
- Feature-Sliced Design (FSD): `app → widgets → features → entities → shared`
- Landing page: Hero, Paths, Trust, SiteHeader, SiteFooter
- Paginas: `/chat`, `/videos`, `/ayuda`, `/privacidad`
- Code-gate: acceso con codigo `AB232A`, validacion doble (cliente + servidor)
- Chat UI: input, burbujas, ThinkingIndicator, Welcome con prompts sugeridos
- Streaming SSE custom: proxy a OpenAI sin Vercel AI SDK
- Supabase: tablas `codes`, `sessions`, metricas (stubs), encuestas (stubs)
- Tailwind con design tokens (colores, fuente Inter, border-radius)

**Archivos clave creados**: ~50+ archivos en toda la estructura FSD

---

## Sesion 2 — System prompt pedagogico

**Commit**: `2c2d5ed` — Update system prompt with client's pedagogical guidelines

- Se actualizo el system prompt con las directrices pedagogicas del cliente
- Identidad: paciente, claro, humano
- Estilo: lenguaje simple, respuestas breves, tono tranquilo
- Ensenanza activa: detectar preguntas vagas, invitar a reformular
- Regla de aclaracion: solo 1 pregunta corta cuando hay ambiguedad real

**Archivo**: `shared/config/system-prompt.ts`

---

## Sesion 3 — Sesiones, Supabase y tokens

**Commit**: `681787d` — Add session lifecycle, Supabase integration, token tracking, and docs

- Hook `useSession` con `useReducer` (idle/loading/active/expired)
- Persistencia en localStorage con deteccion de expiracion (3 capas)
- Session API: create, touch, findActive, getById, updateTokens
- Token tracking server-side via `stream_options: { include_usage: true }`
- Toast de expiracion con Sonner
- Draft save/restore al expirar
- Documentacion completa en `docs/`

**Archivos clave**: `features/session/`, `app/api/chat/route.ts`, `docs/`

---

## Sesion 4 — Optimizacion y UI (sesion actual)

### 4.1 Sliding window de contexto

**Commit**: `60d4810` — Add sliding window context for chat

Limita mensajes enviados a OpenAI a los ultimos 8 mensajes o 1500 tokens (lo que ocurra primero). El usuario sigue viendo todo el historial en pantalla.

- Dependencia: `gpt-tokenizer` (encoding `o200k_base`)
- Funcion pura `truncateHistory()` en `features/chat/model/`
- Constantes: `MAX_CONTEXT_MESSAGES = 8`, `MAX_CONTEXT_TOKENS = 1500`

| Beneficio | Detalle |
|---|---|
| Costo | Menos tokens de input = menos gasto |
| Prompt caching | System prompt fijo ocupa mayor parte del prefijo |
| Latencia | Menos tokens = respuesta mas rapida |

**Archivos**: `features/chat/model/truncate-history.ts`, `shared/config/constants.ts`

---

### 4.2 Legibilidad del chat (usuarios 40+)

**Commit**: `93ec6b6` — Improve chat message readability for 40+ users

Cambios puramente CSS/UI en el componente `Message`:

| Cambio | Antes | Despues |
|---|---|---|
| Interlineado | `leading-relaxed` (1.625) | `leading-[1.75]` |
| Ancho burbuja | `md:max-w-[75%]` | `md:max-w-[600px]` |
| Padding | `px-5 py-4` (20/16px) | `px-6 py-5` (24/20px) |
| Parrafos | Un solo `<p>` | Split por `\n\n` en `<p>` separados |
| Preguntas "¿" | Sin separacion | `mt-3.5` (14px) extra |

**Archivo**: `features/chat/ui/message.tsx`

---

### 4.3 Renderizado Markdown en mensajes del asistente

Instalacion de `react-markdown` para renderizar respuestas del LLM correctamente:

- Bold (`**texto**`), italic, listas, code inline, code blocks
- Componentes custom con Tailwind para cada elemento HTML
- Solo mensajes del asistente — usuario sigue como texto plano
- Mitigacion de `<p>`: `mb-2 last:mb-0` evita espacio extra

**Archivo**: `features/chat/ui/message.tsx`

---

### 4.4 Google Analytics 4

Integracion de GA4 con `next/script`:

- Tag ID: `G-99RGC7DP46`
- `strategy="afterInteractive"` para no bloquear render
- En el root layout (`app/layout.tsx`)

**Archivo**: `app/layout.tsx`

---

### 4.5 Mensajes de bienvenida actualizados

Pantalla de bienvenida para usuarios que vuelven:

- Titulo cambiado: "Bienvenido de nuevo" → "Este es un espacio para practicar."
- Subtitulo: "No hay preguntas correctas ni incorrectas."
- Opciones reducidas a 2: "Empezar con una pregunta simple" y "Escribir libremente"
- Subtexto agregado a las opciones (mismo estilo que first-time)

**Archivos**: `features/chat/ui/welcome.tsx`, `features/chat/ui/welcome-prompts.ts`

---

### 4.6 Formulario de contacto

Modal de contacto que reemplaza el link `mailto:` del footer:

- Campos: nombre, email, mensaje
- Envio de email via Resend a `guido@grays.vc`
- Validacion client-side (HTML nativo) + server-side (regex, limites)
- Estado: idle → sending → sent (con mensaje de confirmacion)
- API route: `POST /api/contact`

**Estado**: implementado, pendiente configurar `RESEND_API_KEY` en `.env.local` y Netlify.

**Archivos**: `app/api/contact/route.ts`, `widgets/layout/contact-modal.tsx`, `widgets/layout/contact-form.tsx`, `widgets/layout/site-footer.tsx`

---

### 4.7 Clasificacion de sesion al expirar (Fase 1)

Al expirar la sesion, se envian los ultimos mensajes a gpt-4o-mini para obtener una clasificacion estructurada:

```json
{
  "topic": "",
  "intent": "",
  "emotion": "",
  "friction_level": 0,
  "session_outcome": "",
}
```

- Fire-and-forget desde el cliente (no bloquea UI)
- Retry server-side: 3 intentos con backoff exponencial
- Se guarda el JSON extraido en columnas + JSON crudo en `raw_json`
- Tabla Supabase: `session_classifications`
- No se guarda texto de mensajes (privacidad)

**Estado**: implementado y probado. Timeout temporalmente en 30s para testing — **restaurar a 12h antes de deploy**.

**Archivos**: `app/api/session-end/route.ts`, `features/metrics/api/classify-session.ts`, `shared/config/classification-prompt.ts`, `widgets/chat/chat-layout.tsx`

---

## Sesion 5 — Fix: tokens atribuidos a sesion incorrecta con codigo compartido

### Bug

`updateSessionTokens(code, usage)` usaba `findActiveSession(code)` para localizar la sesion. Con codigos compartidos (ej. "EMPEZAR"), multiples sesiones activas bajo el mismo codigo causaban que los tokens se atribuyeran a la sesion mas reciente — no necesariamente la correcta.

### Fix

Se pasa `sessionId` (UUID) desde el cliente a traves de toda la cadena de request:

```
ChatLayout (session.id) → sendMessage(input, sessionId) → streamChat({ sessionId })
  → POST /api/chat { sessionId } → updateSessionTokens(sessionId, usage)
```

### Mejoras de seguridad incluidas

| Riesgo | Solucion |
|---|---|
| Session null al enviar | Guards `if (!session) return` en handlers de ChatLayout |
| sessionId spoofeado | Validacion server-side: `sessionId` debe pertenecer al `code` enviado |
| Race condition en tokens | UPDATE atomico via funcion SQL `increment_session_tokens` (RPC) |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `features/session/api/session-api.ts` | `updateSessionTokens(sessionId)` usa `supabase.rpc()` |
| `features/chat/api/stream.ts` | `StreamOptions` incluye `sessionId` |
| `features/chat/model/use-chat.ts` | `sendMessage(input, sessionId)` |
| `widgets/chat/chat-layout.tsx` | Pasa `session.id`, null guards |
| `app/api/chat/route.ts` | Extrae + valida `sessionId`, anti-spoofing |

### Infraestructura de testing

- Vitest configurado (`vitest.config.ts`, script `npm test`)
- Test unitario TDD para `updateSessionTokens` (3 tests)

### SQL requerido en Supabase

```sql
CREATE OR REPLACE FUNCTION increment_session_tokens(
  p_session_id uuid, p_prompt int, p_completion int, p_total int
) RETURNS void AS $$
  UPDATE sessions SET
    prompt_tokens = prompt_tokens + p_prompt,
    completion_tokens = completion_tokens + p_completion,
    total_tokens = total_tokens + p_total
  WHERE id = p_session_id;
$$ LANGUAGE sql;
```

---

## Sesion 6 — device_id: identificacion anonima de usuarios recurrentes

Con el cambio a codigo compartido ("EMPEZAR"), ya no es posible distinguir usuarios por codigo. Se agrega un `device_id` anonimo para agrupar sesiones del mismo dispositivo.

### Implementacion

- `crypto.randomUUID()` genera un UUID en la primera visita
- Se persiste en `localStorage["guido-device"]`
- Se envia con cada `createSession()` y se guarda en la columna `device_id`
- No es dato personal — es un identificador aleatorio sin relacion con hardware

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `features/session/model/session-storage.ts` | Nueva funcion `getOrCreateDeviceId()` |
| `features/session/api/session-api.ts` | `createSession(code, device, deviceId)` |
| `features/session/model/use-session.ts` | Llama `getOrCreateDeviceId()` y lo pasa a `createSession` |
| `entities/session/types.ts` | `device_id` en `SessionRow`, `deviceId` en `Session` |
| `features/session/model/session-mapper.ts` | Mapea `device_id` → `deviceId` |

### Tests

- 3 tests TDD para `getOrCreateDeviceId()` (genera nuevo, retorna existente, tipo string)

### SQL requerido en Supabase

```sql
ALTER TABLE sessions ADD COLUMN device_id TEXT;
CREATE INDEX idx_sessions_device_id ON sessions (device_id);
```

---

## Pendientes

| Item | Estado | Notas |
|---|---|---|
| `RESEND_API_KEY` en Netlify | Esperando API key del cliente | Formulario de contacto no envia hasta configurar |
| ~~Restaurar `SESSION_TIMEOUT_MS`~~ | Completado | Configurado a 40 minutos |
| Fase 2: clasificacion por cierre de pestaña | Pendiente | `sendBeacon()` + proteccion doble disparo |
| Refactorizar `use-chat.ts` (64 lineas, limite 50) | Pendiente | Pre-existente, no urgente |
| Verificar sender de Resend con dominio propio | Opcional | Requiere config DNS |

---

## Dependencias agregadas

| Paquete | Version | Para que |
|---|---|---|
| `gpt-tokenizer` | ^3.4.0 | Conteo de tokens en sliding window |
| `react-markdown` | ^10.1.0 | Renderizado Markdown en mensajes del asistente |
| `resend` | latest | Envio de emails desde formulario de contacto |

---

## Tablas Supabase

| Tabla | Estado | Uso |
|---|---|---|
| `codes` | Activa | Codigos de acceso |
| `sessions` | Activa | Sesiones de chat, tokens, contadores |
| `session_classifications` | Activa | Clasificacion LLM al expirar sesion |
| `metrics_behavioral` | Creada, no conectada | Metricas capa 1 |
| `metrics_cognitive` | Creada, no conectada | Metricas capa 2 |
| `metrics_semantic` | Creada, no conectada | Metricas capa 3 (por mensaje) |
| `survey_responses` | Creada, no conectada | Micro-encuestas |

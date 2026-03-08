# Documentacion — Volver a Preguntar

## Estructura

```
docs/
├── INDICE.md              ← Este archivo
├── CHANGELOG.md           ← Historial de todas las sesiones de desarrollo
├── chat/
│   ├── api-openai.md      ← API route, proxy a OpenAI, seguridad de la key
│   ├── streaming.md       ← Cliente SSE, parseo de chunks, buffer
│   ├── estado-chat.md     ← useChat hook, reducer, mensajes, system prompt
│   └── ventana-contexto.md ← Sliding window de contexto (8 msgs / 1500 tokens)
├── session/
│   └── estado-sesion.md   ← useSession hook, reducer, localStorage, expiracion, toast
├── contacto/
│   └── formulario-contacto.md ← Modal de contacto, Resend, validacion, seguridad
├── metricas/
│   └── clasificacion-sesion.md ← Clasificacion LLM al expirar sesion, retry, Supabase
└── database/
    ├── conexion-supabase.md ← Cliente Supabase, variables de entorno, seguridad
    ├── tabla-codes.md       ← Tabla codes, validacion doble (cliente + servidor)
    ├── tabla-sessions.md    ← Tabla sessions, schema, RLS, conteo de tokens
    ├── tablas-metricas.md   ← Tablas de metricas y encuestas (4 tablas, stubs)
    └── rpc-increment-tokens.md ← Funcion RPC para incremento atomico de tokens
```

## Chat

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [API OpenAI](chat/api-openai.md) | Route handler que hace proxy a OpenAI con streaming SSE. Seguridad de la API key. Formato de request/response. | `app/api/chat/route.ts` |
| [Streaming SSE](chat/streaming.md) | Cliente que consume el stream SSE desde el browser. Parseo con buffer, manejo de event boundaries, callbacks. | `features/chat/api/stream.ts` |
| [Estado del Chat](chat/estado-chat.md) | Hook `useChat`, reducer de estados, manejo de mensajes con `useRef`, factory `createMessage`, system prompt. | `features/chat/model/use-chat.ts`, `features/chat/model/chat-reducer.ts`, `entities/message/helpers.ts`, `shared/config/system-prompt.ts` |
| [Ventana de Contexto](chat/ventana-contexto.md) | Sliding window que limita mensajes enviados a OpenAI (ultimos 8 mensajes / 1500 tokens). Tokenizador `gpt-tokenizer`. | `features/chat/model/truncate-history.ts`, `shared/config/constants.ts` |

## Session

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [Estado de la Sesion](session/estado-sesion.md) | Hook `useSession`, reducer de estados, localStorage, deteccion de expiracion (3 capas), toast con Sonner, draft save/restore. | `features/session/model/use-session.ts`, `features/session/model/session-reducer.ts`, `features/session/model/session-storage.ts`, `widgets/chat/chat-layout.tsx` |

## Database

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [Conexion Supabase](database/conexion-supabase.md) | Cliente singleton, variables de entorno, modelo de seguridad de las keys publicas. | `shared/api/supabase.ts` |
| [Tabla codes](database/tabla-codes.md) | Tabla de codigos de acceso, schema, RLS, validacion doble (cliente + servidor). | `features/code-gate/api/validate-code.ts`, `app/api/chat/route.ts` |
| [Tabla sessions](database/tabla-sessions.md) | Schema de la tabla `sessions`, RLS, operaciones CRUD, pipeline de conteo de tokens (3 columnas), `device_id` para usuarios recurrentes, concepto de bounce, tipos TypeScript. | `features/session/api/session-api.ts`, `entities/session/types.ts`, `app/api/chat/route.ts` |
| [Tablas de metricas](database/tablas-metricas.md) | Las 4 tablas de metricas y encuestas: `metrics_behavioral`, `metrics_cognitive`, `metrics_semantic`, `survey_responses`. Schema, RLS (write-only), modelo de datos. Creadas pero no conectadas al codigo. | `shared/config/constants.ts` |
| [RPC increment_session_tokens](database/rpc-increment-tokens.md) | Funcion SQL para incremento atomico de tokens. Elimina race conditions y busqueda por codigo. | `features/session/api/session-api.ts` |

## Metricas

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [Clasificacion de Sesion](metricas/clasificacion-sesion.md) | Clasificacion LLM al expirar sesion. Prompt, retry server-side (3 intentos), tabla `session_classifications`, fire-and-forget desde cliente. | `app/api/session-end/route.ts`, `features/metrics/api/classify-session.ts`, `shared/config/classification-prompt.ts` |

## Contacto

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [Formulario de Contacto](contacto/formulario-contacto.md) | Modal con formulario (nombre, email, mensaje), envio de email via Resend, validacion client/server, seguridad. | `app/api/contact/route.ts`, `widgets/layout/contact-modal.tsx`, `widgets/layout/site-footer.tsx` |

## Historial

| Documento | Que cubre |
|---|---|
| [CHANGELOG](CHANGELOG.md) | Resumen cronologico de todas las sesiones de desarrollo: arquitectura base, system prompt, sesiones/Supabase, sliding window, UI, Markdown, GA4, contacto, clasificacion de sesion. Incluye pendientes y dependencias. |

## Arquitectura general

El proyecto sigue **Feature-Sliced Design (FSD)**:

```
app → widgets → features → entities → shared
```

Cada capa solo puede importar de capas inferiores. Ver `ARCHITECTURE.md` en la raiz del proyecto para las reglas completas.

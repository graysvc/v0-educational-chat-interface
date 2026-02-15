# Documentacion — Volver a Preguntar

## Estructura

```
docs/
├── INDICE.md              ← Este archivo
├── chat/
│   ├── api-openai.md      ← API route, proxy a OpenAI, seguridad de la key
│   ├── streaming.md       ← Cliente SSE, parseo de chunks, buffer
│   └── estado-chat.md     ← useChat hook, reducer, mensajes, system prompt
├── session/
│   └── estado-sesion.md   ← useSession hook, reducer, localStorage, expiracion, toast
└── database/
    ├── conexion-supabase.md ← Cliente Supabase, variables de entorno, seguridad
    ├── tabla-codes.md       ← Tabla codes, validacion doble (cliente + servidor)
    ├── tabla-sessions.md    ← Tabla sessions, schema, RLS, conteo de tokens
    └── tablas-metricas.md   ← Tablas de metricas y encuestas (4 tablas, stubs)
```

## Chat

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [API OpenAI](chat/api-openai.md) | Route handler que hace proxy a OpenAI con streaming SSE. Seguridad de la API key. Formato de request/response. | `app/api/chat/route.ts` |
| [Streaming SSE](chat/streaming.md) | Cliente que consume el stream SSE desde el browser. Parseo con buffer, manejo de event boundaries, callbacks. | `features/chat/api/stream.ts` |
| [Estado del Chat](chat/estado-chat.md) | Hook `useChat`, reducer de estados, manejo de mensajes con `useRef`, factory `createMessage`, system prompt. | `features/chat/model/use-chat.ts`, `features/chat/model/chat-reducer.ts`, `entities/message/helpers.ts`, `shared/config/system-prompt.ts` |

## Session

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [Estado de la Sesion](session/estado-sesion.md) | Hook `useSession`, reducer de estados, localStorage, deteccion de expiracion (3 capas), toast con Sonner, draft save/restore. | `features/session/model/use-session.ts`, `features/session/model/session-reducer.ts`, `features/session/model/session-storage.ts`, `widgets/chat/chat-layout.tsx` |

## Database

| Documento | Que cubre | Archivos principales |
|---|---|---|
| [Conexion Supabase](database/conexion-supabase.md) | Cliente singleton, variables de entorno, modelo de seguridad de las keys publicas. | `shared/api/supabase.ts` |
| [Tabla codes](database/tabla-codes.md) | Tabla de codigos de acceso, schema, RLS, validacion doble (cliente + servidor). | `features/code-gate/api/validate-code.ts`, `app/api/chat/route.ts` |
| [Tabla sessions](database/tabla-sessions.md) | Schema de la tabla `sessions`, RLS, operaciones CRUD, pipeline de conteo de tokens (3 columnas), concepto de bounce, tipos TypeScript. | `features/session/api/session-api.ts`, `entities/session/types.ts`, `app/api/chat/route.ts` |
| [Tablas de metricas](database/tablas-metricas.md) | Las 4 tablas de metricas y encuestas: `metrics_behavioral`, `metrics_cognitive`, `metrics_semantic`, `survey_responses`. Schema, RLS (write-only), modelo de datos. Creadas pero no conectadas al codigo. | `shared/config/constants.ts` |

## Arquitectura general

El proyecto sigue **Feature-Sliced Design (FSD)**:

```
app → widgets → features → entities → shared
```

Cada capa solo puede importar de capas inferiores. Ver `ARCHITECTURE.md` en la raiz del proyecto para las reglas completas.

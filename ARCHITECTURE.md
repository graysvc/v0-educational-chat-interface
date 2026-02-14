# ARCHITECTURE — Volver a Preguntar

Documento de referencia obligatorio para toda implementación.
Cada feature debe cumplir con este paradigma, stack y límites.

---

## Stack

| Capa           | Tecnología                        |
|----------------|-----------------------------------|
| Framework      | Next.js (App Router)              |
| Lenguaje       | TypeScript (strict)               |
| Styling        | Tailwind CSS + shadcn/ui (Radix)  |
| LLM            | OpenAI API directo (streaming custom, sin Vercel AI SDK) |
| Base de datos  | Supabase (PostgreSQL)             |
| Hosting        | Netlify                           |
| State          | useReducer + discriminated unions |
| Fuente         | Inter (Google Fonts)              |
| Idioma UI      | Español                           |

---

## Paradigma: Feature-Sliced Design (Lite)

### Capas (de mayor a menor nivel)

```
app → widgets → features → entities → shared
```

**Regla fundamental**: cada capa solo puede importar de capas inferiores. Nunca hacia arriba ni entre siblings del mismo nivel.

```
src/
├── app/                        # Routing Next.js + API routes
│   ├── layout.tsx
│   ├── page.tsx
│   ├── chat/page.tsx
│   ├── videos/page.tsx
│   ├── ayuda/page.tsx
│   ├── privacidad/page.tsx
│   └── api/
│       └── chat/route.ts
│
├── widgets/                    # Composiciones de UI para páginas
│   ├── home/                   # Hero, Steps, Paths, Trust
│   ├── chat/                   # ChatLayout (compone features)
│   └── layout/                 # Header, Footer
│
├── features/                   # Lógica de negocio por feature
│   ├── chat/
│   │   ├── ui/                 # ChatInput, Message, Welcome, ThinkingIndicator
│   │   ├── model/              # hooks, reducers, types
│   │   └── api/                # streaming OpenAI, parseo de chunks
│   ├── code-gate/
│   │   ├── ui/                 # CodeGate modal
│   │   └── model/              # validación, localStorage, hook
│   ├── metrics/
│   │   ├── model/              # tracking hooks, event collectors
│   │   └── api/                # envío de métricas a Supabase
│   └── survey/
│       ├── ui/                 # Micro-encuestas post-sesión
│       └── model/              # tipos, lógica
│
├── entities/                   # Modelos de dominio puros
│   ├── session/                # tipo Session, duración, estado
│   ├── message/                # tipo Message, clasificación semántica
│   └── code/                   # tipo Code, formato, validación
│
└── shared/                     # Transversal, sin lógica de negocio
    ├── ui/                     # shadcn components reutilizables
    ├── lib/                    # utils, cn(), helpers genéricos
    ├── config/                 # constantes, env vars, system prompt
    └── api/                    # fetch wrappers, error handling base
```

### Reglas de importación

```
app/          → puede importar de: widgets, features, entities, shared
widgets/      → puede importar de: features, entities, shared
features/     → puede importar de: entities, shared
entities/     → puede importar de: shared
shared/       → no importa de ninguna otra capa
```

**Prohibido**:
- `features/chat/` importando de `features/metrics/` (cross-feature)
- `entities/` importando de `features/`
- `shared/` importando de cualquier otra capa

**Comunicación cross-feature**: se resuelve en `widgets/` o `app/`, nunca entre features directamente.

### Estructura interna de cada feature

```
features/[nombre]/
├── ui/          # Componentes React (solo presentación + hooks propios)
├── model/       # Hooks, reducers, tipos, lógica de estado
└── api/         # Llamadas a servicios externos o endpoints
```

---

## Límites de líneas por archivo

| Tipo              | Máximo | Nota                                      |
|-------------------|--------|--------------------------------------------|
| Componente UI     | 100    | Si pasa de 100, descomponer                |
| Hook              | 50     | Un hook = una responsabilidad              |
| Reducer / State   | 120    | Incluye tipos + reducer + estado inicial   |
| API Service       | 80     | Incluye fetch + parseo + error handling    |

Si un archivo excede el límite, **descomponer** en unidades más pequeñas antes de continuar.

---

## State Management

### Patrón: useReducer + Discriminated Unions

No se usa XState ni librerías externas de estado.

```ts
// Ejemplo: features/chat/model/chat-reducer.ts

type ChatState =
  | { status: 'idle' }
  | { status: 'sending'; input: string }
  | { status: 'streaming'; chunks: string }
  | { status: 'done' }
  | { status: 'error'; error: string }

type ChatAction =
  | { type: 'SEND'; input: string }
  | { type: 'CHUNK'; text: string }
  | { type: 'COMPLETE' }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' }
```

**Reglas**:
- Cada flujo con más de 2 estados usa useReducer (no useState múltiple)
- Los tipos de estado son discriminated unions (nunca flags booleanos sueltos)
- Side-effects van en useEffect junto al reducer, no dentro del reducer
- Flujos triviales (ej: survey show/hide) pueden usar useState

---

## Streaming Custom (OpenAI)

No se usa Vercel AI SDK. El streaming se implementa manualmente:

**Server** (`app/api/chat/route.ts`):
- Fetch a OpenAI con `stream: true`
- Retorna `ReadableStream` como SSE
- Intercepta chunks para: contar tokens, clasificar mensaje (métricas semánticas)

**Client** (`features/chat/api/`):
- Consume SSE con `EventSource` o `fetch` + `ReadableStream`
- Alimenta el reducer con acciones `CHUNK` por cada fragmento
- Al completar: dispara métricas y clasificación

---

## Base de datos (Supabase)

### Tablas core para MVP

**codes**: códigos válidos de libros
- `code` (PK), `monthly_usage`, `last_reset_month`, `created_at`

**sessions**: una sesión = una conversación
- `id`, `code`, `started_at`, `ended_at`, `device`, `message_count`, `token_count`

**metrics_behavioral**: métricas capa 1
- `session_id` (FK), `duration_seconds`, `bounce`, `time_between_msgs_avg`

**metrics_cognitive**: métricas capa 2
- `session_id` (FK), `reformulations`, `simpler_requests`, `not_understood`, `abandoned_after_error`

**metrics_semantic**: métricas capa 3 (por mensaje, solo tags)
- `session_id` (FK), `category`, `intention`, `cognitive_level`, `structure`, `emotion`, `ai_relationship`

**survey_responses**: micro-encuestas
- `session_id` (FK), `utility` (si/masomenos/no), `feeling` (tranquilo/bien/confundido/frustrado)

**No se almacena**: texto de mensajes, datos personales, información sensible.

---

## Privacidad — Restricciones arquitectónicas

1. **No persistir texto de conversaciones** → métricas semánticas se procesan en tiempo real, solo se guardan tags
2. **No datos personales** → el código del libro es el único identificador, anónimo
3. **No datos sensibles** → detección PII ligera en el frontend antes de enviar
4. **Declaración** → modal/pantalla de política obligatoria en primer uso

---

## Límites de uso

- **300 mensajes por mes por código**
- El contador se resetea el día 1 de cada mes
- Se valida server-side en `api/chat/route.ts` antes de llamar a OpenAI
- El frontend muestra mensajes restantes al usuario

---

## Métricas — 3 capas

### Capa 1: Comportamiento (qué hacen)
Sesiones/día, duración, mensajes/sesión, tasa de rebote, tiempo entre mensajes, momento de abandono, dispositivo, frecuencia de retorno, tokens/sesión.

### Capa 2: Cognitiva (cómo interactúan)
Reformulaciones, pedidos de "más simple", "no entendí", abandono post-error.
Se detecta via pattern matching ligero sobre el mensaje del usuario.

### Capa 3: Semántica (qué preguntan)
Categoría temática, intención, nivel cognitivo, estructura de pregunta, emoción, relación con IA.
Se clasifica pidiéndole al LLM que tagee cada mensaje junto con la respuesta (JSON estructurado en el system prompt).

---

## Convenciones

- **Archivos**: kebab-case (`chat-input.tsx`, `code-gate.tsx`)
- **Componentes**: PascalCase (`ChatInput`, `CodeGate`)
- **Hooks**: camelCase con prefijo `use` (`useChat`, `useCodeGate`)
- **Tipos**: PascalCase con sufijo descriptivo (`ChatState`, `ChatAction`, `SessionMetrics`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_MESSAGES_PER_MONTH`, `VALID_CODE_LENGTH`)

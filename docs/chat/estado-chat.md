# Estado del Chat — useChat Hook

## Ubicacion

- Hook: `src/features/chat/model/use-chat.ts`
- Reducer: `src/features/chat/model/chat-reducer.ts`
- Tipos: `src/features/chat/model/types.ts`
- Factory: `src/entities/message/helpers.ts`

## Arquitectura de estado

El chat usa dos mecanismos de estado complementarios:

| Mecanismo | Para que | Por que |
|---|---|---|
| `useReducer` (ChatState) | Status de la UI (idle, sending, streaming, done, error) | Maquina de estados predecible |
| `useState` + `useRef` (messages) | Array de mensajes | `useRef` evita stale closures en callbacks de streaming |

## ChatState — Maquina de estados

```ts
type ChatState =
  | { status: "idle" }
  | { status: "sending"; input: string }
  | { status: "streaming"; chunks: string }
  | { status: "done" }
  | { status: "error"; error: string };
```

### Transiciones

```
idle ──SEND──► sending ──CHUNK──► streaming ──COMPLETE──► done
  ▲               │                    │                    │
  │               └────ERROR──────────►│◄───────────────────┘
  │                                    │
  └─────────────RESET──────────────────┘
```

### Acciones del reducer

| Accion | Desde | Hacia | Descripcion |
|---|---|---|---|
| `SEND` | idle/done | sending | Usuario envio mensaje |
| `CHUNK` | sending/streaming | streaming | Llego un fragmento de texto |
| `COMPLETE` | streaming | done | Stream termino |
| `ERROR` | cualquiera | error | Algo fallo |
| `RESET` | cualquiera | idle | Reiniciar chat |

## Messages — Array con useRef

### Por que useRef ademas de useState?

El problema de las stale closures:

```ts
// SIN ref — BUG: onChunk cierra sobre el messages viejo
const [messages, setMessages] = useState([]);

onChunk: (text) => {
  // `messages` siempre es [] porque el callback captura el valor inicial
  setMessages([...messages, newMsg]); // Pierde mensajes anteriores
}
```

```ts
// CON ref — CORRECTO: siempre lee el valor actual
const messagesRef = useRef([]);

onChunk: (text) => {
  const msgs = messagesRef.current; // Siempre actualizado
  // ...actualizar
}
```

### Flujo de sendMessage

```
1. Crear userMsg con createMessage("user", input)
2. Agregar al array de mensajes
3. dispatch SEND
4. Llamar streamChat con el historial completo

   En cada onChunk:
     ├── Primer chunk: crear assistantMsg con createMessage("assistant", text)
     └── Chunks siguientes: concatenar text al content del ultimo mensaje

   onComplete: dispatch COMPLETE
   onError: dispatch ERROR
```

### Creacion del mensaje assistant en el primer chunk

```ts
let assistantId: string | null = null;

onChunk: (text) => {
  if (!assistantId) {
    // Primer chunk: crear el mensaje assistant
    const assistantMsg = createMessage("assistant", text);
    assistantId = assistantMsg.id;
    // Agregar al array
  } else {
    // Chunks siguientes: concatenar al ultimo mensaje
    const last = msgs[msgs.length - 1];
    // { ...last, content: last.content + text }
  }
}
```

**Por que no crear el mensaje assistant antes de streamear?**

- Un mensaje vacio (`content: ""`) mostraria una burbuja vacia en la UI.
- El `ThinkingIndicator` depende de que el ultimo mensaje sea `role: "user"` para mostrarse:

```tsx
// En chat-layout.tsx
{isLoading && messages[messages.length - 1]?.role === "user" && <ThinkingIndicator />}
```

Si agregaramos un assistant vacio antes, el ThinkingIndicator no apareceria.

## createMessage — Factory de entidad

```ts
// entities/message/helpers.ts
function createMessage(role: MessageRole, content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
}
```

- Vive en `entities` porque es logica pura de dominio (factory).
- Genera ID unico con `crypto.randomUUID()`.
- No depende de ninguna otra capa.

## System Prompt

```ts
// shared/config/system-prompt.ts
export const SYSTEM_PROMPT = `Sos un asistente educativo...`;
```

Reglas principales:
- Espanol rioplatense, trato con "vos"
- Respuestas cortas (max ~150 palabras)
- No da respuestas directas, invita a pensar
- No es terapeuta ni tutor formal
- Tono amigable, no condescendiente

## Como se conecta con la UI

```
ChatLayout (widget)
  └── useChat() → { state, messages, sendMessage, reset }
        │
        ├── state.status → controla ThinkingIndicator, error msg, isLoading
        ├── messages → se renderizan como <ChatMessage />
        ├── sendMessage(input) → se llama desde handleSend / handleSelectPrompt
        └── reset() → disponible para limpiar conversacion
```

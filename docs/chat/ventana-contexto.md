# Ventana de Contexto (Sliding Window)

## Que es

Un mecanismo que limita la cantidad de mensajes enviados a OpenAI en cada request, manteniendo solo los mas recientes. El usuario sigue viendo **todo** el historial en pantalla — solo se trunca lo que se envia al modelo.

## Por que

| Beneficio | Explicacion |
|---|---|
| **Costo** | Menos tokens de input = menos gasto en OpenAI |
| **Prompt caching** | El system prompt fijo (~900 tokens) ocupa la mayor parte del prefijo. Con menos mensajes variables, el cache hit rate sube |
| **Latencia** | Menos tokens de input = respuesta mas rapida |

## Limites configurados

```ts
// shared/config/constants.ts
export const MAX_CONTEXT_MESSAGES = 8;   // maximo 8 mensajes
export const MAX_CONTEXT_TOKENS = 1500;  // maximo 1500 tokens de contenido
```

Se aplica **lo que ocurra primero**: si hay 8 mensajes pero suman mas de 1500 tokens, se descartan los mas viejos hasta que quepan.

## Algoritmo

```
truncateHistory(messages) →
  1. Tomar los ultimos MAX_CONTEXT_MESSAGES mensajes
  2. Contar tokens del contenido de todos (via gpt-tokenizer)
  3. Si excede MAX_CONTEXT_TOKENS, sacar el mas viejo
  4. Repetir hasta que quepa
  5. Siempre conservar al menos el ultimo mensaje
```

## Arquitectura

```
use-chat.ts
  └── sendMessage()
        ├── messagesRef.current  ← historial COMPLETO (para UI)
        └── streamChat({ messages: truncateHistory(updatedMessages) })
                                   ↑
                            solo ultimos N mensajes / T tokens
```

## Archivos principales

| Archivo | Rol |
|---|---|
| `features/chat/model/truncate-history.ts` | Funcion pura que aplica el truncamiento |
| `features/chat/model/use-chat.ts` | Invoca `truncateHistory` antes de llamar a `streamChat` |
| `shared/config/constants.ts` | Define `MAX_CONTEXT_MESSAGES` y `MAX_CONTEXT_TOKENS` |

## Dependencia externa

- [`gpt-tokenizer`](https://github.com/niieani/gpt-tokenizer) — tokenizador puro JS, sin dependencias nativas
- Import especifico por modelo para tree-shaking: `gpt-tokenizer/model/gpt-4o-mini`
- Encoding: `o200k_base` (el que usa GPT-4o mini)

## Validacion FSD

```
features/chat/model/truncate-history.ts
  → gpt-tokenizer (npm externo)           ✅
  → @/entities/message (capa inferior)    ✅
  → @/shared/config (capa inferior)       ✅
```

# Estado de la Sesion — useSession Hook

## Ubicacion

- Hook: `src/features/session/model/use-session.ts`
- Reducer: `src/features/session/model/session-reducer.ts`
- Storage: `src/features/session/model/session-storage.ts`
- Mapper: `src/features/session/model/session-mapper.ts`
- API: `src/features/session/api/session-api.ts`
- Tipos: `src/entities/session/types.ts`

## Arquitectura de estado

| Mecanismo | Para que | Por que |
|---|---|---|
| `useReducer` (SessionState) | Status del lifecycle (idle, loading, active, expired) | Maquina de estados predecible |
| localStorage (`guido-session`) | Persistir ID + timestamp entre recargas | Saber si hay sesion para resumir |
| Supabase (tabla `sessions`) | Persistencia de largo plazo + metricas | Fuente de verdad del servidor |

## SessionState — Maquina de estados

```ts
type SessionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "active"; session: Session }
  | { status: "expired" };
```

### Transiciones

```
idle ──LOAD──► loading ──RESOLVED──► active ──EXPIRED──► expired
  ▲                                    │                    │
  └──────────────RESET─────────────────┴────────────────────┘
```

### Acciones del reducer

| Accion | Desde | Hacia | Descripcion |
|---|---|---|---|
| `LOAD` | idle | loading | Iniciando busqueda de sesion |
| `RESOLVED` | loading | active | Sesion encontrada o creada |
| `TRACK_MESSAGE` | active | active | Incrementa messageCount y lastActiveAt |
| `EXPIRED` | active | expired | Sesion vencida (timeout 12h) |
| `RESET` | cualquiera | idle | Code-gate se bloqueo, limpiar estado |

## localStorage — `guido-session`

```ts
interface StoredSession {
  id: string;          // UUID de la sesion en Supabase
  lastActiveAt: number; // Date.now() del ultimo mensaje
}
```

### Helpers

| Funcion | Que hace |
|---|---|
| `readStoredSession()` | Lee y parsea `guido-session` de localStorage |
| `storeSession(id)` | Guarda ID + timestamp actual |
| `touchStoredSession()` | Actualiza solo el timestamp (sin cambiar ID) |
| `clearStoredSession()` | Borra `guido-session` |
| `isStoredSessionExpired(stored)` | `Date.now() - lastActiveAt > 12h` |

### Por que localStorage y no solo Supabase?

- Sin localStorage, cerrar el tab y volver crearia una sesion nueva cada vez (no sabe cual era la anterior)
- `findActiveSession(code)` busca por codigo, pero si el usuario "salio" (limpio localStorage), debe crear sesion nueva — no resumir la vieja
- localStorage es la intencion del usuario: "sigo en esta sesion" vs "empece de nuevo"

## Lifecycle completo

```
1. Usuario ingresa codigo → code-gate unlocked → useSession(code) se activa

2. Init (una sola vez):
   ├── Leer localStorage (guido-session)
   ├── Si hay sesion guardada Y no expiro:
   │     └── getSessionById(stored.id) → RESOLVED
   └── Si no hay o expiro:
         └── createSession(code, device) → RESOLVED + storeSession(id)

3. Usuario envia mensaje:
   ├── trackMessage() verifica expiracion antes de enviar
   ├── Si expiro → dispatch EXPIRED → (widget maneja el redirect)
   └── Si valido → dispatch TRACK_MESSAGE + touchStoredSession() + touchSession()

4. Usuario cambia de tab y vuelve:
   ├── visibilitychange listener verifica localStorage
   └── Si expiro → clearStoredSession() + dispatch EXPIRED

5. Sesion expira (isExpired = true):
   ├── Widget guarda borrador del input en localStorage (guido-draft)
   ├── Widget llama lock() → muestra code-gate
   ├── Widget muestra toast: "Tu sesion expiro. Podes volver a comenzar."
   └── dispatch RESET cuando code cambia a null

6. Usuario re-ingresa codigo:
   ├── code-gate unlocked → useSession(code) con nuevo code
   ├── initRef se reseteo en RESET → nuevo init
   └── Borrador se restaura automaticamente en el input
```

## Deteccion de expiracion — 3 capas

| Capa | Cuando | Como |
|---|---|---|
| **Init** | Al cargar la pagina | `isStoredSessionExpired()` antes de resumir |
| **visibilitychange** | Al volver al tab | Listener en `document.visibilitychange` |
| **Check-before-send** | Al enviar mensaje | `trackMessage()` verifica antes de ejecutar |

Las tres capas cubren todos los escenarios:
- Init: usuario vuelve despues de horas (tab cerrado)
- Visibility: usuario deja el tab abierto y vuelve despues
- Check-before-send: usuario nunca sale del tab pero pasan 12h

## Toast de expiracion

**Libreria**: [Sonner](https://sonner.emilkowal.dev/) (estandar de shadcn/ui).

```
app/layout.tsx          → <Toaster position="top-center" />   (provider)
widgets/chat/chat-layout.tsx → toast("Tu sesion expiro...")     (llamada)
```

### Cumplimiento FSD

- `Toaster` (provider) en `app/layout.tsx` — los providers van en la capa app ✅
- `toast()` en `widgets/` — feedback de UI, no logica de negocio ✅
- `sonner` es paquete npm externo (como React) — no forma parte de la jerarquia FSD ✅

### Draft save/restore

Cuando la sesion expira, el widget guarda el texto que el usuario estaba escribiendo:

```ts
// En el effect de expiracion (chat-layout.tsx):
if (v.trim()) localStorage.setItem("guido-draft", v);
lock();
toast("Tu sesion expiro. Podes volver a comenzar.");

// En el mount (chat-layout.tsx):
const draft = localStorage.getItem("guido-draft");
if (draft) { setInput(draft); localStorage.removeItem("guido-draft"); }
```

El usuario no pierde su texto — al re-ingresar el codigo, el input aparece pre-llenado.

## Como se conecta con la UI

```
ChatLayout (widget)
  └── useSession(code) → { session, isExpired, trackMessage }
        │
        ├── session → null hasta que se resuelva, Session cuando activa
        ├── isExpired → true cuando timeout, dispara efecto en widget
        ├── trackMessage() → se llama en handleSend y handleSelectPrompt
        │
        └── Widget coordina:
              ├── isExpired → lock() + toast() + draft save
              ├── session change → reset() chat + setHasStarted(false)
              └── trackMessage → despues de cada sendMessage
```

## Archivos relacionados

| Archivo | Rol |
|---|---|
| `features/session/model/use-session.ts` | Hook principal (lifecycle, visibilitychange, trackMessage) |
| `features/session/model/session-reducer.ts` | Reducer con discriminated unions |
| `features/session/model/session-storage.ts` | Helpers de localStorage |
| `features/session/model/session-mapper.ts` | `toSession()` — SessionRow → Session |
| `features/session/api/session-api.ts` | CRUD Supabase (find, get, create, touch, updateTokens) |
| `widgets/chat/chat-layout.tsx` | Coordinacion: wires useSession, lock, toast, draft |
| `app/api/chat/route.ts` | Token tracking server-side |

## Ver tambien

- [Tabla sessions](../database/tabla-sessions.md) — schema, RLS, conteo de tokens, tipos TypeScript

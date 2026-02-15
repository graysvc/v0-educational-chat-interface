# Tabla `codes`

## Que es

Tabla en Supabase que almacena los codigos de acceso impresos en cada ejemplar del libro. Cada codigo desbloquea el uso del chat con la IA.

## Schema

```sql
CREATE TABLE codes (
  code             TEXT PRIMARY KEY,
  monthly_usage    INTEGER NOT NULL DEFAULT 0,
  last_reset_month TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  claimed_by       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Columna | Tipo | Uso actual | Uso futuro |
|---|---|---|---|
| `code` | `TEXT PK` | Validacion de acceso | — |
| `monthly_usage` | `INTEGER` | No se usa | Rate limiting (300 msg/mes) |
| `last_reset_month` | `TEXT` | No se usa | Reset mensual del contador |
| `claimed_by` | `TEXT` | No se usa | Restriccion 1 usuario por codigo (con sessions) |
| `created_at` | `TIMESTAMPTZ` | No se usa | Auditoria |

## RLS (Row Level Security)

```sql
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_codes" ON codes
  FOR SELECT TO anon USING (true);
```

- Solo **SELECT** para el rol `anon` — los codigos son de solo lectura desde el cliente.
- Los codigos estan impresos en un libro fisico, no son secretos. La policy permite verificar existencia, no escribir ni borrar.

## Validacion: doble capa

La validacion del codigo ocurre en dos puntos:

### 1. Cliente (UX)

```
CodeGate modal → useCodeGate → validateCode() → Supabase
```

- **Archivo**: `features/code-gate/api/validate-code.ts`
- **Proposito**: feedback inmediato al usuario sin esperar al primer mensaje
- El codigo validado se guarda en `localStorage` (`guido-code`)

### 2. Servidor (seguridad)

```
/api/chat → Supabase → (si valido) → OpenAI
```

- **Archivo**: `app/api/chat/route.ts`
- **Proposito**: impedir llamadas directas al API sin codigo valido
- `401` si no se envia codigo, `403` si el codigo no existe en la tabla

### Por que doble validacion

- **Cliente solo** seria inseguro: alguien podria llamar `/api/chat` con curl
- **Servidor solo** daria mala UX: el usuario no sabria si su codigo es valido hasta enviar el primer mensaje
- **localStorage** es conveniencia de UX — si un codigo se revoca en la DB, el server lo bloquea al intentar chatear

## Archivos relacionados

| Archivo | Rol |
|---|---|
| `features/code-gate/api/validate-code.ts` | Query a Supabase desde el cliente |
| `features/code-gate/model/use-code-gate.ts` | Hook que orquesta la validacion del cliente |
| `app/api/chat/route.ts` | Validacion server-side antes de proxear a OpenAI |
| `entities/code/types.ts` | `CODE_LENGTH = 6`, regex, tipos |

## Formato de los codigos

- 6 caracteres alfanumericos (ej: `AB232A`)
- Se normalizan a uppercase antes de validar
- Regex: `/^[A-Za-z0-9]{6}$/`

## Seed actual

Solo `AB232A` en la tabla. La generacion masiva de ~10,000 codigos es un paso separado.

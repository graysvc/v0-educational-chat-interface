# Conexion a Supabase

## Que es

Cliente singleton de Supabase configurado en la capa `shared/api` de FSD. Permite que cualquier feature del proyecto acceda a Supabase.

## Archivos

| Archivo | Rol |
|---|---|
| `src/shared/api/supabase.ts` | Crea y exporta el cliente singleton |
| `src/shared/api/index.ts` | Re-exporta `supabase` como parte del barrel |
| `.env.local` | Variables de entorno con URL y key |

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=https://leffbokorvknmobfrgia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Ambas llevan prefijo `NEXT_PUBLIC_` porque el cliente Supabase corre en el **browser**. Esto es seguro por diseno — la publishable key (antes "anon key") es publica, igual que las config keys de Firebase. Las politicas RLS en cada tabla controlan el acceso (ver [Tabla codes](tabla-codes.md)).

| Variable | Visible en browser | Segura? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Si | Si — es una URL publica |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Si | Si — es una key publica por diseno |
| `OPENAI_API_KEY` | **No** | Si — solo vive en el server |

En produccion (Netlify): se configuran en **Dashboard > Environment variables**.

## Implementacion

```ts
// src/shared/api/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

- **Singleton**: una sola instancia, se reutiliza en todo el proyecto.
- **Capa shared**: cualquier capa superior (entities, features, widgets, app) puede importarlo.
- **Dependencia**: `@supabase/supabase-js` v2.49.4.

## Uso

```ts
import { supabase } from "@/shared/api";
```

## Validacion FSD

```
src/shared/api/supabase.ts → @supabase/supabase-js (externo)  ✅
shared no importa de ninguna otra capa                         ✅
```

# Tablas de metricas y encuestas

## Que son

Cuatro tablas en Supabase preparadas para almacenar metricas de uso y respuestas de encuestas. Todas tienen FK a `sessions(id)` — cada registro de metrica pertenece a una sesion.

**Estado actual**: las tablas estan creadas con sus RLS, pero todavia no estan conectadas al codigo. Los hooks en `features/metrics/` y `features/survey/` son stubs.

## Modelo de datos

```
sessions (1) ──► (N) metrics_behavioral   (una fila por sesion, al cerrar)
sessions (1) ──► (N) metrics_cognitive     (una fila por sesion, al cerrar)
sessions (1) ──► (N) metrics_semantic      (una fila por mensaje clasificado)
sessions (1) ──► (N) survey_responses      (una fila por encuesta contestada)
```

---

## `metrics_behavioral` — Capa 1: Que hacen

Metricas de comportamiento observables (duracion, rebote, ritmo).

```sql
CREATE TABLE metrics_behavioral (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            UUID NOT NULL REFERENCES sessions(id),
  duration_seconds      INTEGER NOT NULL DEFAULT 0,
  bounce                BOOLEAN NOT NULL DEFAULT true,
  time_between_msgs_avg INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE metrics_behavioral ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_metrics_behavioral" ON metrics_behavioral
  FOR INSERT TO anon WITH CHECK (true);
```

| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | `UUID PK` | Identificador unico |
| `session_id` | `UUID FK → sessions` | Sesion a la que pertenece |
| `duration_seconds` | `INTEGER` | Duracion total de la sesion en segundos |
| `bounce` | `BOOLEAN` | `true` si el usuario no envio ningun mensaje |
| `time_between_msgs_avg` | `INTEGER` | Promedio de segundos entre mensajes consecutivos |
| `created_at` | `TIMESTAMPTZ` | Cuando se genero el registro |

**RLS**: solo INSERT (write-only). Las metricas se escriben y no se leen desde el cliente.

---

## `metrics_cognitive` — Capa 2: Como interactuan

Metricas de interaccion cognitiva, detectadas por pattern matching sobre los mensajes del usuario.

```sql
CREATE TABLE metrics_cognitive (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            UUID NOT NULL REFERENCES sessions(id),
  reformulations        INTEGER NOT NULL DEFAULT 0,
  simpler_requests      INTEGER NOT NULL DEFAULT 0,
  not_understood        INTEGER NOT NULL DEFAULT 0,
  abandoned_after_error BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE metrics_cognitive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_metrics_cognitive" ON metrics_cognitive
  FOR INSERT TO anon WITH CHECK (true);
```

| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | `UUID PK` | Identificador unico |
| `session_id` | `UUID FK → sessions` | Sesion a la que pertenece |
| `reformulations` | `INTEGER` | Veces que el usuario reformulo una pregunta |
| `simpler_requests` | `INTEGER` | Veces que pidio "explicame mas simple" o similar |
| `not_understood` | `INTEGER` | Veces que dijo "no entiendo" o similar |
| `abandoned_after_error` | `BOOLEAN` | Si el usuario abandono despues de un error |
| `created_at` | `TIMESTAMPTZ` | Cuando se genero el registro |

**RLS**: solo INSERT.

---

## `metrics_semantic` — Capa 3: Que preguntan

Clasificacion semantica de cada mensaje del usuario, generada por el LLM. Una fila por mensaje clasificado (no por sesion).

```sql
CREATE TABLE metrics_semantic (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id),
  category        TEXT,
  intention       TEXT,
  cognitive_level TEXT,
  structure       TEXT,
  emotion         TEXT,
  ai_relationship TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE metrics_semantic ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_metrics_semantic" ON metrics_semantic
  FOR INSERT TO anon WITH CHECK (true);
```

| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | `UUID PK` | Identificador unico |
| `session_id` | `UUID FK → sessions` | Sesion a la que pertenece |
| `category` | `TEXT` | Categoria tematica (ej: "matematica", "historia") |
| `intention` | `TEXT` | Intencion del usuario (ej: "pedir explicacion", "verificar") |
| `cognitive_level` | `TEXT` | Nivel cognitivo segun Bloom (ej: "comprension", "analisis") |
| `structure` | `TEXT` | Estructura de la pregunta (ej: "abierta", "si/no") |
| `emotion` | `TEXT` | Tono emocional detectado (ej: "neutral", "frustrado") |
| `ai_relationship` | `TEXT` | Relacion con la IA (ej: "instrumental", "conversacional") |
| `created_at` | `TIMESTAMPTZ` | Cuando se genero el registro |

**RLS**: solo INSERT. Los tags se generan en tiempo real con el LLM y se guardan, pero el texto original del mensaje **nunca se almacena** (restriccion de privacidad, ver ARCHITECTURE.md).

---

## `survey_responses` — Micro-encuestas

Respuestas a la encuesta opcional post-sesion.

```sql
CREATE TABLE survey_responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES sessions(id),
  utility     TEXT NOT NULL,
  feeling     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_survey_responses" ON survey_responses
  FOR INSERT TO anon WITH CHECK (true);
```

| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | `UUID PK` | Identificador unico |
| `session_id` | `UUID FK → sessions` | Sesion a la que pertenece |
| `utility` | `TEXT` | Respuesta a "te fue util?" — `"si"`, `"masomenos"`, `"no"` |
| `feeling` | `TEXT` | Respuesta a "como te sentis?" — `"tranquilo"`, `"bien"`, `"confundido"`, `"frustrado"` |
| `created_at` | `TIMESTAMPTZ` | Cuando se genero el registro |

**RLS**: solo INSERT.

---

## Patron comun de RLS

Las cuatro tablas comparten el mismo modelo de seguridad:

| Tabla | INSERT | SELECT | UPDATE | DELETE |
|---|---|---|---|---|
| `metrics_behavioral` | anon ✅ | — | — | — |
| `metrics_cognitive` | anon ✅ | — | — | — |
| `metrics_semantic` | anon ✅ | — | — | — |
| `survey_responses` | anon ✅ | — | — | — |

**Write-only**: el cliente puede insertar registros pero no leerlos, modificarlos ni borrarlos. Las lecturas se hacen desde el dashboard de Supabase o con la service key (no expuesta al browser).

Esto contrasta con `sessions`, que necesita SELECT y UPDATE para el resume y tracking.

## Constantes de tabla

Los nombres de las tablas estan centralizados en `shared/config/constants.ts`:

```ts
export const TABLES = {
  CODES: "codes",
  SESSIONS: "sessions",
  METRICS_BEHAVIORAL: "metrics_behavioral",
  METRICS_COGNITIVE: "metrics_cognitive",
  METRICS_SEMANTIC: "metrics_semantic",
  SURVEY_RESPONSES: "survey_responses",
} as const;
```

## Archivos relacionados

| Archivo | Rol | Estado |
|---|---|---|
| `features/metrics/model/` | Hooks para recopilar metricas | Stub |
| `features/metrics/api/` | Envio de metricas a Supabase | Stub |
| `features/survey/ui/` | UI de micro-encuestas | Stub |
| `features/survey/model/` | Logica de encuestas | Stub |
| `shared/config/constants.ts` | Nombres de tablas (`TABLES`) | Activo |

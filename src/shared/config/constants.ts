/** Application name */
export const APP_NAME = "Volver a Preguntar";

/** Application description */
export const APP_DESCRIPTION =
  "Una herramienta de inteligencia artificial para estudiantes que quieren aprender mejor.";

/** OpenAI model to use for chat completions */
export const OPENAI_MODEL = "gpt-4o-mini";

/** Maximum tokens per response */
export const MAX_TOKENS = 1024;

/** Supabase table names */
export const TABLES = {
  CODES: "codes",
  SESSIONS: "sessions",
  METRICS_BEHAVIORAL: "metrics_behavioral",
  METRICS_COGNITIVE: "metrics_cognitive",
  METRICS_SEMANTIC: "metrics_semantic",
  SURVEY_RESPONSES: "survey_responses",
} as const;

/** Session timeout in milliseconds (30 minutes) */
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

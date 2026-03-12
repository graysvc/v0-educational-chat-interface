export type SignalMetric =
  | "simplify"
  | "not_understood"
  | "negative_signal"
  | "success_signal"
  | "gratitude"
  | "error";

interface SignalPattern {
  metric: SignalMetric;
  regex: RegExp;
}

/** Map from CSV metric_name column to our SignalMetric type */
const METRIC_MAP: Record<string, SignalMetric> = {
  simplify_count: "simplify",
  not_understood_count: "not_understood",
  negative_signal_count: "negative_signal",
  success_signal_count: "success_signal",
  gratitude_count: "gratitude",
  error_count: "error",
};

/**
 * Pre-compiled regex patterns from Signal_Dictionary CSV.
 * Each pattern runs against normalized text (lowercase, no diacritics, no punctuation).
 */
export const SIGNAL_PATTERNS: SignalPattern[] = [
  // --- simplify (19) ---
  { metric: "simplify", regex: /\bmas\s+simple\b/ },
  { metric: "simplify", regex: /\bmas\s+facil\b/ },
  { metric: "simplify", regex: /\bsimple\b/ },
  { metric: "simplify", regex: /\bexplicalo\s+simple\b/ },
  { metric: "simplify", regex: /\bexplicamelo\s+simple\b/ },
  { metric: "simplify", regex: /\bmas\s+claro\b/ },
  { metric: "simplify", regex: /\bmas\s+corto\b/ },
  { metric: "simplify", regex: /\bresumilo\b/ },
  { metric: "simplify", regex: /\bresumelo\b/ },
  { metric: "simplify", regex: /\bresumimelo\b/ },
  { metric: "simplify", regex: /\ben\s+palabras\s+simples\b/ },
  { metric: "simplify", regex: /\ben\s+palabras\s+mas\s+simples\b/ },
  { metric: "simplify", regex: /\bde\s+forma\s+simple\b/ },
  { metric: "simplify", regex: /\bexplicalo\s+mejor\b/ },
  { metric: "simplify", regex: /\bexplicalo\s+mas\s+facil\b/ },
  { metric: "simplify", regex: /\bmas\s+sencillo\b/ },
  { metric: "simplify", regex: /\bdecimelo\s+simple\b/ },
  { metric: "simplify", regex: /\bhacelo\s+simple\b/ },
  { metric: "simplify", regex: /\bhazlo\s+simple\b/ },

  // --- not_understood (19) ---
  { metric: "not_understood", regex: /\bno\s+entendi\b/ },
  { metric: "not_understood", regex: /\bno\s+entiendo\b/ },
  { metric: "not_understood", regex: /\bno\s+lo\s+entendi\b/ },
  { metric: "not_understood", regex: /\bno\s+entendi\s+bien\b/ },
  { metric: "not_understood", regex: /\bno\s+me\s+quedo\s+claro\b/ },
  { metric: "not_understood", regex: /\bno\s+me\s+queda\s+claro\b/ },
  { metric: "not_understood", regex: /\bno\s+comprendo\b/ },
  { metric: "not_understood", regex: /\bno\s+lo\s+comprendo\b/ },
  { metric: "not_understood", regex: /\bno\s+se\s+que\s+quisiste\s+decir\b/ },
  { metric: "not_understood", regex: /\bno\s+se\s+entiende\b/ },
  { metric: "not_understood", regex: /\bno\s+entiendo\s+esto\b/ },
  { metric: "not_understood", regex: /\bno\s+entiendo\s+bien\b/ },
  { metric: "not_understood", regex: /\bno\s+lo\s+tengo\s+claro\b/ },
  { metric: "not_understood", regex: /\bsigo\s+sin\s+entender\b/ },
  { metric: "not_understood", regex: /\bno\s+me\s+quedo\s+del\s+todo\s+claro\b/ },
  { metric: "not_understood", regex: /\bno\s+termino\s+de\s+entender\b/ },
  { metric: "not_understood", regex: /\bno\s+me\s+cierra\b/ },
  { metric: "not_understood", regex: /\bno\s+me\s+ubico\b/ },
  { metric: "not_understood", regex: /\bme\s+perdi\b/ },

  // --- negative_signal: fear (10) ---
  { metric: "negative_signal", regex: /\bme\s+da\s+miedo\b/ },
  { metric: "negative_signal", regex: /\btengo\s+miedo\b/ },
  { metric: "negative_signal", regex: /\bme\s+asusta\b/ },
  { metric: "negative_signal", regex: /\besto\s+me\s+asusta\b/ },
  { metric: "negative_signal", regex: /\bme\s+da\s+cosa\b/ },
  { metric: "negative_signal", regex: /\bme\s+intimida\b/ },
  { metric: "negative_signal", regex: /\bme\s+pone\s+nervioso\b/ },
  { metric: "negative_signal", regex: /\bme\s+pone\s+nerviosa\b/ },
  { metric: "negative_signal", regex: /\bme\s+da\s+inseguridad\b/ },
  { metric: "negative_signal", regex: /\bme\s+genera\s+miedo\b/ },

  // --- negative_signal: frustration (20) ---
  { metric: "negative_signal", regex: /\bme\s+frustra\b/ },
  { metric: "negative_signal", regex: /\bque\s+frustrante\b/ },
  { metric: "negative_signal", regex: /\bno\s+puedo\b/ },
  { metric: "negative_signal", regex: /\bno\s+me\s+sale\b/ },
  { metric: "negative_signal", regex: /\bme\s+cuesta\b/ },
  { metric: "negative_signal", regex: /\bme\s+cuesta\s+mucho\b/ },
  { metric: "negative_signal", regex: /\bes\s+dificil\b/ },
  { metric: "negative_signal", regex: /\bque\s+dificil\b/ },
  { metric: "negative_signal", regex: /\bme\s+confunde\b/ },
  { metric: "negative_signal", regex: /\bestoy\s+perdido\b/ },
  { metric: "negative_signal", regex: /\bestoy\s+perdida\b/ },
  { metric: "negative_signal", regex: /\bestoy\s+trabado\b/ },
  { metric: "negative_signal", regex: /\bestoy\s+trabada\b/ },
  { metric: "negative_signal", regex: /\bme\s+enredo\b/ },
  { metric: "negative_signal", regex: /\bme\s+complica\b/ },
  { metric: "negative_signal", regex: /\bme\s+bloquea\b/ },
  { metric: "negative_signal", regex: /\bno\s+me\s+esta\s+saliendo\b/ },
  { metric: "negative_signal", regex: /\besto\s+me\s+supera\b/ },
  { metric: "negative_signal", regex: /\bme\s+siento\s+perdido\b/ },
  { metric: "negative_signal", regex: /\bme\s+siento\s+perdida\b/ },

  // --- negative_signal: concern (13) ---
  { metric: "negative_signal", regex: /\bme\s+preocupa\b/ },
  { metric: "negative_signal", regex: /\bestoy\s+preocupado\b/ },
  { metric: "negative_signal", regex: /\bestoy\s+preocupada\b/ },
  { metric: "negative_signal", regex: /\bno\s+quiero\s+equivocarme\b/ },
  { metric: "negative_signal", regex: /\btengo\s+dudas\b/ },
  { metric: "negative_signal", regex: /\bno\s+estoy\s+seguro\b/ },
  { metric: "negative_signal", regex: /\bno\s+estoy\s+segura\b/ },
  { metric: "negative_signal", regex: /\bme\s+da\s+inseguridad\b/ },
  { metric: "negative_signal", regex: /\bno\s+se\s+si\s+esta\s+bien\b/ },
  { metric: "negative_signal", regex: /\bme\s+genera\s+preocupacion\b/ },
  { metric: "negative_signal", regex: /\bme\s+hace\s+dudar\b/ },
  { metric: "negative_signal", regex: /\bno\s+se\s+como\s+seguir\b/ },
  { metric: "negative_signal", regex: /\btengo\s+preocupacion\b/ },

  // --- success_signal (12) ---
  { metric: "success_signal", regex: /\bahora\s+si\b/ },
  { metric: "success_signal", regex: /\bahora\s+entendi\b/ },
  { metric: "success_signal", regex: /\bahora\s+lo\s+entendi\b/ },
  { metric: "success_signal", regex: /\bahora\s+me\s+quedo\s+claro\b/ },
  { metric: "success_signal", regex: /\bya\s+entendi\b/ },
  { metric: "success_signal", regex: /\bperfecto\b/ },
  { metric: "success_signal", regex: /\bclarisimo\b/ },
  { metric: "success_signal", regex: /\bbuenisimo\b/ },
  { metric: "success_signal", regex: /\bentendido\b/ },
  { metric: "success_signal", regex: /\bgracias\s+ahora\s+si\b/ },
  { metric: "success_signal", regex: /\bahi\s+entendi\b/ },
  { metric: "success_signal", regex: /\bya\s+me\s+quedo\s+claro\b/ },

  // --- gratitude (8) ---
  { metric: "gratitude", regex: /\bgracias\b/ },
  { metric: "gratitude", regex: /\bmuchas\s+gracias\b/ },
  { metric: "gratitude", regex: /\bgenial\s+gracias\b/ },
  { metric: "gratitude", regex: /\bperfecto\s+gracias\b/ },
  { metric: "gratitude", regex: /\bmil\s+gracias\b/ },
  { metric: "gratitude", regex: /\bgracias\s+por\s+la\s+ayuda\b/ },
  { metric: "gratitude", regex: /\bte\s+agradezco\b/ },
  { metric: "gratitude", regex: /\bgracias\s+me\s+sirvio\b/ },

  // --- error (9) ---
  { metric: "error", regex: /\berror\b/ },
  { metric: "error", regex: /\bhubo\s+un\s+error\b/ },
  { metric: "error", regex: /\balgo\s+salio\s+mal\b/ },
  { metric: "error", regex: /\bintentalo\s+de\s+nuevo\b/ },
  { metric: "error", regex: /\bno\s+se\s+pudo\s+responder\b/ },
  { metric: "error", regex: /\bno\s+pudimos\s+procesar\s+tu\s+mensaje\b/ },
  { metric: "error", regex: /\bhubo\s+un\s+problema\b/ },
  { metric: "error", regex: /\bocurrio\s+un\s+error\b/ },
  { metric: "error", regex: /\bfallo\s+la\s+respuesta\b/ },
];

export { METRIC_MAP };

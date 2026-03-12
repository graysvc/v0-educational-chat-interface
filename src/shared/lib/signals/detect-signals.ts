import { normalize } from "./normalize";
import { SIGNAL_PATTERNS, type SignalMetric } from "./signal-dictionary";

export type SignalCounts = Record<SignalMetric, number>;

const EMPTY_COUNTS: SignalCounts = {
  simplify: 0,
  not_understood: 0,
  negative_signal: 0,
  success_signal: 0,
  gratitude: 0,
  error: 0,
};

/**
 * Detect signals in a user message.
 * Returns counts per metric (max 1 per metric per message).
 */
export function detectSignals(text: string): SignalCounts {
  const normalized = normalize(text);
  const matched = new Set<SignalMetric>();
  const counts: SignalCounts = { ...EMPTY_COUNTS };

  for (const { metric, regex } of SIGNAL_PATTERNS) {
    if (matched.has(metric)) continue; // max 1 per metric per message
    if (regex.test(normalized)) {
      counts[metric] = 1;
      matched.add(metric);
    }
  }

  return counts;
}

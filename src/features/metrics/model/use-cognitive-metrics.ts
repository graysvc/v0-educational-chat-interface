"use client";

import { useRef, useCallback } from "react";
import type { CognitiveMetrics } from "./types";

export function useCognitiveMetrics(sessionId: string) {
  const counters = useRef({
    reformulations: 0,
    simplerRequests: 0,
    notUnderstood: 0,
    abandonedAfterError: false,
  });

  /** Analyze a user message for cognitive patterns via pattern matching */
  const analyzeMessage = useCallback((text: string) => {
    const lower = text.toLowerCase();
    // TODO: Implement proper pattern matching for Spanish phrases
    if (lower.includes("otra vez") || lower.includes("de nuevo")) {
      counters.current.reformulations++;
    }
    if (lower.includes("más simple") || lower.includes("más fácil")) {
      counters.current.simplerRequests++;
    }
    if (lower.includes("no entiendo") || lower.includes("no entendí")) {
      counters.current.notUnderstood++;
    }
  }, []);

  const markAbandonedAfterError = useCallback(() => {
    counters.current.abandonedAfterError = true;
  }, []);

  const collect = useCallback((): CognitiveMetrics => {
    return { sessionId, ...counters.current };
  }, [sessionId]);

  return { analyzeMessage, markAbandonedAfterError, collect };
}

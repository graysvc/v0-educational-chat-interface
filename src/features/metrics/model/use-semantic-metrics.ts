"use client";

import { useRef, useCallback } from "react";
import type { SemanticMetrics } from "./types";

export function useSemanticMetrics(sessionId: string) {
  const tags = useRef<SemanticMetrics[]>([]);

  /** Add semantic tags for a message (classified by LLM in the API response) */
  const addTags = useCallback(
    (classification: Omit<SemanticMetrics, "sessionId">) => {
      tags.current.push({ sessionId, ...classification });
    },
    [sessionId]
  );

  const collect = useCallback((): SemanticMetrics[] => {
    return [...tags.current];
  }, []);

  return { addTags, collect };
}

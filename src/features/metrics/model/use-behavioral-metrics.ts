"use client";

import { useRef, useCallback } from "react";
import type { BehavioralMetrics } from "./types";

export function useBehavioralMetrics(sessionId: string) {
  const startTime = useRef(Date.now());
  const messageTimes = useRef<number[]>([]);

  const trackMessage = useCallback(() => {
    messageTimes.current.push(Date.now());
  }, []);

  const collect = useCallback((): BehavioralMetrics => {
    const times = messageTimes.current;
    const duration = Math.round((Date.now() - startTime.current) / 1000);
    const avgTimeBetween =
      times.length > 1
        ? times.slice(1).reduce((sum, t, i) => sum + (t - times[i]), 0) /
          (times.length - 1) /
          1000
        : 0;

    return {
      sessionId,
      durationSeconds: duration,
      bounce: times.length <= 1,
      timeBetweenMsgsAvg: Math.round(avgTimeBetween),
      messageCount: times.length,
      tokenCount: 0, // TODO: accumulate from stream
      device: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };
  }, [sessionId]);

  return { trackMessage, collect };
}

import type { SessionMetrics } from "../model/types";

/**
 * Sends collected session metrics to Supabase.
 * Called when a session ends (tab close, explicit end, or timeout).
 */
export async function sendMetrics(metrics: SessionMetrics): Promise<void> {
  // TODO: Initialize Supabase client
  // TODO: Insert behavioral metrics into metrics_behavioral
  // TODO: Insert cognitive metrics into metrics_cognitive
  // TODO: Insert semantic metrics (array) into metrics_semantic
  throw new Error("sendMetrics not implemented");
}

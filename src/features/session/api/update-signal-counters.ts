import { supabase } from "@/shared/api";
import type { SignalCounts } from "@/shared/lib/signals";

/** Atomically increment signal counters for a session via Supabase RPC */
export async function updateSignalCounters(
  sessionId: string,
  signals: SignalCounts,
): Promise<void> {
  await supabase.rpc("increment_signal_counters", {
    p_session_id: sessionId,
    p_msg_ai_count: 1,
    p_simplify: signals.simplify,
    p_not_understood: signals.not_understood,
    p_negative_signal: signals.negative_signal,
    p_success_signal: signals.success_signal,
    p_gratitude: signals.gratitude,
    p_error: signals.error,
  });
}

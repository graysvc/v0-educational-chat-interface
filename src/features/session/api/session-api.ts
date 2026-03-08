import { supabase } from "@/shared/api";
import { TABLES, SESSION_TIMEOUT_MS } from "@/shared/config";
import type { SessionRow } from "@/entities/session";

/** Find an active session (last_active_at within timeout window) */
export async function findActiveSession(
  code: string,
): Promise<SessionRow | null> {
  const cutoff = new Date(Date.now() - SESSION_TIMEOUT_MS).toISOString();
  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
    .select("*")
    .eq("code", code)
    .gt("last_active_at", cutoff)
    .is("ended_at", null)
    .order("last_active_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data as SessionRow | null;
}

/** Get a specific session by ID */
export async function getSessionById(
  id: string,
): Promise<SessionRow | null> {
  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return null;
  return data as SessionRow | null;
}

/** Create a new session */
export async function createSession(
  code: string,
  device: string,
  deviceId: string,
): Promise<SessionRow | null> {
  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
    .insert({ code, device, device_id: deviceId })
    .select()
    .single();

  if (error) return null;
  return data as SessionRow;
}

/** Increment message_count and update last_active_at */
export async function touchSession(
  sessionId: string,
  currentCount: number,
): Promise<void> {
  await supabase
    .from(TABLES.SESSIONS)
    .update({
      message_count: currentCount + 1,
      last_active_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
}

/** Atomically increment token counters for a session via Supabase RPC */
export async function updateSessionTokens(
  sessionId: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number },
): Promise<void> {
  await supabase.rpc("increment_session_tokens", {
    p_session_id: sessionId,
    p_prompt: usage.prompt_tokens,
    p_completion: usage.completion_tokens,
    p_total: usage.total_tokens,
  });
}

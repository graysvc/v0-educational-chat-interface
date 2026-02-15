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
): Promise<SessionRow | null> {
  const { data, error } = await supabase
    .from(TABLES.SESSIONS)
    .insert({ code, device })
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

/** Find active session by code and accumulate token usage */
export async function updateSessionTokens(
  code: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number },
): Promise<void> {
  const session = await findActiveSession(code);
  if (!session) return;
  await supabase
    .from(TABLES.SESSIONS)
    .update({
      prompt_tokens: session.prompt_tokens + usage.prompt_tokens,
      completion_tokens: session.completion_tokens + usage.completion_tokens,
      total_tokens: session.total_tokens + usage.total_tokens,
    })
    .eq("id", session.id);
}

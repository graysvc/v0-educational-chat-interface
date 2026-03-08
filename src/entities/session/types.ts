/** Row shape from Supabase (snake_case) */
export interface SessionRow {
  id: string;
  code: string;
  started_at: string;
  ended_at: string | null;
  last_active_at: string;
  device: string;
  device_id: string | null;
  message_count: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/** Client-side session (camelCase) */
export interface Session {
  id: string;
  code: string;
  startedAt: Date;
  endedAt: Date | null;
  lastActiveAt: Date;
  device: string;
  deviceId: string | null;
  messageCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** Session status for tracking lifecycle */
export type SessionStatus = "active" | "ended" | "expired";

import type { SessionRow, Session } from "@/entities/session";

export function toSession(row: SessionRow): Session {
  return {
    id: row.id,
    code: row.code,
    startedAt: new Date(row.started_at),
    endedAt: row.ended_at ? new Date(row.ended_at) : null,
    lastActiveAt: new Date(row.last_active_at),
    device: row.device,
    deviceId: row.device_id,
    messageCount: row.message_count,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    totalTokens: row.total_tokens,
  };
}

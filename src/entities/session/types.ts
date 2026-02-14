/** A session represents one conversation between a student and the AI */
export interface Session {
  id: string;
  code: string;
  startedAt: Date;
  endedAt: Date | null;
  device: string;
  messageCount: number;
  tokenCount: number;
}

/** Session status for tracking lifecycle */
export type SessionStatus = "active" | "ended" | "expired";

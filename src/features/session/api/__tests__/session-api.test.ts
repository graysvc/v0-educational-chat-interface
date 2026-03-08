import { describe, it, expect, vi, beforeEach } from "vitest";

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock("@/shared/api", () => ({
  supabase: { rpc: rpcMock },
}));

vi.mock("@/shared/config", () => ({
  TABLES: { SESSIONS: "sessions" },
  SESSION_TIMEOUT_MS: 40 * 60 * 1000,
}));

vi.mock("@/entities/session", () => ({}));

import { updateSessionTokens } from "../session-api";

describe("updateSessionTokens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls supabase.rpc with increment_session_tokens and correct params", async () => {
    const sessionId = "550e8400-e29b-41d4-a716-446655440000";
    const usage = { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 };

    await updateSessionTokens(sessionId, usage);

    expect(rpcMock).toHaveBeenCalledOnce();
    expect(rpcMock).toHaveBeenCalledWith("increment_session_tokens", {
      p_session_id: sessionId,
      p_prompt: 100,
      p_completion: 50,
      p_total: 150,
    });
  });

  it("accepts a session ID (UUID), not a code string", async () => {
    const sessionId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    const usage = { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 };

    await updateSessionTokens(sessionId, usage);

    const callArgs = rpcMock.mock.calls[0][1];
    expect(callArgs.p_session_id).toBe(sessionId);
  });

  it("does not call findActiveSession (no SELECT query by code)", async () => {
    const sessionId = "550e8400-e29b-41d4-a716-446655440000";
    const usage = { prompt_tokens: 50, completion_tokens: 25, total_tokens: 75 };

    await updateSessionTokens(sessionId, usage);

    // rpc should be the only supabase call
    expect(rpcMock).toHaveBeenCalledOnce();
  });
});

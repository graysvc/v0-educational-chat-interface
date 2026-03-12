import { describe, it, expect, vi, beforeEach } from "vitest";

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn().mockResolvedValue({ data: null, error: null }),
}));

vi.mock("@/shared/api", () => ({
  supabase: { rpc: rpcMock },
}));

import { updateSignalCounters } from "../update-signal-counters";
import type { SignalCounts } from "@/shared/lib/signals";

describe("updateSignalCounters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls supabase.rpc with correct params", async () => {
    const signals: SignalCounts = {
      simplify: 1,
      not_understood: 0,
      negative_signal: 0,
      success_signal: 1,
      gratitude: 1,
      error: 0,
    };

    await updateSignalCounters("session-123", signals);

    expect(rpcMock).toHaveBeenCalledWith("increment_signal_counters", {
      p_session_id: "session-123",
      p_msg_ai_count: 1,
      p_simplify: 1,
      p_not_understood: 0,
      p_negative_signal: 0,
      p_success_signal: 1,
      p_gratitude: 1,
      p_error: 0,
    });
  });

  it("calls rpc with all zeros when no signals detected", async () => {
    const signals: SignalCounts = {
      simplify: 0,
      not_understood: 0,
      negative_signal: 0,
      success_signal: 0,
      gratitude: 0,
      error: 0,
    };

    await updateSignalCounters("session-456", signals);

    expect(rpcMock).toHaveBeenCalledWith("increment_signal_counters", {
      p_session_id: "session-456",
      p_msg_ai_count: 1,
      p_simplify: 0,
      p_not_understood: 0,
      p_negative_signal: 0,
      p_success_signal: 0,
      p_gratitude: 0,
      p_error: 0,
    });
  });
});

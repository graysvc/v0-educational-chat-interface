import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/shared/config", () => ({
  SESSION_TIMEOUT_MS: 40 * 60 * 1000,
}));

// In-memory localStorage mock
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
};
vi.stubGlobal("localStorage", localStorageMock);

// Mock crypto.randomUUID
const FAKE_UUID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
vi.stubGlobal("crypto", { randomUUID: vi.fn(() => FAKE_UUID) });

import { getOrCreateDeviceId } from "../session-storage";

describe("getOrCreateDeviceId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(store).forEach((k) => delete store[k]);
  });

  it("generates a new UUID and stores it when none exists", () => {
    const id = getOrCreateDeviceId();

    expect(id).toBe(FAKE_UUID);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("guido-device", FAKE_UUID);
  });

  it("returns existing device ID without generating a new one", () => {
    store["guido-device"] = "existing-id-123";

    const id = getOrCreateDeviceId();

    expect(id).toBe("existing-id-123");
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("returns a string (UUID format)", () => {
    const id = getOrCreateDeviceId();

    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });
});

import { SESSION_TIMEOUT_MS } from "@/shared/config";

const SESSION_KEY = "guido-session";

interface StoredSession {
  id: string;
  lastActiveAt: number;
}

export function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeSession(id: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id, lastActiveAt: Date.now() }));
}

export function touchStoredSession(): void {
  const stored = readStoredSession();
  if (stored) storeSession(stored.id);
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isStoredSessionExpired(stored: StoredSession): boolean {
  return Date.now() - stored.lastActiveAt > SESSION_TIMEOUT_MS;
}

"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import { createSession, touchSession, getSessionById } from "../api";
import { toSession } from "./session-mapper";
import { sessionReducer, initialSessionState } from "./session-reducer";
import { readStoredSession, storeSession, touchStoredSession, clearStoredSession, isStoredSessionExpired, getOrCreateDeviceId } from "./session-storage";

export function useSession(code: string | null) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  const initRef = useRef(false);

  useEffect(() => {
    if (!code) { initRef.current = false; dispatch({ type: "RESET" }); return; }
    if (initRef.current) return;
    initRef.current = true;
    dispatch({ type: "LOAD" });
    const device = typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop";
    const deviceId = getOrCreateDeviceId();
    (async () => {
      const stored = readStoredSession();
      let row = stored && !isStoredSessionExpired(stored) ? await getSessionById(stored.id) : null;
      if (!row) { clearStoredSession(); row = await createSession(code, device, deviceId); }
      if (row) { storeSession(row.id); dispatch({ type: "RESOLVED", session: toSession(row) }); }
    })();
  }, [code]);

  useEffect(() => {
    if (!code) return;
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const stored = readStoredSession();
      if (!stored || isStoredSessionExpired(stored)) { clearStoredSession(); dispatch({ type: "EXPIRED" }); }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [code]);

  const trackMessage = useCallback(() => {
    if (state.status !== "active") return;
    const stored = readStoredSession();
    if (!stored || isStoredSessionExpired(stored)) { clearStoredSession(); dispatch({ type: "EXPIRED" }); return; }
    dispatch({ type: "TRACK_MESSAGE" });
    touchStoredSession();
    touchSession(state.session.id, state.session.messageCount);
  }, [state]);

  const session = state.status === "active" ? state.session : null;
  const isExpired = state.status === "expired";
  return { session, isExpired, trackMessage };
}

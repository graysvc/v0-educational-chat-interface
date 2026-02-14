"use client";

import { useReducer, useCallback, useEffect } from "react";
import { codeGateReducer, initialCodeGateState } from "./code-gate-reducer";

const STORAGE_KEY = "guido-code";
// TODO: Replace with server-side validation against Supabase
const TEMP_VALID_CODE = "AB232A";

export function useCodeGate() {
  const [state, dispatch] = useReducer(codeGateReducer, initialCodeGateState);

  useEffect(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    if (savedCode) {
      dispatch({ type: "VALID", code: savedCode });
    }
  }, []);

  const submitCode = useCallback(async (code: string) => {
    dispatch({ type: "SUBMIT", code });
    // TODO: Validate code against Supabase
    if (code.toUpperCase() === TEMP_VALID_CODE) {
      localStorage.setItem(STORAGE_KEY, code);
      dispatch({ type: "VALID", code });
    } else {
      dispatch({ type: "INVALID", error: "Código incorrecto. Revisá e intentá de nuevo." });
    }
  }, []);

  const lock = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "LOCK" });
  }, []);

  return { state, submitCode, lock };
}

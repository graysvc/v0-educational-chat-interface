"use client";

import { useReducer, useCallback, useEffect } from "react";
import { codeGateReducer, initialCodeGateState } from "./code-gate-reducer";
import { validateCode } from "../api";

const STORAGE_KEY = "guido-code";

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

    const result = await validateCode(code);
    if (result.valid) {
      const normalized = code.toUpperCase().trim();
      localStorage.setItem(STORAGE_KEY, normalized);
      dispatch({ type: "VALID", code: normalized });
    } else {
      dispatch({ type: "INVALID", error: result.error! });
    }
  }, []);

  const lock = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "LOCK" });
  }, []);

  return { state, submitCode, lock };
}

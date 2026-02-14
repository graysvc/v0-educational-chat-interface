"use client";

import { useReducer, useCallback, useState } from "react";
import type { Message } from "@/entities/message";
import { chatReducer, initialChatState } from "./chat-reducer";

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [messages] = useState<Message[]>([]);

  const sendMessage = useCallback(async (input: string) => {
    dispatch({ type: "SEND", input });
    // TODO: Call streaming API via features/chat/api/stream
    // TODO: Dispatch CHUNK actions as data arrives
    // TODO: Dispatch COMPLETE when stream ends
    // TODO: Dispatch ERROR on failure
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return { state, messages, sendMessage, reset };
}

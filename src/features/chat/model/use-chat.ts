"use client";

import { useReducer, useCallback, useState, useRef } from "react";
import type { Message } from "@/entities/message";
import { createMessage } from "@/entities/message";
import { streamChat } from "../api/stream";
import { chatReducer, initialChatState } from "./chat-reducer";
import { truncateHistory } from "./truncate-history";

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg = createMessage("user", input);
    const updatedMessages = [...messagesRef.current, userMsg];
    messagesRef.current = updatedMessages;
    setMessages(updatedMessages);
    dispatch({ type: "SEND", input });

    const code = typeof window !== "undefined"
      ? localStorage.getItem("guido-code") ?? ""
      : "";

    let assistantId: string | null = null;

    await streamChat({
      messages: truncateHistory(updatedMessages),
      code,
      onChunk: (text) => {
        dispatch({ type: "CHUNK", text });
        const msgs = messagesRef.current;

        if (!assistantId) {
          const assistantMsg = createMessage("assistant", text);
          assistantId = assistantMsg.id;
          const updated = [...msgs, assistantMsg];
          messagesRef.current = updated;
          setMessages(updated);
        } else {
          const last = msgs[msgs.length - 1];
          const updated = [...msgs.slice(0, -1), { ...last, content: last.content + text }];
          messagesRef.current = updated;
          setMessages(updated);
        }
      },
      onComplete: () => {
        dispatch({ type: "COMPLETE" });
      },
      onError: (error) => {
        dispatch({ type: "ERROR", error });
      },
    });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    messagesRef.current = [];
    setMessages([]);
  }, []);

  return { state, messages, sendMessage, reset };
}

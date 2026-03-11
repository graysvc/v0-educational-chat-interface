"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useCodeGate, CodeGate } from "@/features/code-gate";
import { ChatInput, Welcome, useChat, truncateHistory } from "@/features/chat";
import { useSession } from "@/features/session";
import { classifySession } from "@/features/metrics";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";

const WELCOME_KEY = "modoPractica_hasSeenWelcome";
const DRAFT_KEY = "guido-draft";

export function ChatLayout() {
  const { state: gateState, submitCode, lock } = useCodeGate();
  const { state: chatState, messages, sendMessage, reset } = useChat();
  const code = gateState.status === "unlocked" ? gateState.code : null;
  const { session, isExpired, trackMessage } = useSession(code);
  const prevSessionIdRef = useRef<string | null>(null);
  const lastSessionIdRef = useRef<string | null>(null);
  const inputValueRef = useRef("");
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = chatState.status === "sending" || chatState.status === "streaming";
  inputValueRef.current = input;

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(WELCOME_KEY) === "true") setIsReturning(true);
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) { setInput(draft); localStorage.removeItem(DRAFT_KEY); }
    } catch {}
  }, []);

  useEffect(() => {
    if (!session) return;
    if (prevSessionIdRef.current && prevSessionIdRef.current !== session.id) { reset(); setHasStarted(false); }
    prevSessionIdRef.current = session.id;
    lastSessionIdRef.current = session.id;
  }, [session, reset]);

  useEffect(() => {
    if (!isExpired) return;
    if (messages.length > 0 && lastSessionIdRef.current) {
      classifySession(truncateHistory(messages), lastSessionIdRef.current);
    }
    const v = inputValueRef.current;
    if (v.trim()) try { localStorage.setItem(DRAFT_KEY, v); } catch {}
    lock();
    toast("Tu sesión expiró. Podés volver a comenzar.");
  }, [isExpired, lock, messages]);

  const markAsSeen = useCallback(() => {
    try { localStorage.setItem(WELCOME_KEY, "true"); } catch {}
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading || !session) return;
    if (!hasStarted) { setHasStarted(true); markAsSeen(); }
    sendMessage(input, session.id);
    trackMessage();
    setInput("");
    inputRef.current?.focus();
  }, [input, isLoading, hasStarted, sendMessage, markAsSeen, trackMessage, session]);

  const handleSelectPrompt = useCallback((prompt: string) => {
    if (!session) return;
    setHasStarted(true); markAsSeen(); sendMessage(prompt, session.id); trackMessage();
  }, [sendMessage, markAsSeen, trackMessage, session]);

  const handlePrefill = useCallback((text: string) => {
    setInput(text);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(text.length, text.length);
    });
  }, []);

  if (!mounted) return <div className="flex h-dvh flex-col" />;

  if (gateState.status !== "unlocked") {
    const err = gateState.status === "error" ? gateState.error : undefined;
    return <CodeGate onSubmit={submitCode} error={err} isValidating={gateState.status === "validating"} />;
  }

  return (
    <div className="flex h-dvh flex-col">
      <ChatHeader />
      {!hasStarted && messages.length === 0 ? (
        <Welcome onSelectPrompt={handleSelectPrompt} isReturning={isReturning} onPrefill={handlePrefill} />
      ) : (
        <ChatMessages messages={messages} isLoading={isLoading} hasError={chatState.status === "error"} />
      )}
      <ChatInput ref={inputRef} input={input} onInputChange={setInput} onSubmit={handleSend} isLoading={isLoading} />
    </div>
  );
}

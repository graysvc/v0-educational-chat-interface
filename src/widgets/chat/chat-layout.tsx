"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useCodeGate, CodeGate } from "@/features/code-gate";
import { ChatInput, Message as ChatMessage, Welcome, ThinkingIndicator, useChat } from "@/features/chat";
import { ChatHeader } from "./chat-header";

const WELCOME_KEY = "modoPractica_hasSeenWelcome";

export function ChatLayout() {
  const { state: gateState, submitCode } = useCodeGate();
  const { state: chatState, messages, sendMessage } = useChat();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = chatState.status === "sending" || chatState.status === "streaming";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    try { if (localStorage.getItem(WELCOME_KEY) === "true") setIsReturning(true); }
    catch {}
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, chatState]);

  const markAsSeen = useCallback(() => {
    try { localStorage.setItem(WELCOME_KEY, "true"); } catch {}
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    if (!hasStarted) { setHasStarted(true); markAsSeen(); }
    sendMessage(input);
    setInput("");
  }, [input, isLoading, hasStarted, sendMessage, markAsSeen]);

  const handleSelectPrompt = useCallback((prompt: string) => {
    setHasStarted(true);
    markAsSeen();
    sendMessage(prompt);
  }, [sendMessage, markAsSeen]);

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
        <div ref={scrollRef} className="flex-1 overflow-y-auto" role="log" aria-label="Conversacion" aria-live="polite">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-4 md:px-6 md:py-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && <ThinkingIndicator />}
            {chatState.status === "error" && (
              <div className="flex w-fit rounded-2xl rounded-bl-md border border-border bg-card px-5 py-4 text-base text-muted-foreground">
                {"Parece que algo no respondió. Probemos otra vez."}
              </div>
            )}
          </div>
        </div>
      )}
      <ChatInput ref={inputRef} input={input} onInputChange={setInput} onSubmit={handleSend} isLoading={isLoading} />
    </div>
  );
}

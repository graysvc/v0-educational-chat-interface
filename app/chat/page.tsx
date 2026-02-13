"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Header } from "@/components/chat/header"
import { Welcome } from "@/components/chat/welcome"
import { Message } from "@/components/chat/message"
import { ChatInput } from "@/components/chat/chat-input"
import { ThinkingIndicator } from "@/components/chat/thinking-indicator"
import { CodeGate, useCodeGate } from "@/components/chat/code-gate"

const WELCOME_KEY = "modoPractica_hasSeenWelcome"

export default function PracticeChat() {
  const { isUnlocked, unlock, mounted } = useCodeGate()
  const [input, setInput] = useState("")
  const [hasStarted, setHasStarted] = useState(false)
  const [isReturning, setIsReturning] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    try {
      const seen = localStorage.getItem(WELCOME_KEY)
      if (seen === "true") {
        setIsReturning(true)
      }
    } catch {
      // localStorage not available
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  const markAsSeen = useCallback(() => {
    try {
      localStorage.setItem(WELCOME_KEY, "true")
    } catch {
      // localStorage not available
    }
  }, [])

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return
    if (!hasStarted) {
      setHasStarted(true)
      markAsSeen()
    }
    sendMessage({ text: input })
    setInput("")
  }, [input, isLoading, hasStarted, sendMessage, markAsSeen])

  const handleSelectPrompt = useCallback(
    (prompt: string) => {
      setHasStarted(true)
      markAsSeen()
      sendMessage({ text: prompt })
    },
    [sendMessage, markAsSeen],
  )

  const handlePrefill = useCallback(
    (text: string) => {
      setInput(text)
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(text.length, text.length)
        }
      })
    },
    [],
  )

  if (!mounted) {
    return <div className="flex h-dvh flex-col" />
  }

  if (!isUnlocked) {
    return <CodeGate onUnlock={unlock} />
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header />

      {!hasStarted && messages.length === 0 ? (
        <Welcome
          onSelectPrompt={handleSelectPrompt}
          isReturning={isReturning}
          onPrefill={handlePrefill}
        />
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          role="log"
          aria-label="Conversacion"
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-4 md:px-6 md:py-6">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <ThinkingIndicator />
            )}

            {error && (
              <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-card px-5 py-4 text-base text-muted-foreground">
                {"Parece que algo no respondió. Probemos otra vez 🙂"}
              </div>
            )}
          </div>
        </div>
      )}

      <ChatInput
        ref={inputRef}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSend}
        isLoading={isLoading}
      />
    </div>
  )
}

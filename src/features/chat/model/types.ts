import type { Message } from "@/entities/message";

/** Discriminated union for chat states */
export type ChatState =
  | { status: "idle" }
  | { status: "sending"; input: string }
  | { status: "streaming"; chunks: string }
  | { status: "done" }
  | { status: "error"; error: string };

/** Discriminated union for chat actions */
export type ChatAction =
  | { type: "SEND"; input: string }
  | { type: "CHUNK"; text: string }
  | { type: "COMPLETE" }
  | { type: "ERROR"; error: string }
  | { type: "RESET" };

/** Full chat context including messages and state */
export interface ChatContext {
  state: ChatState;
  messages: Message[];
  messagesRemaining: number;
}

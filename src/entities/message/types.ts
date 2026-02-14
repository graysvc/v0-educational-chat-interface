/** Role of the message sender */
export type MessageRole = "user" | "assistant" | "system";

/** Semantic classification tags (populated by LLM, stored as tags only) */
export interface SemanticClassification {
  category: string;
  intention: string;
  cognitiveLevel: string;
  structure: string;
  emotion: string;
  aiRelationship: string;
}

/** A single message in a conversation */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  /** Semantic tags -- only present for classified messages, never persisted as text */
  classification?: SemanticClassification;
}

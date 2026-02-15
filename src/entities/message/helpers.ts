import type { Message, MessageRole } from "./types";

/** Factory to create a Message with auto-generated id and timestamp */
export function createMessage(role: MessageRole, content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
}

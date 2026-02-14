import type { ChatState, ChatAction } from "./types";

export const initialChatState: ChatState = { status: "idle" };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SEND":
      return { status: "sending", input: action.input };

    case "CHUNK":
      return {
        status: "streaming",
        chunks:
          state.status === "streaming"
            ? state.chunks + action.text
            : action.text,
      };

    case "COMPLETE":
      return { status: "done" };

    case "ERROR":
      return { status: "error", error: action.error };

    case "RESET":
      return { status: "idle" };

    default:
      return state;
  }
}

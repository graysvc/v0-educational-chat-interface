import type { Session } from "@/entities/session";

export type SessionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "active"; session: Session }
  | { status: "expired" };

export type SessionAction =
  | { type: "LOAD" }
  | { type: "RESOLVED"; session: Session }
  | { type: "TRACK_MESSAGE" }
  | { type: "EXPIRED" }
  | { type: "RESET" };

export const initialSessionState: SessionState = { status: "idle" };

export function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case "LOAD":
      return { status: "loading" };
    case "RESOLVED":
      return { status: "active", session: action.session };
    case "TRACK_MESSAGE":
      if (state.status !== "active") return state;
      return {
        status: "active",
        session: {
          ...state.session,
          messageCount: state.session.messageCount + 1,
          lastActiveAt: new Date(),
        },
      };
    case "EXPIRED":
      return { status: "expired" };
    case "RESET":
      return { status: "idle" };
    default:
      return state;
  }
}

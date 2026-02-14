/** Discriminated union for code-gate states */
export type CodeGateState =
  | { status: "locked" }
  | { status: "validating"; code: string }
  | { status: "unlocked"; code: string }
  | { status: "error"; error: string };

export type CodeGateAction =
  | { type: "SUBMIT"; code: string }
  | { type: "VALID"; code: string }
  | { type: "INVALID"; error: string }
  | { type: "LOCK" };

export const initialCodeGateState: CodeGateState = { status: "locked" };

export function codeGateReducer(
  state: CodeGateState,
  action: CodeGateAction
): CodeGateState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "validating", code: action.code };

    case "VALID":
      return { status: "unlocked", code: action.code };

    case "INVALID":
      return { status: "error", error: action.error };

    case "LOCK":
      return { status: "locked" };

    default:
      return state;
  }
}

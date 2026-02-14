/** Utility response: did the session help? */
export type UtilityResponse = "si" | "masomenos" | "no";

/** Feeling response: how does the student feel? */
export type FeelingResponse = "tranquilo" | "bien" | "confundido" | "frustrado";

/** Full survey response payload */
export interface SurveyResponse {
  sessionId: string;
  utility: UtilityResponse;
  feeling: FeelingResponse;
}

/** Labels for displaying options in the UI (Spanish) */
export const UTILITY_LABELS: Record<UtilityResponse, string> = {
  si: "Sí, me sirvió",
  masomenos: "Más o menos",
  no: "No me sirvió",
};

export const FEELING_LABELS: Record<FeelingResponse, string> = {
  tranquilo: "Tranquilo/a",
  bien: "Bien",
  confundido: "Confundido/a",
  frustrado: "Frustrado/a",
};

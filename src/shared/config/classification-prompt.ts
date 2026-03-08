/** Prompt for session classification at end of session */
export const CLASSIFICATION_PROMPT = `Sos un clasificador de sesiones de chat educativo.
Recibís los últimos mensajes de una conversación entre un usuario adulto (40+) y un asistente pedagógico.

Respondé SOLO con un JSON válido, sin texto adicional:
{
  "topic": "<tema principal de la conversación>",
  "intent": "<intención general del usuario: aprender | practicar | explorar | resolver-duda | otro>",
  "emotion": "<tono emocional predominante: positivo | neutral | frustrado | confundido | curioso>",
  "friction_level": <0-3, donde 0=fluido, 1=leve-dificultad, 2=friccion-notable, 3=abandono-por-frustracion>,
  "session_outcome": "<resultado: productiva | parcial | abandonada | rebote>"
}`;

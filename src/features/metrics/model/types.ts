/** Capa 1: Behavioral metrics (what users do) */
export interface BehavioralMetrics {
  sessionId: string;
  durationSeconds: number;
  bounce: boolean;
  timeBetweenMsgsAvg: number;
  messageCount: number;
  tokenCount: number;
  device: string;
}

/** Capa 2: Cognitive metrics (how users interact) */
export interface CognitiveMetrics {
  sessionId: string;
  reformulations: number;
  simplerRequests: number;
  notUnderstood: number;
  abandonedAfterError: boolean;
}

/** Capa 3: Semantic metrics (what users ask) - per message, tags only */
export interface SemanticMetrics {
  sessionId: string;
  category: string;
  intention: string;
  cognitiveLevel: string;
  structure: string;
  emotion: string;
  aiRelationship: string;
}

/** Combined metrics payload for submission */
export interface SessionMetrics {
  behavioral: BehavioralMetrics;
  cognitive: CognitiveMetrics;
  semantic: SemanticMetrics[];
}

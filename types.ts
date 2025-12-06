export interface ChessApiResponse {
  text?: string;
  eval?: number; // Centipawns. Positive = Good for active color.
  move?: string; // Best move in coordinate notation e.g. e2e4
  fen?: string;
  depth?: number;
  winChance?: number;
  continuationArr?: string[];
  mate?: number | null;
  centipawns?: number | string;
  san?: string; // Short algebraic notation
  lan?: string; // Long algebraic notation
  type?: "move" | "bestmove" | "info";
  from?: string;
  to?: string;
  taskId?: string;
}

export interface GameArchive {
  archives: string[];
}

export interface ChessComGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  white: { rating: number; result: string; username: string };
  black: { rating: number; result: string; username: string };
}

export interface AnalysisState {
  isAnalyzing: boolean;
  bestMove: string | null;
  bestMoveSan: string | null;
  evaluation: number | null; // Centipawns. Negative for black advantage.
  mate: number | null; // Moves to mate.
  continuation: string[];
  depth: number;
  winChance: number;
}

export interface GameHeader {
  white: string;
  black: string;
  whiteElo: string;
  blackElo: string;
  result: string;
  event: string;
  site: string;
  date: string;
}

export type MoveClassification =
  | "brilliant"
  | "great"
  | "best"
  | "excellent"
  | "good"
  | "inaccuracy"
  | "mistake"
  | "blunder"
  | "miss"
  | "book"
  | "forced";

export interface AnalyzedMove {
  fen: string;
  moveSan: string;
  moveIndex: number; // 0-based
  eval: number; // Normalized to White perspective
  mate: number | null;
  classification: MoveClassification;
  bestMove?: string;
  cpLoss?: number;
}

import { Chess } from "chess.js";
import { chessApiService } from "../services/chessApiService";
import { GameHeader, AnalyzedMove } from "../types";

export const loadFenHelper = (newFen: string) => {
  const temp = new Chess(newFen);
  return {
    fen: temp.fen(),
    startFen: temp.fen(),
    history: [],
    moveIndex: -1,
    orientation: (temp.fen().includes(" w ") ? "white" : "black") as
      | "white"
      | "black",
    header: {
      white: "White",
      black: "Black",
      whiteElo: "",
      blackElo: "",
      result: "*",
      event: "Analysis",
      site: "",
      date: new Date().toLocaleDateString(),
    },
  };
};

export const loadPgnHelper = (pgn: string) => {
  const chess = new Chess();
  let success = false;

  try {
    chess.loadPgn(pgn);
    success = true;
  } catch (e) {
    try {
      const cleanPgn = pgn.replace(/\r?\n/g, " ").replace(/\s\s+/g, " ").trim();
      chess.loadPgn(cleanPgn);
      success = true;
    } catch (e) {
      throw new Error("Failed to parse PGN");
    }
  }

  const headers = chess.header();
  return {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    history: chess.history(),
    moveIndex: -1,
    orientation: "white" as const,
    header: {
      white: headers["White"] || "White",
      black: headers["Black"] || "Black",
      whiteElo: headers["WhiteElo"] || "",
      blackElo: headers["BlackElo"] || "",
      result: headers["Result"] || "*",
      event: headers["Event"] || "Imported Game",
      site: headers["Site"] || "",
      date: headers["Date"] || "",
    },
  };
};

export const analyzeGameMoves = async (
  moves: string[],
  onProgress: (progress: number, count: number) => void,
  shouldAbort: () => boolean,
): Promise<AnalyzedMove[]> => {
  const tempChess = new Chess();
  const newAnalyzedMoves: AnalyzedMove[] = [];

  let prevEval = 0.35;
  let prevBestMove = "";

  try {
    const startData = await chessApiService.analyze(tempChess.fen(), {
      depth: 14,
    });
    if (startData.eval !== undefined) prevEval = startData.eval;
    if (startData.move) prevBestMove = startData.move;
  } catch (e) {
    console.warn("Start pos analysis failed", e);
  }

  for (let i = 0; i < moves.length; i++) {
    if (shouldAbort()) break;

    const moveSan = moves[i];
    const moveDetails = tempChess.move(moveSan);
    if (!moveDetails) continue;

    const playedMoveUci = moveDetails.from + moveDetails.to;
    const currentFen = tempChess.fen();

    const data = await chessApiService.analyze(currentFen, { depth: 14 });

    let currentEvalWhite = 0;
    let currentMate = null;

    if (data.mate !== undefined && data.mate !== null) {
      const isBlackTurn = tempChess.turn() === "b";
      currentMate = isBlackTurn ? -data.mate : data.mate;
      currentEvalWhite = currentMate > 0 ? 2000 : -2000;
    } else if (data.eval !== undefined) {
      const isBlackTurn = tempChess.turn() === "b";
      currentEvalWhite = isBlackTurn ? -data.eval : data.eval;
    }

    const isWhiteMove = i % 2 === 0;
    let cpLoss = isWhiteMove
      ? prevEval - currentEvalWhite
      : currentEvalWhite - prevEval;

    if (cpLoss < 0) cpLoss = 0;

    const isBestMoveMatch = prevBestMove === playedMoveUci;

    let classification:
      | "brilliant"
      | "great"
      | "best"
      | "excellent"
      | "good"
      | "book"
      | "inaccuracy"
      | "mistake"
      | "blunder"
      | "miss" = "good";

    if (isBestMoveMatch) {
      classification = "best";
    } else {
      if (cpLoss < 20) classification = "excellent";
      else if (cpLoss < 50) classification = "good";
      else if (cpLoss < 100) classification = "inaccuracy";
      else if (cpLoss < 200) classification = "mistake";
      else classification = "blunder";
    }

    if (i < 8 && cpLoss < 30) classification = "book";
    if (classification === "excellent" && cpLoss < 10) classification = "best";

    if (isWhiteMove) {
      if (prevEval > 200 && currentEvalWhite < 100) classification = "miss";
    } else {
      if (prevEval < -200 && currentEvalWhite > -100) classification = "miss";
    }

    newAnalyzedMoves.push({
      fen: currentFen,
      moveSan: moveSan,
      moveIndex: i,
      eval: currentEvalWhite,
      mate: currentMate,
      classification,
      bestMove: prevBestMove,
      cpLoss,
    });

    prevEval = currentEvalWhite;
    if (data.move) prevBestMove = data.move;

    onProgress(
      Math.round(((i + 1) / moves.length) * 100),
      newAnalyzedMoves.length,
    );
  }

  return newAnalyzedMoves;
};

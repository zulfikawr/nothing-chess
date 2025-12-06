import { useState, useRef } from "react";
import { GameHeader, AnalyzedMove } from "../types";

export const useGameState = () => {
  const [gameId, setGameId] = useState(0);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [startFen, setStartFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [fullHistory, setFullHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  const [gameHeader, setGameHeader] = useState<GameHeader>({
    white: "White",
    black: "Black",
    whiteElo: "",
    blackElo: "",
    result: "*",
    event: "Casual Game",
    site: "",
    date: "",
  });

  const [analyzedMoves, setAnalyzedMoves] = useState<AnalyzedMove[]>([]);

  const resetGame = () => {
    const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    setStartFen(start);
    setFullHistory([]);
    setCurrentMoveIndex(-1);
    setFen(start);
    setGameId(Date.now());
    setAnalyzedMoves([]);
    setOrientation("white");
    setGameHeader({
      white: "White",
      black: "Black",
      whiteElo: "",
      blackElo: "",
      result: "*",
      event: "New Game",
      site: "",
      date: "",
    });
  };

  return {
    gameId,
    setGameId,
    fen,
    setFen,
    startFen,
    setStartFen,
    fullHistory,
    setFullHistory,
    currentMoveIndex,
    setCurrentMoveIndex,
    orientation,
    setOrientation,
    gameHeader,
    setGameHeader,
    analyzedMoves,
    setAnalyzedMoves,
    resetGame,
  };
};

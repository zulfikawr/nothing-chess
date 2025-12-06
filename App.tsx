import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Chess } from "chess.js";
import { Download, Terminal, RotateCcw } from "lucide-react";

// Hooks
import { useGameState, useAnalysisState } from "./hooks";

// Components
import ImportGame from "./components/ImportGame";
import {
  AnalysisBox,
  EngineContinuation,
  MoveClassificationBadge,
} from "./components/analysis";
import { BoardDisplay } from "./components/board";
import { PlayerInfo } from "./components/player-info";
import { MobileHistory, DesktopHistory } from "./components/history";
import { NavigationControls } from "./components/controls";
import { AnalysisOverlay } from "./components/overlays";

// Services & Utils
import { chessApiService } from "./services/chessApiService";
import {
  loadFenHelper,
  loadPgnHelper,
  analyzeGameMoves,
} from "./utils/gameHelpers";
import { ChessApiResponse } from "./types";

const App: React.FC = () => {
  // Game State (from hooks)
  const gameState = useGameState();
  const analysisState = useAnalysisState();

  // UI State
  const [showImport, setShowImport] = useState(false);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  const mobileHistoryScrollRef = useRef<HTMLDivElement>(null);

  // Refs
  const analyzeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortAnalysisRef = useRef<boolean>(false);

  // Derived Game Status
  const gameStatus = useMemo(() => {
    const game = new Chess(gameState.fen);
    return {
      turn: game.turn(),
      isCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isDraw: game.isDraw(),
      isStalemate: game.isStalemate(),
      isGameOver: game.isGameOver(),
    };
  }, [gameState.fen]);

  // --- Effects ---

  // Trigger analysis when FEN changes
  useEffect(() => {
    if (analysisState.isProcessingGame) return;
    if (analyzeTimeoutRef.current) clearTimeout(analyzeTimeoutRef.current);

    const cached = gameState.analyzedMoves.find(
      (m) => m.moveIndex === gameState.currentMoveIndex,
    );
    if (cached) {
      analysisState.setAnalysis((prev) => ({
        ...prev,
        isAnalyzing: false,
        evaluation: cached.eval,
        mate: cached.mate,
        bestMove: cached.bestMove || null,
        bestMoveSan: null,
        depth: 16,
        winChance: 50,
      }));
    }

    analysisState.setAnalysis((prev) => ({ ...prev, isAnalyzing: true }));

    // Auto-scroll history
    if (historyScrollRef.current && gameState.currentMoveIndex >= 0) {
      const moveEl = document.getElementById(
        `move-${gameState.currentMoveIndex}`,
      );
      if (moveEl) {
        moveEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }

    if (mobileHistoryScrollRef.current) {
      if (gameState.currentMoveIndex === -1) {
        mobileHistoryScrollRef.current.scrollLeft = 0;
      } else {
        const moveEl = document.getElementById(
          `mobile-move-${gameState.currentMoveIndex}`,
        );
        if (moveEl) {
          moveEl.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }

    analyzeTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await chessApiService.analyze(gameState.fen, {
          depth: 16,
        });
        handleAnalysisUpdate(data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          analysisState.setAnalysis((prev) => ({
            ...prev,
            isAnalyzing: false,
          }));
        }
      }
    }, 600);
  }, [
    gameState.fen,
    analysisState.isProcessingGame,
    gameState.analyzedMoves,
    gameState.currentMoveIndex,
  ]);

  // --- Handlers ---

  const handleAnalysisUpdate = useCallback(
    (data: ChessApiResponse) => {
      if (
        (data.eval === undefined && data.mate === undefined && !data.move) ||
        data.type === "info"
      )
        return;

      let evalVal = null;
      let mateVal = null;

      if (data.mate !== null && data.mate !== undefined) {
        mateVal = data.mate;
      } else if (data.eval !== undefined) {
        evalVal = data.eval;
      }

      analysisState.setAnalysis({
        isAnalyzing: false,
        bestMove: data.move || null,
        bestMoveSan: data.san || null,
        evaluation: evalVal,
        mate: mateVal,
        continuation: data.continuationArr || [],
        depth: data.depth || 0,
        winChance: data.winChance || 50,
      });
    },
    [analysisState],
  );

  const onMove = (source: string, target: string) => {
    if (analysisState.isProcessingGame) return false;
    const tempGame = new Chess(gameState.fen);
    try {
      const move = tempGame.move({
        from: source,
        to: target,
        promotion: "q",
      });

      if (!move) return false;

      const newHistory = gameState.fullHistory.slice(
        0,
        gameState.currentMoveIndex + 1,
      );
      newHistory.push(move.san);

      const validAnalysis = gameState.analyzedMoves.filter(
        (m) => m.moveIndex <= gameState.currentMoveIndex,
      );
      gameState.setAnalyzedMoves(validAnalysis);

      gameState.setFullHistory(newHistory);
      gameState.setCurrentMoveIndex(newHistory.length - 1);
      gameState.setFen(tempGame.fen());
      return true;
    } catch (e) {
      console.error("Move error:", e);
      return false;
    }
  };

  const handleSmartImport = (input: string) => {
    const cleanInput = input.trim();
    const isFenLike =
      cleanInput.split(/\s+/).length >= 4 && cleanInput.includes("/");

    if (isFenLike) {
      try {
        const temp = new Chess(cleanInput);
        const result = loadFenHelper(temp.fen());
        gameState.setStartFen(result.startFen);
        gameState.setFen(result.fen);
        gameState.setFullHistory(result.history);
        gameState.setCurrentMoveIndex(result.moveIndex);
        gameState.setAnalyzedMoves([]);
        gameState.setOrientation(result.orientation);
        gameState.setGameHeader(result.header);
        gameState.setGameId((prev) => prev + 1);
        setShowImport(false);
        return;
      } catch (e) {
        // Not valid FEN, proceed to try PGN
      }
    }

    // Try PGN
    try {
      const result = loadPgnHelper(cleanInput);
      gameState.setStartFen(result.startFen);
      gameState.setFen(result.fen);
      gameState.setFullHistory(result.history);
      gameState.setCurrentMoveIndex(result.moveIndex);
      gameState.setAnalyzedMoves([]);
      gameState.setOrientation(result.orientation);
      gameState.setGameHeader(result.header);
      gameState.setGameId(Date.now());

      // Start Full Game Analysis
      analyzeFullGame(result.history);
      setShowImport(false);
    } catch (e) {
      console.error(e);
      alert("Could not load game. The PGN/FEN format might be unsupported.");
    }
  };

  const analyzeFullGame = async (moves: string[]) => {
    analysisState.setIsProcessingGame(true);
    analysisState.setProcessingProgress(0);
    abortAnalysisRef.current = false;

    try {
      const newAnalyzedMoves = await analyzeGameMoves(
        moves,
        (progress, count) => {
          analysisState.setProcessingProgress(progress);
        },
        () => abortAnalysisRef.current,
      );

      gameState.setAnalyzedMoves(newAnalyzedMoves);
      analysisState.setIsProcessingGame(false);
      gameState.setCurrentMoveIndex(-1);
    } catch (e) {
      console.error("Analysis sequence error", e);
      analysisState.setIsProcessingGame(false);
    }
  };

  const navigateTo = (index: number) => {
    const tempGame = new Chess(gameState.startFen);
    for (let i = 0; i <= index; i++) {
      tempGame.move(gameState.fullHistory[i]);
    }
    gameState.setFen(tempGame.fen());
    gameState.setCurrentMoveIndex(index);
  };

  const handleResetBoard = () => {
    abortAnalysisRef.current = true;
    gameState.resetGame();
    analysisState.resetAnalysis();
  };

  // Player Info
  const topPlayer =
    gameState.orientation === "white"
      ? {
          name: gameState.gameHeader.black,
          elo: gameState.gameHeader.blackElo,
          color: "b" as const,
        }
      : {
          name: gameState.gameHeader.white,
          elo: gameState.gameHeader.whiteElo,
          color: "w" as const,
        };

  const bottomPlayer =
    gameState.orientation === "white"
      ? {
          name: gameState.gameHeader.white,
          elo: gameState.gameHeader.whiteElo,
          color: "w" as const,
        }
      : {
          name: gameState.gameHeader.black,
          elo: gameState.gameHeader.blackElo,
          color: "b" as const,
        };

  // Game Over Reason
  const gameOverReason = gameStatus.isCheckmate
    ? "CHECKMATE"
    : gameStatus.isDraw
      ? "DRAW"
      : gameStatus.isStalemate
        ? "STALEMATE"
        : "GAME OVER";

  // Navigation state
  const canNavigate = {
    first: gameState.currentMoveIndex !== -1,
    prev: gameState.currentMoveIndex !== -1,
    next: gameState.currentMoveIndex !== gameState.fullHistory.length - 1,
    last: gameState.currentMoveIndex !== gameState.fullHistory.length - 1,
  };

  return (
    <div className="h-[100dvh] w-screen bg-black text-white font-mono flex flex-col md:flex-row overflow-hidden selection:bg-nothing-red selection:text-white">
      {/* --- Overlays --- */}
      {showImport && (
        <ImportGame
          onImport={handleSmartImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {analysisState.isProcessingGame && (
        <AnalysisOverlay
          progress={analysisState.processingProgress}
          analyzedCount={gameState.analyzedMoves.length}
          totalMoves={gameState.fullHistory.length}
          onCancel={() => {
            abortAnalysisRef.current = true;
            analysisState.setIsProcessingGame(false);
          }}
        />
      )}

      {/* --- Left Panel (Mobile: Top, Desktop: Left) --- */}
      <div className="flex-none md:flex-1 flex flex-col items-center justify-start md:justify-center p-2 pt-2 md:p-4 relative bg-dot-pattern border-b md:border-b-0 md:border-r border-neutral-800 z-10">
        {/* Mobile Header / Desktop Hidden */}
        <div className="w-full flex justify-between items-center md:hidden mb-2 px-1">
          <div className="flex items-center gap-2 font-bold tracking-tight text-sm">
            <Terminal size={14} className="text-nothing-red" />
            NOTHING CHESS
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetBoard}
              className="flex items-center justify-center bg-neutral-900 text-white w-7 h-7 hover:bg-nothing-red transition-colors"
            >
              <RotateCcw size={12} />
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1 bg-white text-black text-[10px] font-bold px-2 py-1.5"
            >
              <Download size={10} /> IMPORT
            </button>
          </div>
        </div>

        <div className="w-full max-w-[500px] md:max-w-[85vh] flex flex-col gap-1 md:gap-4">
          {/* Mobile Horizontal History */}
          <MobileHistory
            moves={gameState.fullHistory}
            currentMoveIndex={gameState.currentMoveIndex}
            onNavigate={navigateTo}
            scrollRef={mobileHistoryScrollRef}
          />

          {/* Top Player */}
          <PlayerInfo
            name={topPlayer.name}
            elo={topPlayer.elo}
            color={topPlayer.color}
            isActive={gameStatus.turn === topPlayer.color}
            isCheckmate={
              gameStatus.isCheckmate && gameStatus.turn === topPlayer.color
            }
            isCheck={gameStatus.isCheck && gameStatus.turn === topPlayer.color}
            isTopPlayer
          />

          {/* Board */}
          <BoardDisplay
            fen={gameState.fen}
            onPieceDrop={onMove}
            boardOrientation={gameState.orientation}
            isProcessing={analysisState.isProcessingGame}
            evaluation={analysisState.analysis}
            isGameOver={gameStatus.isGameOver}
            gameOverReason={gameOverReason}
          />

          {/* Bottom Player */}
          <PlayerInfo
            name={bottomPlayer.name}
            elo={bottomPlayer.elo}
            color={bottomPlayer.color}
            isActive={gameStatus.turn === bottomPlayer.color}
            isCheckmate={
              gameStatus.isCheckmate && gameStatus.turn === bottomPlayer.color
            }
            isCheck={
              gameStatus.isCheck && gameStatus.turn === bottomPlayer.color
            }
            onFlip={() =>
              gameState.setOrientation((o) =>
                o === "white" ? "black" : "white",
              )
            }
          />
        </div>
      </div>

      {/* --- Right Panel (Info & Tools) --- */}
      <div className="flex-1 w-full md:w-[400px] bg-black md:border-l border-neutral-800 flex flex-col min-h-0 z-20 shadow-2xl">
        {/* Desktop Header */}
        <div className="hidden md:flex p-4 border-b border-neutral-800 justify-between items-center bg-neutral-900/50 backdrop-blur">
          <h1 className="text-base md:text-lg font-bold tracking-tighter flex items-center gap-2">
            <Terminal size={18} className="text-nothing-red" />
            NOTHING CHESS
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleResetBoard}
              className="flex items-center gap-2 border border-neutral-700 px-3 py-1.5 text-xs font-bold hover:bg-white hover:text-black transition-all"
            >
              <RotateCcw size={12} />
              <span>RESET</span>
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="group flex items-center gap-2 border border-neutral-700 px-3 py-1.5 text-xs font-bold hover:bg-white hover:text-black transition-all"
            >
              <Download size={12} />
              <span>IMPORT</span>
            </button>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="flex-none p-2 md:p-4 border-b border-neutral-800 bg-neutral-900/20">
          <AnalysisBox analysis={analysisState.analysis} />

          {gameState.currentMoveIndex >= 0 &&
            gameState.analyzedMoves[gameState.currentMoveIndex] && (
              <MoveClassificationBadge
                move={gameState.analyzedMoves[gameState.currentMoveIndex]}
              />
            )}

          <EngineContinuation
            continuation={analysisState.analysis.continuation}
          />
        </div>

        {/* Move History */}
        <DesktopHistory
          moves={gameState.fullHistory}
          analyzedMoves={gameState.analyzedMoves}
          currentMoveIndex={gameState.currentMoveIndex}
          onNavigate={navigateTo}
          scrollRef={historyScrollRef}
        />

        {/* Navigation Controls */}
        <NavigationControls
          canGoFirst={canNavigate.first}
          canGoPrev={canNavigate.prev}
          canGoNext={canNavigate.next}
          canGoLast={canNavigate.last}
          onFirst={() => navigateTo(-1)}
          onPrev={() => navigateTo(gameState.currentMoveIndex - 1)}
          onNext={() => navigateTo(gameState.currentMoveIndex + 1)}
          onLast={() => navigateTo(gameState.fullHistory.length - 1)}
        />
      </div>
    </div>
  );
};

export default App;

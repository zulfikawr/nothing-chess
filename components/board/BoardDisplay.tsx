import React from "react";
import { Chessboard } from "react-chessboard";
import { Flag } from "lucide-react";
import EvalBar from "../EvalBar";
import { AnalysisState } from "../../types";

interface BoardDisplayProps {
  fen: string;
  onPieceDrop: (source: string, target: string) => boolean;
  boardOrientation: "white" | "black";
  isProcessing: boolean;
  evaluation: AnalysisState;
  isGameOver: boolean;
  gameOverReason: string;
}

export const BoardDisplay: React.FC<BoardDisplayProps> = ({
  fen,
  onPieceDrop,
  boardOrientation,
  isProcessing,
  evaluation,
  isGameOver,
  gameOverReason,
}) => {
  return (
    <div className="w-full aspect-square relative flex shadow-[0_0_40px_rgba(255,255,255,0.05)] bg-black p-0.5 md:p-2 border border-neutral-800">
      {/* Eval Bar */}
      <div className="h-full mr-1 md:mr-3 shrink-0 w-2 md:w-5 transition-all duration-300">
        <EvalBar evaluation={evaluation.evaluation} mate={evaluation.mate} />
      </div>

      {/* Board Wrapper */}
      <div className="flex-1 aspect-square relative overflow-hidden bg-neutral-900">
        {/* @ts-ignore: Prop 'position' exists on Chessboard but may be missing in type definitions */}
        <Chessboard
          position={fen}
          onPieceDrop={(source, target) => onPieceDrop(source, target)}
          boardOrientation={boardOrientation}
          arePiecesDraggable={!isProcessing}
          animationDuration={200}
          customDarkSquareStyle={{ backgroundColor: "#171717" }}
          customLightSquareStyle={{ backgroundColor: "#404040" }}
          customDropSquareStyle={{
            boxShadow: "inset 0 0 1px 4px #D71921",
          }}
        />

        {/* Center Status Overlay (Game Over) */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/40">
            <div className="bg-black border border-white px-4 py-2 text-white font-bold tracking-widest shadow-2xl flex items-center gap-2">
              <Flag size={16} />
              {gameOverReason}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

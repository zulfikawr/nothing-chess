import React from "react";
import { AnalyzedMove } from "../../types";
import { getMoveStyle } from "../../utils/moveStyles";

interface DesktopHistoryProps {
  moves: string[];
  analyzedMoves: AnalyzedMove[];
  currentMoveIndex: number;
  onNavigate: (index: number) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const DesktopHistory: React.FC<DesktopHistoryProps> = ({
  moves,
  analyzedMoves,
  currentMoveIndex,
  onNavigate,
  scrollRef,
}) => {
  return (
    <div className="hidden md:flex flex-1 relative flex-col bg-black overflow-hidden min-h-0">
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent h-4 z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 md:p-4 custom-scrollbar space-y-0.5"
      >
        {moves.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-neutral-800 text-xs mt-4">
            START GAME TO SEE MOVES
          </div>
        )}

        {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
          const moveNum = i + 1;
          const whiteIndex = i * 2;
          const blackIndex = i * 2 + 1;

          const whiteMove = moves[whiteIndex];
          const blackMove = moves[blackIndex];

          const whiteAnalysis = analyzedMoves[whiteIndex];
          const blackAnalysis = analyzedMoves[blackIndex];

          const isWhiteActive = currentMoveIndex === whiteIndex;
          const isBlackActive = currentMoveIndex === blackIndex;

          return (
            <div
              key={i}
              className="flex items-center text-xs md:text-sm font-mono border-b border-neutral-900/50 py-0.5 md:py-1"
            >
              <span className="w-6 md:w-8 text-neutral-600 text-right mr-2 md:mr-4 text-[10px] md:text-xs">
                {moveNum}.
              </span>

              {/* White Move */}
              <button
                onClick={() => onNavigate(whiteIndex)}
                id={`move-${whiteIndex}`}
                className={`
                           flex-1 text-left px-2 py-1 transition-all rounded flex justify-between items-center group
                           ${isWhiteActive ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}
                         `}
              >
                <span className={isWhiteActive ? "font-bold" : ""}>
                  {whiteMove}
                </span>
                {whiteAnalysis && (
                  <span
                    className={`${getMoveStyle(whiteAnalysis.classification).color} text-[10px] flex gap-1 opacity-70 group-hover:opacity-100`}
                  >
                    {getMoveStyle(whiteAnalysis.classification).icon}
                  </span>
                )}
              </button>

              {/* Black Move */}
              {blackMove ? (
                <button
                  onClick={() => onNavigate(blackIndex)}
                  id={`move-${blackIndex}`}
                  className={`
                               flex-1 text-left px-2 py-1 transition-all rounded flex justify-between items-center group
                               ${isBlackActive ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}
                             `}
                >
                  <span className={isBlackActive ? "font-bold" : ""}>
                    {blackMove}
                  </span>
                  {blackAnalysis && (
                    <span
                      className={`${getMoveStyle(blackAnalysis.classification).color} text-[10px] flex gap-1 opacity-70 group-hover:opacity-100`}
                    >
                      {getMoveStyle(blackAnalysis.classification).icon}
                    </span>
                  )}
                </button>
              ) : (
                <div className="flex-1"></div>
              )}
            </div>
          );
        })}
        {/* Spacer at bottom */}
        <div className="h-10"></div>
      </div>
    </div>
  );
};

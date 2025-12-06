import React from "react";
import { AnalyzedMove } from "../../types";
import { getMoveStyle } from "../../utils/moveStyles";

interface MobileHistoryProps {
  moves: string[];
  currentMoveIndex: number;
  onNavigate: (index: number) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const MobileHistory: React.FC<MobileHistoryProps> = ({
  moves,
  currentMoveIndex,
  onNavigate,
  scrollRef,
}) => {
  return (
    <div
      ref={scrollRef}
      className="w-full md:hidden flex items-center overflow-x-auto whitespace-nowrap bg-black border border-neutral-800 p-2 gap-1 text-xs font-mono custom-scrollbar my-1 h-10"
    >
      {moves.length === 0 && (
        <span className="text-neutral-600 italic text-[10px]">
          NO MOVES YET
        </span>
      )}
      {moves.map((move, i) => {
        const isWhite = i % 2 === 0;
        const moveNum = Math.floor(i / 2) + 1;
        const isActive = i === currentMoveIndex;
        return (
          <React.Fragment key={i}>
            {isWhite && (
              <span className="text-neutral-500 ml-2">{moveNum}.</span>
            )}
            <button
              id={`mobile-move-${i}`}
              onClick={() => onNavigate(i)}
              className={`px-1.5 py-0.5 rounded transition-colors ${isActive ? "bg-white text-black font-bold" : "text-neutral-300 hover:text-white"}`}
            >
              {move}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

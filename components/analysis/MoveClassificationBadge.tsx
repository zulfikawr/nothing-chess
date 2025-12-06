import React from "react";
import { AnalyzedMove } from "../../types";
import { getMoveStyle } from "../../utils/moveStyles";

interface MoveClassificationBadgeProps {
  move: AnalyzedMove;
}

export const MoveClassificationBadge: React.FC<
  MoveClassificationBadgeProps
> = ({ move }) => {
  const style = getMoveStyle(move.classification);

  return (
    <div className="mt-2 p-1.5 md:p-2 bg-neutral-900/50 border border-neutral-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {style.icon}
        <span className={`text-xs md:text-sm font-bold ${style.color}`}>
          {style.label}
        </span>
      </div>
      {move.cpLoss !== undefined && (
        <span className="text-[8px] md:text-[10px] text-neutral-500 font-mono">
          LOSS: {Math.abs(move.cpLoss!).toFixed(1)}
        </span>
      )}
    </div>
  );
};

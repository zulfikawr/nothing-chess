import React from "react";
import { Cpu } from "lucide-react";

interface AnalysisOverlayProps {
  progress: number;
  analyzedCount: number;
  totalMoves: number;
  onCancel: () => void;
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({
  progress,
  analyzedCount,
  totalMoves,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="relative w-20 h-20 mx-auto">
          <Cpu size={80} className="text-neutral-800 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-nothing-red">
            {progress}%
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tighter mb-2">
            ANALYZING GAME
          </h2>
          <p className="text-xs text-neutral-500 uppercase tracking-widest">
            Calculated {analyzedCount} / {totalMoves} moves
          </p>
        </div>
        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-nothing-red transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <button
          onClick={onCancel}
          className="mt-8 text-neutral-500 hover:text-white text-xs underline"
        >
          CANCEL ANALYSIS
        </button>
      </div>
    </div>
  );
};

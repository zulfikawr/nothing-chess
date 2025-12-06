import React from "react";
import { BarChart2 } from "lucide-react";
import { AnalysisState } from "../../types";

interface AnalysisBoxProps {
  analysis: AnalysisState;
}

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      {/* Score Box */}
      <div className="bg-neutral-900 p-2 md:p-3 border border-neutral-800 flex flex-col justify-center">
        <div className="text-[8px] md:text-[10px] text-neutral-500 mb-0.5 md:mb-1 flex items-center gap-1">
          <BarChart2 size={10} /> EVAL
        </div>
        <div
          className={`text-lg md:text-2xl font-mono font-bold ${
            analysis.evaluation !== null && analysis.evaluation > 0
              ? "text-green-500"
              : analysis.evaluation !== null && analysis.evaluation < 0
                ? "text-nothing-red"
                : "text-white"
          }`}
        >
          {analysis.mate
            ? `M${Math.abs(analysis.mate)}`
            : analysis.evaluation !== null
              ? (analysis.evaluation > 0 ? "+" : "") +
                analysis.evaluation.toFixed(2)
              : "-. --"}
        </div>
      </div>

      {/* Best Move Box */}
      <div className="bg-neutral-900 p-2 md:p-3 border border-neutral-800 flex flex-col justify-center">
        <div className="text-[8px] md:text-[10px] text-neutral-500 mb-0.5 md:mb-1 flex items-center gap-1">
          <span>TARGET</span>
        </div>
        <div className="text-lg md:text-2xl font-mono font-bold text-white truncate">
          {analysis.bestMoveSan || analysis.bestMove || "-"}
        </div>
      </div>
    </div>
  );
};

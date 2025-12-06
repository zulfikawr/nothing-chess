import React from "react";
import { Zap } from "lucide-react";
import { AnalysisState } from "../../types";

interface EngineContinuationProps {
  continuation: AnalysisState["continuation"];
}

export const EngineContinuation: React.FC<EngineContinuationProps> = ({
  continuation,
}) => {
  return (
    <div className="mt-2 font-mono text-[10px] md:text-xs leading-relaxed text-neutral-400 overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-2 items-center h-8">
      {continuation.length > 0 ? (
        continuation.map((m, i) => (
          <span
            key={i}
            className={`inline-block ${i === 0 ? "text-white font-bold border-b border-nothing-red" : ""}`}
          >
            {m}
          </span>
        ))
      ) : (
        <span className="text-neutral-700 italic flex items-center gap-1">
          <Zap size={10} /> ...
        </span>
      )}
    </div>
  );
};

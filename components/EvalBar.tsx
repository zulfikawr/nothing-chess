import React from "react";

interface EvalBarProps {
  evaluation: number | null; // Centipawns
  mate: number | null;
}

const EvalBar: React.FC<EvalBarProps> = ({ evaluation, mate }) => {
  // Normalize eval to percentage for bar height (White perspective)
  // Max cap at +/- 500 cp (5 pawns) for visual scaling
  let fillPercentage = 50;
  let text = "0.0";

  if (mate !== null) {
    if (mate > 0) {
      fillPercentage = 100; // White mates
      text = `M${mate}`;
    } else {
      fillPercentage = 0; // Black mates
      text = `M${Math.abs(mate)}`;
    }
  } else if (evaluation !== null) {
    const cappedEval = Math.max(-5, Math.min(5, evaluation)); // Cap between -5 and 5
    // Map -5..5 to 0..100
    // -5 -> 0%
    // 0 -> 50%
    // 5 -> 100%
    fillPercentage = ((cappedEval + 5) / 10) * 100;
    text = (evaluation > 0 ? "+" : "") + evaluation.toFixed(2);
  }

  return (
    <div className="h-full w-8 md:w-12 bg-neutral-900 border border-neutral-700 relative flex flex-col justify-end overflow-hidden">
      {/* Black bar background (top part is black advantage if empty) */}

      {/* White bar fill (bottom up) */}
      <div
        className="w-full bg-white transition-all duration-700 ease-in-out"
        style={{ height: `${fillPercentage}%` }}
      />

      {/* Eval Text */}
      <div
        className={`absolute top-1 w-full text-center text-[10px] md:text-xs font-bold ${fillPercentage > 90 ? "text-black" : "text-white"} mix-blend-difference z-10`}
      >
        {mate !== null && mate < 0 ? text : null}
      </div>
      <div
        className={`absolute bottom-1 w-full text-center text-[10px] md:text-xs font-bold ${fillPercentage < 10 ? "text-white" : "text-black"} mix-blend-difference z-10`}
      >
        {(mate !== null && mate > 0) || mate === null ? text : null}
      </div>
    </div>
  );
};

export default EvalBar;

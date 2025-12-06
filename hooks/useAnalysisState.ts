import { useState } from "react";
import { AnalysisState } from "../types";

export const useAnalysisState = () => {
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    bestMove: null,
    bestMoveSan: null,
    evaluation: null,
    mate: null,
    continuation: [],
    depth: 0,
    winChance: 50,
  });

  const [isProcessingGame, setIsProcessingGame] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const resetAnalysis = () => {
    setAnalysis({
      isAnalyzing: false,
      bestMove: null,
      bestMoveSan: null,
      evaluation: null,
      mate: null,
      continuation: [],
      depth: 0,
      winChance: 50,
    });
    setIsProcessingGame(false);
    setProcessingProgress(0);
  };

  return {
    analysis,
    setAnalysis,
    isProcessingGame,
    setIsProcessingGame,
    processingProgress,
    setProcessingProgress,
    resetAnalysis,
  };
};

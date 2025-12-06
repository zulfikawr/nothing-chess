import React from "react";
import { User, RefreshCw } from "lucide-react";

interface PlayerInfoProps {
  name: string;
  elo: string;
  color: "w" | "b";
  isActive: boolean;
  isCheckmate: boolean;
  isCheck: boolean;
  isTopPlayer?: boolean;
  onFlip?: () => void;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  name,
  elo,
  color,
  isActive,
  isCheckmate,
  isCheck,
  isTopPlayer = false,
  onFlip,
}) => {
  return (
    <div
      className={`flex justify-between items-${isTopPlayer ? "end" : "start"} px-2 py-1 transition-colors rounded ${isActive ? "bg-neutral-900/50 border border-neutral-800" : "border border-transparent"}`}
    >
      <div className="flex items-center gap-2 text-neutral-300">
        <User size={14} className="opacity-70" />
        <span className="font-bold text-xs md:text-base">{name}</span>
        {elo && (
          <span className="text-[10px] px-1 bg-neutral-800 text-neutral-400 rounded">
            {elo}
          </span>
        )}
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-white animate-pulse ml-1"></div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isCheckmate && (
          <span className="text-nothing-red font-bold text-[10px] animate-pulse">
            CHECKMATE
          </span>
        )}
        {isCheck && !isCheckmate && (
          <span className="text-orange-500 font-bold text-[10px]">CHECK</span>
        )}
        {!isTopPlayer && onFlip && (
          <button
            onClick={onFlip}
            className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-white transition-colors ml-2 uppercase tracking-wider"
          >
            <RefreshCw size={10} /> Flip
          </button>
        )}
      </div>
    </div>
  );
};

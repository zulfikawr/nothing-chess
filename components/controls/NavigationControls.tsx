import React from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { NavButton } from "./NavButton";

interface NavigationControlsProps {
  canGoFirst: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  canGoLast: boolean;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  canGoFirst,
  canGoPrev,
  canGoNext,
  canGoLast,
  onFirst,
  onPrev,
  onNext,
  onLast,
}) => {
  return (
    <div className="flex-none p-2 md:p-4 border-t border-neutral-800 bg-black grid grid-cols-4 gap-2 z-30">
      <NavButton
        icon={<ChevronsLeft size={16} />}
        onClick={onFirst}
        disabled={!canGoFirst}
      />
      <NavButton
        icon={<ChevronLeft size={16} />}
        onClick={onPrev}
        disabled={!canGoPrev}
      />
      <NavButton
        icon={<ChevronRight size={16} />}
        onClick={onNext}
        disabled={!canGoNext}
      />
      <NavButton
        icon={<ChevronsRight size={16} />}
        onClick={onLast}
        disabled={!canGoLast}
      />
    </div>
  );
};

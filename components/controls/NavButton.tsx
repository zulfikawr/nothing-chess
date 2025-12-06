import React, { ReactNode } from "react";

interface NavButtonProps {
  icon: ReactNode;
  onClick: () => void;
  disabled: boolean;
}

export const NavButton: React.FC<NavButtonProps> = ({
  icon,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="h-10 md:h-12 flex justify-center items-center bg-black border border-neutral-800 hover:border-white disabled:opacity-20 disabled:hover:border-neutral-800 disabled:cursor-not-allowed transition-all text-white active:bg-neutral-800"
  >
    {icon}
  </button>
);

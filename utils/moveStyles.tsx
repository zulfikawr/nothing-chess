import React, { ReactNode } from "react";
import {
  Flame,
  Award,
  Star,
  CheckCircle,
  MinusCircle,
  AlertTriangle,
  XCircle,
  Layers,
} from "lucide-react";
import { MoveClassification } from "../types";

export interface MoveStyle {
  color: string;
  icon: ReactNode | null;
  label: string;
}

export const getMoveStyle = (cls?: MoveClassification): MoveStyle => {
  switch (cls) {
    case "brilliant":
      return {
        color: "text-teal-400",
        icon: <Flame size={12} className="text-teal-400" />,
        label: "Brilliant",
      };
    case "great":
      return {
        color: "text-blue-400",
        icon: <Award size={12} className="text-blue-400" />,
        label: "Great",
      };
    case "best":
      return {
        color: "text-green-500",
        icon: <Star size={12} className="text-green-500" />,
        label: "Best",
      };
    case "excellent":
      return {
        color: "text-green-300",
        icon: <CheckCircle size={12} className="text-green-300" />,
        label: "Excellent",
      };
    case "good":
      return { color: "text-neutral-400", icon: null, label: "Good" };
    case "inaccuracy":
      return {
        color: "text-yellow-400",
        icon: <MinusCircle size={12} className="text-yellow-400" />,
        label: "Inaccuracy",
      };
    case "mistake":
      return {
        color: "text-orange-500",
        icon: <AlertTriangle size={12} className="text-orange-500" />,
        label: "Mistake",
      };
    case "blunder":
      return {
        color: "text-nothing-red",
        icon: <XCircle size={12} className="text-nothing-red" />,
        label: "Blunder",
      };
    case "miss":
      return {
        color: "text-pink-500",
        icon: <XCircle size={12} className="text-pink-500" />,
        label: "Miss",
      };
    case "book":
      return {
        color: "text-amber-700",
        icon: <Layers size={12} className="text-amber-700" />,
        label: "Book",
      };
    default:
      return { color: "text-neutral-400", icon: null, label: "" };
  }
};

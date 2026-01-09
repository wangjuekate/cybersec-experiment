import React from "react";
import { motion } from "framer-motion";

type ProgressBarColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: ProgressBarColor;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label = "", 
  color = "blue",
  showPercentage = true,
  animated = true 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses: Record<ProgressBarColor, string> = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
  };

  const bgColorClasses: Record<ProgressBarColor, string> = {
    blue: "bg-blue-200",
    green: "bg-green-200",
    red: "bg-red-200",
    yellow: "bg-yellow-200",
    purple: "bg-purple-200",
    orange: "bg-orange-200",
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2 text-sm font-medium">
          <span>{label}</span>
          {showPercentage && <span>{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full ${bgColorClasses[color]} rounded-full h-4 overflow-hidden`}>
        {animated ? (
          <motion.div
            className={`${colorClasses[color]} h-4 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : (
          <div
            className={`${colorClasses[color]} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}

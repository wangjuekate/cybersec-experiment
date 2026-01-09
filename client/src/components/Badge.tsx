import React from "react";
import { motion } from "framer-motion";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  pulse?: boolean;
}

export function Badge({ 
  children, 
  variant = "default",
  size = "md",
  icon = null,
  pulse = false 
}: BadgeProps) {
  const sizeClasses: Record<BadgeSize, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-gray-200 text-gray-800",
    primary: "bg-blue-100 text-blue-800 border border-blue-300",
    success: "bg-green-100 text-green-800 border border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    danger: "bg-red-100 text-red-800 border border-red-300",
    info: "bg-purple-100 text-purple-800 border border-purple-300",
  };

  const BadgeContent = () => (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${pulse ? 'animate-pulse-slow' : ''}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );

  if (pulse) {
    return (
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <BadgeContent />
      </motion.div>
    );
  }

  return <BadgeContent />;
}

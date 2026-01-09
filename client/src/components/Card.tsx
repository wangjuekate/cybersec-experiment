import React from "react";
import { motion } from "framer-motion";

type CardVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  animate?: boolean;
}

export function Card({ 
  children, 
  className = "", 
  variant = "default",
  hover = true,
  animate = true 
}: CardProps) {
  const variantClasses: Record<CardVariant, string> = {
    default: "bg-white border-2 border-gray-200",
    primary: "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300",
    success: "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300",
    warning: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300",
    danger: "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300",
    info: "bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300",
  };

  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02] transition-all duration-300" : "";

  const cardContent = (
    <div className={`rounded-xl shadow-md p-6 ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}

"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface LuxuryButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary";
  showArrow?: boolean;
  children: React.ReactNode;
}

export default function LuxuryButton({
  variant = "primary",
  showArrow = false,
  children,
  className = "",
  type = "button",
  ...props
}: LuxuryButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      type={type}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group
        relative inline-flex items-center justify-center gap-2.5 
        font-accent text-[15px] tracking-[0.08em] uppercase font-medium
        h-[50px] px-6 rounded-[14px]
        transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer
        ${isPrimary 
          ? "bg-gradient-to-r from-[#E6C280] to-[#DFBA73] text-[#121213] shadow-md hover:shadow-[0_8px_20px_rgba(230,194,128,0.35)] hover:brightness-105 border border-transparent"
          : "bg-transparent text-[#E6C280] border border-[#E6C280]/60 backdrop-blur-[10px] hover:bg-[#E6C280] hover:text-[#121213] hover:border-transparent hover:shadow-[0_8px_20px_rgba(230,194,128,0.25)]"
        }
        ${className}
      `}
      {...props}
    >
      <span>{children}</span>
      {showArrow && (
        <ArrowRight 
          size={14} 
          className="transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 text-current" 
        />
      )}
    </motion.button>
  );
}


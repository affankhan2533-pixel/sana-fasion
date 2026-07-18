"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface LuxuryButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary";
  showArrow?: boolean;
  themeType?: "light" | "dark";
  children: React.ReactNode;
}

export default function LuxuryButton({
  variant = "primary",
  showArrow = false,
  themeType = "light",
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
        font-accent text-[14px] md:text-[15px] tracking-[0.12em] uppercase font-medium
        h-[52px] px-6 md:px-8 rounded-[12px] overflow-hidden
        transition-all duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] cursor-pointer
        ${isPrimary 
          ? "bg-[#E6C280] text-[#121213] shadow-[0_4px_12px_rgba(230,194,128,0.15)] hover:shadow-[0_8px_25px_rgba(230,194,128,0.35)] border border-transparent"
          : themeType === "dark"
            ? "bg-transparent text-[#E6C280] border border-[#E6C280] hover:bg-[#E6C280] hover:text-[#121213] hover:shadow-[0_8px_25px_rgba(230,194,128,0.25)]"
            : "bg-transparent text-[#1C0E05] border border-[#C8851A] hover:bg-[#C8851A] hover:text-[#FFFBF4] hover:shadow-[0_8px_25px_rgba(200,133,26,0.2)]"
        }
        ${className}
      `}
      {...props}
    >
      {/* Luxury shine sweep animation overlay */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1000ms] ease-out pointer-events-none" />
      
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <ArrowRight 
          size={14} 
          className="relative z-10 transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 text-current" 
        />
      )}
    </motion.button>
  );
}


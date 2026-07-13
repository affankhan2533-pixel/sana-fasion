"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface LuxuryButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  themeType?: "light" | "dark";
  children: React.ReactNode;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  variant = "primary",
  loading = false,
  themeType = "light",
  disabled,
  children,
  className = "",
  ...props
}) => {
  // Determine CSS class based on variant and theme
  let baseClass = "";
  if (variant === "primary") {
    baseClass = "btn-luxury-primary";
  } else if (variant === "secondary") {
    baseClass = "btn-luxury-secondary";
    if (themeType === "dark") {
      baseClass += " text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white";
    }
  } else {
    baseClass = "btn-luxury-ghost";
    if (themeType === "dark") {
      baseClass += " text-white/70 hover:text-white";
    }
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`${baseClass} transition-all duration-300 relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? "opacity-70" : "opacity-100"}>{children}</span>
    </motion.button>
  );
};

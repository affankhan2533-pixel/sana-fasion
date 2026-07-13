"use client";

import React from "react";

interface LuxuryDividerProps {
  variant?: "solid" | "gradient" | "ornament";
  className?: string;
}

export const LuxuryDivider: React.FC<LuxuryDividerProps> = ({
  variant = "gradient",
  className = "",
}) => {
  if (variant === "ornament") {
    return (
      <div className={`divider font-accent text-[9px] uppercase tracking-[0.2em] my-8 ${className}`}>
        SANA
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div
        className={`w-full h-[1px] bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent my-6 ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-[1px] bg-border my-6 ${className}`}
    />
  );
};

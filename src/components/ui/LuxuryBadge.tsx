"use client";

import React from "react";

interface LuxuryBadgeProps {
  children: React.ReactNode;
  variant?: "solid" | "outline";
  themeType?: "light" | "dark";
  className?: string;
}

export const LuxuryBadge: React.FC<LuxuryBadgeProps> = ({
  children,
  variant = "solid",
  themeType = "light",
  className = "",
}) => {
  let badgeClass = "badge-vintage ";
  if (variant === "outline") {
    badgeClass = "badge-outline ";
    if (themeType === "dark") {
      badgeClass += "border-white/20 text-white/80 ";
    } else {
      badgeClass += "border-border-strong text-text-muted ";
    }
  } else {
    // solid
    if (themeType === "dark") {
      badgeClass += "bg-white text-ink ";
    } else {
      badgeClass += "bg-accent-gold text-white ";
    }
  }

  return (
    <span className={`${badgeClass} inline-block ${className}`}>
      {children}
    </span>
  );
};

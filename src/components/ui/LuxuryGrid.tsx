"use client";

import React from "react";

interface LuxuryGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40;
  className?: string;
}

export const LuxuryGrid: React.FC<LuxuryGridProps> = ({
  children,
  columns = 3,
  gap = 24,
  className = "",
}) => {
  // Mobile: 4 cols (or auto layout based on children), Tablet: 8 cols (or columns override), Desktop: 12 cols
  // Map Tailwind Gap Classes
  const gapClasses = {
    4: "gap-1",
    8: "gap-2",
    12: "gap-3",
    16: "gap-4",
    20: "gap-5",
    24: "gap-6",
    32: "gap-8",
    40: "gap-10",
  };

  const gapClass = gapClasses[gap] || "gap-6";

  // Map Desktop standard column grids
  let gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  
  if (columns === 1) {
    gridColsClass = "grid-cols-1";
  } else if (columns === 2) {
    gridColsClass = "grid-cols-1 md:grid-cols-2";
  } else if (columns === 4) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  } else if (columns === 6) {
    gridColsClass = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
  } else if (columns === 12) {
    gridColsClass = "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12";
  }

  return (
    <div
      className={`grid w-full ${gridColsClass} ${gapClass} ${className}`}
    >
      {children}
    </div>
  );
};

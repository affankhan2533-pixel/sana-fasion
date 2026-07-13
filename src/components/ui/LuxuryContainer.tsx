"use client";

import React from "react";

interface LuxuryContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const LuxuryContainer: React.FC<LuxuryContainerProps> = ({
  children,
  className = "",
  id,
}) => {
  return (
    <div
      id={id}
      className={`container mx-auto px-4 sm:px-8 lg:px-12 max-w-[1400px] w-full ${className}`}
    >
      {children}
    </div>
  );
};

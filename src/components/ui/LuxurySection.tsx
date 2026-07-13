"use client";

import React from "react";

interface LuxurySectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  themeType?: "light" | "dark" | "warm";
  id?: string;
}

export const LuxurySection: React.FC<LuxurySectionProps> = ({
  children,
  themeType = "light",
  className = "",
  id,
  ...props
}) => {
  let bgClass = "bg-primary-bg text-text-primary";
  if (themeType === "dark") {
    bgClass = "bg-ink text-white";
  } else if (themeType === "warm") {
    bgClass = "bg-secondary-bg text-text-primary";
  }

  return (
    <section
      id={id}
      className={`section py-12 md:py-20 lg:py-32 w-full transition-colors duration-500 relative overflow-hidden ${bgClass} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

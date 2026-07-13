"use client";

import React from "react";
import { motion } from "framer-motion";

interface LuxuryHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  variant?: "display-xl" | "display-l" | "display-m" | "h1" | "h2" | "h3" | "h4" | "h5";
  alignment?: "left" | "center" | "right";
  reveal?: boolean;
  ornament?: boolean;
  className?: string;
}

export const LuxuryHeading: React.FC<LuxuryHeadingProps> = ({
  children,
  level = 2,
  variant,
  alignment = "left",
  reveal = false,
  ornament = false,
  className = "",
}) => {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5";

  // Map variant to typography system classes
  let typographyClass = "";
  const selectedVariant = variant || `h${level}`;
  
  switch (selectedVariant) {
    case "display-xl":
      typographyClass = "text-display-xl";
      break;
    case "display-l":
      typographyClass = "text-display-l";
      break;
    case "display-m":
      typographyClass = "text-display-m";
      break;
    case "h1":
      typographyClass = "text-heading-1";
      break;
    case "h2":
      typographyClass = "text-heading-2";
      break;
    case "h3":
      typographyClass = "text-heading-3";
      break;
    case "h4":
      typographyClass = "text-heading-4";
      break;
    case "h5":
      typographyClass = "text-heading-5";
      break;
    default:
      typographyClass = "text-heading-2";
  }

  // Handle alignment
  const alignClass = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";

  const renderContent = () => {
    if (reveal) {
      return (
        <span className="reveal-wrapper block">
          <motion.span
            initial={{ translateY: "100%" }}
            whileInView={{ translateY: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="reveal-text block"
          >
            {children}
          </motion.span>
        </span>
      );
    }
    return children;
  };

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      <Tag className={`${typographyClass}`}>
        {renderContent()}
      </Tag>
      
      {ornament && alignment === "center" && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-accent-gold" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-accent-gold rotate-45">
            <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-accent-gold" />
        </div>
      )}
      
      {ornament && alignment === "left" && (
        <div className="flex items-center gap-4 mt-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-accent-gold rotate-45">
            <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="h-[1px] w-12 bg-gradient-to-r from-accent-gold to-transparent" />
        </div>
      )}
    </div>
  );
};

"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface LuxuryCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  themeType?: "light" | "dark";
  borderStyle?: "none" | "gold" | "subtle";
  hoverEffect?: "none" | "lift" | "glow";
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  themeType = "light",
  borderStyle = "subtle",
  hoverEffect = "lift",
  className = "",
  ...props
}) => {
  let cardClass = "vintage-card p-6 transition-all duration-300 relative overflow-hidden ";
  
  if (themeType === "dark") {
    cardClass += "bg-charcoal text-white ";
  } else {
    cardClass += "bg-secondary-bg text-text-primary ";
  }

  if (borderStyle === "gold") {
    cardClass += "border border-accent-gold ";
  } else if (borderStyle === "subtle") {
    cardClass += "border border-border ";
  } else {
    cardClass += "border-none ";
  }

  // Define Motion Animations
  const hoverVariants = {
    hover: hoverEffect === "lift" ? {
      y: -8,
      boxShadow: "var(--shadow-lift)",
      borderColor: "var(--accent-gold)"
    } : hoverEffect === "glow" ? {
      boxShadow: "0 0 20px rgba(200, 133, 26, 0.25)"
    } : {}
  };

  return (
    <motion.div
      whileHover="hover"
      variants={hoverVariants}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      className={`${cardClass} ${className}`}
      {...props}
    >
      {/* Soft gradient background gloss */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/[0.02] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

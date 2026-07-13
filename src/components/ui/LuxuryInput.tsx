"use client";

import React, { useId } from "react";

interface LuxuryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

export const LuxuryInput: React.FC<LuxuryInputProps> = ({
  label,
  error,
  success,
  disabled,
  className = "",
  type = "text",
  ...props
}) => {
  const id = useId();

  let borderClass = "border-border-strong";
  let labelColor = "text-text-muted";
  
  if (error) {
    borderClass = "border-error";
    labelColor = "text-error";
  } else if (success) {
    borderClass = "border-success";
    labelColor = "text-success";
  }

  return (
    <div className={`float-label relative w-full mb-6 ${className}`}>
      <input
        id={id}
        type={type}
        disabled={disabled}
        placeholder=" "
        className={`w-full py-3 bg-transparent border-b outline-none transition-all duration-300 ${borderClass} ${
          disabled ? "opacity-50 cursor-not-allowed" : "focus:border-accent-gold"
        }`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 top-3 font-accent text-[10px] tracking-[0.2em] uppercase transition-all duration-300 pointer-events-none ${labelColor}`}
      >
        {label}
      </label>
      {error && (
        <span className="text-[10px] text-error font-body block mt-1 tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
};

'use client';
import React, { forwardRef } from 'react';

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          <select
            ref={ref}
            className={`peer w-full h-[56px] pt-4.5 pb-0.5 px-4 rounded-[12px] border bg-[#FAFAF8] text-[14px] text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm appearance-none cursor-pointer ${
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label
            className="absolute left-4 top-2.5 text-[10px] text-[#9B8E7E] font-bold uppercase tracking-wider pointer-events-none select-none"
          >
            {label}
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9B8E7E]">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1 pl-1">{error}</p>}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;

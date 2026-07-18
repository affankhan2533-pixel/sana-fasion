'use client';
import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          <textarea
            ref={ref}
            placeholder=" "
            className={`peer w-full min-h-[120px] pt-6 pb-2 px-4 rounded-[12px] border bg-[#FAFAF8] text-[14px] text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm placeholder-transparent resize-y ${
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]'
            } ${className}`}
            {...props}
          />
          <label
            className="absolute left-4 text-[13px] text-[#9B8E7E] pointer-events-none transition-all duration-200 select-none
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px]
              peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-[#C8851A] peer-focus:font-semibold
              not-peer-placeholder-shown:top-2.5 not-peer-placeholder-shown:text-[10px] not-peer-placeholder-shown:text-[#9B8E7E] not-peer-placeholder-shown:font-semibold"
          >
            {label}
          </label>
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1 pl-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;

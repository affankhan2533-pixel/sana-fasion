'use client';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8E7E] flex items-center justify-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            placeholder=" "
            className={`peer w-full h-[56px] pt-4.5 pb-0.5 rounded-[12px] border bg-[#FAFAF8] text-[14px] text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm placeholder-transparent ${
              icon ? 'pl-11 pr-4' : 'px-4'
            } ${
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]'
            } ${className}`}
            {...props}
          />
          <label
            className={`absolute text-[13px] text-[#9B8E7E] pointer-events-none transition-all duration-200 select-none
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px]
              peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-[#C8851A] peer-focus:font-semibold
              not-peer-placeholder-shown:top-2.5 not-peer-placeholder-shown:-translate-y-0 not-peer-placeholder-shown:text-[10px] not-peer-placeholder-shown:text-[#9B8E7E] not-peer-placeholder-shown:font-semibold
              ${icon ? 'left-11' : 'left-4'}
            `}
          >
            {label}
          </label>
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1 pl-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

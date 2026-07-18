'use client';
import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

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
            className={cn(
              "peer w-full h-[56px] pt-4.5 pb-0.5 rounded-[12px] border bg-[#FAFAF8] text-[14px] text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm placeholder-transparent",
              icon ? 'pl-11 pr-4' : 'px-4',
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]',
              className
            )}
            {...props}
          />
          <label
            className={cn(
              "absolute text-[13px] text-[#9B8E7E] pointer-events-none transition-all duration-200 select-none",
              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px]",
              "peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-[#C8851A] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider",
              "not-peer-placeholder-shown:top-2.5 not-peer-placeholder-shown:-translate-y-0 not-peer-placeholder-shown:text-[10px] not-peer-placeholder-shown:text-[#9B8E7E] not-peer-placeholder-shown:font-bold not-peer-placeholder-shown:uppercase not-peer-placeholder-shown:tracking-wider",
              icon ? 'left-11' : 'left-4'
            )}
          >
            {label}
          </label>
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1 pl-1 font-semibold">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

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
            className={cn(
              "peer w-full min-h-[120px] pt-6 pb-2 px-4 rounded-[12px] border bg-[#FAFAF8] text-[14px] text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm placeholder-transparent resize-y",
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]',
              className
            )}
            {...props}
          />
          <label
            className={cn(
              "absolute left-4 text-[13px] text-[#9B8E7E] pointer-events-none transition-all duration-200 select-none",
              "peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px]",
              "peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-[#C8851A] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider",
              "not-peer-placeholder-shown:top-2.5 not-peer-placeholder-shown:text-[10px] not-peer-placeholder-shown:text-[#9B8E7E] not-peer-placeholder-shown:font-bold not-peer-placeholder-shown:uppercase not-peer-placeholder-shown:tracking-wider"
            )}
          >
            {label}
          </label>
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1 pl-1 font-semibold">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

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
            className={cn(
              "peer w-full h-[56px] pt-4.5 pb-0.5 px-4 rounded-[12px] border bg-[#FAFAF8] text-[14px] text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm appearance-none cursor-pointer",
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]',
              className
            )}
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
        {error && <p className="text-[11px] text-red-500 mt-1 pl-1 font-semibold">{error}</p>}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Input;

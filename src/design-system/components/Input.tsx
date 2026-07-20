'use client';
import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8E7E] flex items-center justify-center pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            placeholder=" "
            className={cn(
              "peer w-full h-[52px] pt-4.5 pb-1 rounded-[12px] border bg-[#FAFAF8] text-[13px] font-medium text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm placeholder-transparent",
              icon ? 'pl-11 pr-4' : 'px-4',
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]',
              className
            )}
            {...props}
          />
          <label
            className={cn(
              "absolute text-[13px] text-[#9B8E7E] pointer-events-none transition-all duration-200 select-none z-10",
              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px]",
              "peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-[9px] peer-focus:text-[#C8851A] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider",
              "not-peer-placeholder-shown:top-1.5 not-peer-placeholder-shown:-translate-y-0 not-peer-placeholder-shown:text-[9px] not-peer-placeholder-shown:text-[#9B8E7E] not-peer-placeholder-shown:font-bold not-peer-placeholder-shown:uppercase not-peer-placeholder-shown:tracking-wider",
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
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <div className="relative">
          <textarea
            ref={ref}
            placeholder=" "
            className={cn(
              "peer w-full min-h-[120px] pt-6 pb-2 px-4 rounded-[12px] border bg-[#FAFAF8] text-[13px] font-medium text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm placeholder-transparent resize-y",
              error ? 'border-red-400 focus:border-red-500' : 'border-[#E8E2D9]',
              className
            )}
            {...props}
          />
          <label
            className={cn(
              "absolute left-4 text-[13px] text-[#9B8E7E] pointer-events-none transition-all duration-200 select-none z-10",
              "peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px]",
              "peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-[#C8851A] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider",
              "not-peer-placeholder-shown:top-1.5 not-peer-placeholder-shown:text-[9px] not-peer-placeholder-shown:text-[#9B8E7E] not-peer-placeholder-shown:font-bold not-peer-placeholder-shown:uppercase not-peer-placeholder-shown:tracking-wider"
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
  containerClassName?: string;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "peer w-full h-[52px] pt-4.5 pb-1 px-4 rounded-[12px] border bg-[#FAFAF8] text-[13px] font-medium text-[#1C1008] outline-none transition-all duration-200 focus:bg-white focus:border-[#C8851A] focus:shadow-sm appearance-none cursor-pointer",
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
            className="absolute left-4 top-1.5 text-[9px] font-bold text-[#9B8E7E] uppercase tracking-wider pointer-events-none select-none z-10"
          >
            {label}
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9B8E7E] z-10">
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

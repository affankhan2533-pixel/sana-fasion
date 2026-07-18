'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let variantClasses = '';
  switch (variant) {
    case 'secondary':
      variantClasses = 'bg-white border border-[#C8851A]/40 text-[#C8851A] hover:bg-[#FAF8F5] hover:border-[#C8851A]';
      break;
    case 'danger':
      variantClasses = 'bg-white border border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]';
      break;
    case 'primary':
    default:
      variantClasses = 'bg-[#C8851A] text-white hover:bg-[#B07414] border border-transparent';
      break;
  }

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-[12px] text-[13px] font-medium uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:active:scale-100 ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin text-current" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

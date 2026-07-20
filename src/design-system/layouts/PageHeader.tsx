'use client';
import React from 'react';
import { cn } from '../utils/cn';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions, className = '', ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex justify-between items-start gap-4 border-b border-[#E6C280]/20 pb-4 mb-6", className)} {...props}>
      <div className="space-y-0.5 min-w-0 flex-1">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#1C1008] font-serif leading-tight animate-fade-in" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {title}
        </h1>
        {subtitle && <p className="text-[11px] sm:text-[12px] text-[#9B8E7E] font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">{actions}</div>}
    </div>
  );
}

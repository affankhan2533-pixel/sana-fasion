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
    <div className={cn("flex justify-between items-center border-b border-[#E6C280]/20 pb-4 mb-6", className)} {...props}>
      <div className="space-y-1">
        <h1 className="text-[26px] font-semibold text-[#1C1008] font-serif leading-tight animate-fade-in" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {title}
        </h1>
        {subtitle && <p className="text-[12px] text-[#9B8E7E] font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

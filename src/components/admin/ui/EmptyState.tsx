'use client';
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="bg-white border border-[#E6C280]/15 rounded-[12px] p-8 text-center flex flex-col items-center justify-center gap-4 text-[#9B8E7E] shadow-sm max-w-md mx-auto animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-amber-50/50 flex items-center justify-center text-[#C8851A] mb-1">
        {icon}
      </div>
      <h3 className="text-[17px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        {title}
      </h3>
      <p className="text-[12px] text-[#9B8E7E] leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
      {children && <div className="flex flex-col gap-2 w-full pt-2">{children}</div>}
    </div>
  );
}

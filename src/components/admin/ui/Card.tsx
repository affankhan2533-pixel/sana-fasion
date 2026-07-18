'use client';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#E6C280]/15 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

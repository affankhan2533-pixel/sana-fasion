'use client';
import React from 'react';
import { cn } from '../utils/cn';

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'desktop' | 'form' | 'full';
}

export default function PageLayout({ children, maxWidth = 'desktop', className = '', ...props }: PageLayoutProps) {
  let widthClass = 'max-w-[1600px]';
  if (maxWidth === 'form') {
    widthClass = 'max-w-[1000px]';
  } else if (maxWidth === 'full') {
    widthClass = 'max-w-none';
  }

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-10 lg:py-8 pb-28 md:pb-12",
        widthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

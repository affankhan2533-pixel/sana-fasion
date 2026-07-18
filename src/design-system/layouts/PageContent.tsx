'use client';
import React from 'react';
import { cn } from '../utils/cn';

interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 10 | 12;
}

export default function PageContent({ children, columns = 1, className = '', ...props }: PageContentProps) {
  let gridClass = 'space-y-6';
  if (columns === 2) {
    gridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6';
  } else if (columns === 10) {
    gridClass = 'grid grid-cols-1 lg:grid-cols-10 gap-8';
  } else if (columns === 12) {
    gridClass = 'grid grid-cols-1 lg:grid-cols-12 gap-8';
  }

  return (
    <div className={cn(gridClass, className)} {...props}>
      {children}
    </div>
  );
}

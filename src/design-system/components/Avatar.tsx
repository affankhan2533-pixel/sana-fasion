'use client';
import React from 'react';
import { cn } from '../utils/cn';

interface AvatarProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ name, role, size = 'md', className = '' }: AvatarProps) {
  const initial = name?.charAt(0).toUpperCase() || 'A';
  let sizeClasses = 'w-8 h-8 text-[12px]';
  if (size === 'sm') sizeClasses = 'w-6 h-6 text-[10px]';
  if (size === 'lg') sizeClasses = 'w-10 h-10 text-[13px]';

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-[#C8851A] bg-amber-50 border border-[#E6C280]/20 flex-shrink-0 select-none",
        sizeClasses,
        className
      )}
    >
      {initial}
    </div>
  );
}

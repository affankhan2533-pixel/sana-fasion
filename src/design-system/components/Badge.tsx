'use client';
import React from 'react';
import { cn } from '../utils/cn';
import { badgeVariants, type BadgeType } from '../utils/variants';

interface BadgeProps {
  type: BadgeType;
  label?: string;
  className?: string;
}

export default function Badge({ type, label, className = '' }: BadgeProps) {
  let defaultLabel = "";
  switch (type) {
    case 'in_stock':
      defaultLabel = 'In Stock';
      break;
    case 'published':
      defaultLabel = 'Published';
      break;
    case 'resolved':
      defaultLabel = 'Resolved';
      break;
    case 'out_of_stock':
      defaultLabel = 'Out of Stock';
      break;
    case 'archived':
      defaultLabel = 'Archived';
      break;
    case 'featured':
      defaultLabel = 'Featured';
      break;
    case 'new':
      defaultLabel = 'New';
      break;
    case 'draft':
    default:
      defaultLabel = 'Draft';
      break;
  }

  const displayLabel = label || defaultLabel;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider",
      badgeVariants[type] || badgeVariants.draft,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {displayLabel}
    </span>
  );
}
export type { BadgeProps };

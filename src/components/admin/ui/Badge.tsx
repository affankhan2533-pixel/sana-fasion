'use client';
import React from 'react';

interface BadgeProps {
  type: 'in_stock' | 'out_of_stock' | 'featured' | 'draft' | 'published' | 'archived' | 'new' | 'resolved';
  label?: string;
  className?: string;
}

export default function Badge({ type, label, className = '' }: BadgeProps) {
  let classes = "";
  let defaultLabel = "";

  switch (type) {
    case 'in_stock':
    case 'published':
    case 'resolved':
      classes = "bg-emerald-50 text-emerald-700 border border-emerald-100/50";
      defaultLabel = type === 'in_stock' ? 'In Stock' : type === 'published' ? 'Published' : 'Resolved';
      break;
    case 'out_of_stock':
    case 'archived':
      classes = "bg-red-50 text-red-700 border border-red-100/50";
      defaultLabel = type === 'out_of_stock' ? 'Out of Stock' : 'Archived';
      break;
    case 'featured':
    case 'new':
      classes = "bg-amber-50/70 text-[#C8851A] border border-[#E6C280]/25";
      defaultLabel = type === 'featured' ? 'Featured' : 'New';
      break;
    case 'draft':
    default:
      classes = "bg-gray-50 text-gray-600 border border-gray-200";
      defaultLabel = "Draft";
      break;
  }

  const displayLabel = label || defaultLabel;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${classes} ${className}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {displayLabel}
    </span>
  );
}

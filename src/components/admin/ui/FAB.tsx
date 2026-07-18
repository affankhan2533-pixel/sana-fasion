'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface FABProps {
  href: string;
  label?: string;
  icon?: React.ReactNode;
}

export default function FAB({ href, label = 'Add Product', icon = <Plus size={24} strokeWidth={2.5} /> }: FABProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMobileClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setIsExpanded(true);
      setTimeout(() => setIsExpanded(false), 3000); // collapse after 3 seconds
    }
  };

  return (
    <>
      {/* Desktop FAB (Pill shaped by default) */}
      <Link href={href} className="hidden md:block">
        <button className="fixed bottom-10 right-10 h-[52px] px-6 rounded-full bg-[#C8851A] hover:bg-[#B07414] active:scale-95 text-white shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl z-40 text-[13px] font-bold uppercase tracking-wider">
          <span className="flex-shrink-0"><Plus size={16} strokeWidth={2.5} /></span>
          <span>{label}</span>
        </button>
      </Link>

      {/* Mobile FAB (Expandable circular trigger) */}
      <Link href={href} className="md:hidden">
        <button
          onClick={handleMobileClick}
          className={`fixed bottom-20 right-5 h-14 rounded-full bg-[#C8851A] active:bg-[#B07414] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all duration-300 z-40 overflow-hidden ${
            isExpanded ? 'w-36 px-4' : 'w-14'
          }`}
        >
          <span className="flex-shrink-0">{icon}</span>
          {isExpanded && (
            <span className="text-[11px] font-bold uppercase tracking-wider ml-1.5 whitespace-nowrap">
              {label}
            </span>
          )}
        </button>
      </Link>
    </>
  );
}

'use client';
import React, { useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Modal Container */}
      <div className="fixed bottom-0 inset-x-0 bg-[#FAF6F0] border-t border-[#E6C280]/20 rounded-t-[24px] shadow-[0_-8px_32px_rgba(0,0,0,0.12)] max-h-[90vh] overflow-y-auto z-50 pb-8 animate-slide-up">
        {/* Apple Maps Drag Handle */}
        <div className="h-7 flex items-center justify-center cursor-pointer select-none" onClick={onClose}>
          <div className="w-11 h-1 bg-[#E6DCCF] rounded-full" />
        </div>
        
        {children}
      </div>
    </>
  );
}
export type { BottomSheetProps };

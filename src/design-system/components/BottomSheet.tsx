'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9990] transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Container: Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div 
        className="fixed z-[9991] bg-[#FAF6F0] border-t md:border border-[#E6C280]/30 shadow-[0_-8px_32px_rgba(0,0,0,0.18)] transition-all duration-300 animate-slide-up
          bottom-0 inset-x-0 rounded-t-[28px] max-h-[85vh] overflow-y-auto pb-24 px-1
          md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full md:rounded-2xl md:max-h-[85vh] md:pb-6 md:px-0"
      >
        {/* Header bar / Drag handle & Close Button */}
        <div className="sticky top-0 bg-[#FAF6F0] pt-3 pb-2 px-4 flex items-center justify-between z-20 border-b border-[#E6C280]/10 rounded-t-[28px] md:rounded-t-2xl">
          <div className="w-7" />
          <div className="w-12 h-1 bg-[#E6DCCF] rounded-full cursor-pointer" onClick={onClose} />
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-full bg-white border border-[#E6C280]/20 flex items-center justify-center text-[#6B5E4C] hover:bg-[#FAF6F0] hover:text-[#1C1008] transition-colors cursor-pointer shadow-xs active:scale-95"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
        
        <div className="p-4 sm:p-5">
          {children}
        </div>
      </div>
    </>
  );
}
export type { BottomSheetProps };

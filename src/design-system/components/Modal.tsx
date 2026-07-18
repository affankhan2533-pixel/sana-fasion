'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Dialog Card */}
      <div className={cn(
        "relative bg-white border border-[#E6C280]/20 rounded-[16px] shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 p-6 animate-fade-in space-y-4",
        className
      )}>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-3">
          {title ? (
            <h3 className="text-[18px] font-bold text-[#1C1008] font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="text-[#9B8E7E] hover:text-[#1C1008] active:scale-90 transition-transform cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

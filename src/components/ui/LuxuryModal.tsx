"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LuxuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
}

export const LuxuryModal: React.FC<LuxuryModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof window === "undefined") return null;

  let sizeClass = "max-w-md";
  if (size === "sm") {
    sizeClass = "max-w-sm";
  } else if (size === "lg") {
    sizeClass = "max-w-2xl";
  } else if (size === "full") {
    sizeClass = "max-w-full h-full";
  }

  const modalRoot = document.body;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-overlay backdrop-blur-sm"
          />

          {/* Modal content dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "luxury-modal-title" : undefined}
            className={`w-full bg-cream-warm border border-border rounded-sm shadow-lift relative z-10 overflow-hidden flex flex-col ${sizeClass}`}
          >
            {/* Ornament borders */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold to-transparent" />

            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              {title ? (
                <h3
                  id="luxury-modal-title"
                  className="font-display text-lg font-medium text-text-primary"
                >
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="text-text-muted hover:text-accent-gold transition-colors p-1"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh] flex-grow font-body text-sm text-text-secondary leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

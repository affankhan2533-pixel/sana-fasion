"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const containerExists = document.querySelector(".preloader-container");
    const logoExists = document.querySelector(".preloader-logo");

    if (!containerExists || !logoExists) return;

    // 1. Progress count animation
    const countObj = { value: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        // Exit animation
        if (document.querySelector(".preloader-container")) {
          gsap.to(".preloader-container", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
              setVisible(false);
              onComplete();
            }
          });
        }
      }
    });

    timeline.to(countObj, {
      value: 100,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        setProgress(Math.floor(countObj.value));
      }
    });

    // Subtle scale in of the logo
    gsap.fromTo(".preloader-logo",
      { letterSpacing: "0.2em", opacity: 0, scale: 0.96 },
      { letterSpacing: "0.45em", opacity: 1, scale: 1, duration: 1.8, ease: "power3.out" }
    );

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div 
      className="preloader-container fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-ink"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Monogram / Title */}
        <h1 
          className="preloader-logo font-display text-4xl sm:text-5xl font-light text-white tracking-[0.45em] mb-4"
          style={{ color: "var(--cream)" }}
        >
          SANA
        </h1>
        
        {/* Atelier subtitle */}
        <span 
          className="font-accent text-[9px] tracking-[0.25em] uppercase text-accent-gold opacity-80"
        >
          Bespoke Heritage Atelier
        </span>

        {/* Custom Progress bar */}
        <div className="w-48 h-[1px] bg-white/10 mt-8 relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-accent-gold transition-all duration-100 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter */}
        <span 
          className="font-accent text-[10px] tracking-[0.2em] text-white/50 mt-4"
        >
          {progress}%
        </span>
      </div>

      {/* Decorative corner lines inside loading screen */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/5 pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/5 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/5 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/5 pointer-events-none" />
    </div>
  );
}

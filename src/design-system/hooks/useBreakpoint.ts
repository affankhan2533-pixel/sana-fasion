'use client';
import { useState, useEffect } from 'react';

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setBreakpoint({
        isMobile: w <= 768,
        isTablet: w > 768 && w <= 1024,
        isDesktop: w > 1024,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export default useBreakpoint;

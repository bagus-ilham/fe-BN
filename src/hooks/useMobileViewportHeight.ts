'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Optimized hook to get viewport height at load time
 * and keep it fixed to avoid layout shift in In-App Browsers (Instagram, Facebook, etc.)
 * 
 * Height is measured once upon mounting and only updated if the width changes (device rotation),
 * ignoring height changes caused by navigation bars that appear/disappear.
 */
export function useMobileViewportHeight(): number | null {
  const [height, setHeight] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    return window.innerHeight;
  });
  const widthRef = useRef<number | null>(null);

  // Memoize resize handler
  const handleResize = useCallback(() => {
    const currentWidth = window.innerWidth;
    
    // If width changed (rotation), update height
    // If only height changed (Instagram bars), ignore
    if (widthRef.current !== null && currentWidth !== widthRef.current) {
      setHeight(window.innerHeight);
      widthRef.current = currentWidth;
    }
    // If only height changed, do nothing (maintain original height)
  }, []);

  useEffect(() => {
    // Simpan width awal untuk deteksi rotasi (perubahan width)
    widthRef.current = window.innerWidth;

    // Listener only for WIDTH changes (device rotation)
    // Use passive listener for better performance
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]); // Include handleResize in dependencies

  return height;
}

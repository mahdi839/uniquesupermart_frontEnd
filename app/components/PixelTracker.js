'use client'

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PixelTracker() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // layout.js already fires PageView on first load via the official pixel snippet.
    // Only track subsequent client-side route changes here.
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
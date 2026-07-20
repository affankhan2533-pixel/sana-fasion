'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track non-admin public page views automatically
    if (pathname && !pathname.startsWith('/admin')) {
      axios.post(`${API_BASE}/analytics/track`, { path: pathname }).catch(() => {});
    }
  }, [pathname]);

  return null;
}

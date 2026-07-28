'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getApiBaseUrl } from '@/lib/apiConfig';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track non-admin public page views automatically
    if (pathname && !pathname.startsWith('/admin')) {
      axios.post(`${getApiBaseUrl()}/analytics/track`, { path: pathname }).catch(() => {});
    }
  }, [pathname]);

  return null;
}

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastRecordedPath = useRef<string>('');

  useEffect(() => {
    // Do not track admin panels or backend api routes
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // Avoid duplicate immediate hits on same route within short time
    if (lastRecordedPath.current === pathname) {
      return;
    }
    lastRecordedPath.current = pathname;

    try {
      // Get or create persistent anonymous visitor ID
      let visitorId = localStorage.getItem('faroha_visitor_id');
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem('faroha_visitor_id', visitorId);
      }

      // Send beacon or fetch asynchronously
      fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          path: pathname,
        }),
      }).catch(() => {
        // silent fail
      });
    } catch (e) {
      // ignore storage errors
    }
  }, [pathname]);

  return null;
}

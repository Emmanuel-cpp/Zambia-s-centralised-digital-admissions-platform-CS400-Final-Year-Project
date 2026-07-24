'use client';

import * as React from 'react';
import { api } from '@/lib/api';

export interface PlatformStats {
  students:           number;
  applications:       number;
  institutions:       number;
  institutions_open:  number;
  programmes:         number;
  provinces:          number;
  documents_verified: number;
}

/**
 * Live platform statistics for public pages.
 * Returns null while loading or on failure, so callers can hide
 * the figures rather than render a misleading zero.
 */
export function useStats() {
  const [stats, setStats] = React.useState<PlatformStats | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.get<PlatformStats>('/stats');
        if (!cancelled) setStats(data);
      } catch {
        /* leave null — callers render nothing */
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return stats;
}
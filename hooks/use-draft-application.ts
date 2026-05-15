'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApplicationDraft } from '@/lib/schemas/application';

const KEY_PREFIX = 'zamadmit:application-draft:';

function key(programmeSlug: string) {
  return `${KEY_PREFIX}${programmeSlug}`;
}

/**
 * useDraftApplication — persists a partial application form to localStorage.
 *
 * Why localStorage?
 *   1. Survives page reloads, tab close, browser restart
 *   2. Lets us defer real "save draft" backend work to Phase 4
 *   3. When Laravel API is ready, swap out load/save/clear with API calls.
 *      The component contract (draft, update, save, clear) stays the same.
 */
export function useDraftApplication(programmeSlug: string) {
  const [draft, setDraft] = useState<ApplicationDraft | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after first mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key(programmeSlug));
      if (raw) setDraft(JSON.parse(raw));
    } catch {
      // ignore JSON parse errors
    }
    setHydrated(true);
  }, [programmeSlug]);

  /** Merge a partial update into the draft and persist */
  const update = useCallback((patch: Partial<ApplicationDraft>) => {
    setDraft(prev => {
      const next: ApplicationDraft = {
        ...(prev ?? { programmeId: '' }),
        ...patch,
      };
      try {
        localStorage.setItem(key(programmeSlug), JSON.stringify(next));
      } catch {
        // localStorage might be full or disabled — fail silently
      }
      return next;
    });
  }, [programmeSlug]);

  /** Discard the draft entirely */
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key(programmeSlug));
    } catch { /* noop */ }
    setDraft(null);
  }, [programmeSlug]);

  return { draft, update, clear, hydrated };
}

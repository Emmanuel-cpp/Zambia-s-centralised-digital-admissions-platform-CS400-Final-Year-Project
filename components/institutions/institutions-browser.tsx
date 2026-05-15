'use client';

import * as React from 'react';
import { SlidersHorizontal, X, SearchX } from 'lucide-react';
import { InstitutionCard } from '@/components/shared/institution-card';
import { Button } from '@/components/ui/button';
import {
  InstitutionFilterPanel, DEFAULT_FILTERS,
  type InstitutionFilters,
} from './institution-filter-panel';
import type { Institution } from '@/types/domain';
import { cn } from '@/lib/utils';

interface Props {
  institutions: Institution[];
}

export function InstitutionsBrowser({ institutions }: Props) {
  const [filters, setFilters] = React.useState<InstitutionFilters>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const provinces = React.useMemo(() => {
    return Array.from(new Set(institutions.map(i => i.province))).sort();
  }, [institutions]);

  const filtered = React.useMemo(() => {
    return institutions.filter(inst => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const haystack = `${inst.name} ${inst.shortName} ${inst.city}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.status === 'open' && !inst.isAcceptingApplications) return false;
      if (filters.status === 'closed' && inst.isAcceptingApplications) return false;
      if (filters.type !== 'all' && inst.type !== filters.type) return false;
      if (filters.province !== 'all' && inst.province !== filters.province) return false;
      return true;
    });
  }, [institutions, filters]);

  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
      <aside className="hidden lg:block sticky top-24 self-start">
        <InstitutionFilterPanel
          filters={filters} onChange={setFilters}
          provinces={provinces} resultCount={filtered.length}
        />
      </aside>

      <main>
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-ink-50">
            <strong className="text-ink">{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'institution' : 'institutions'}
          </p>
          <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)} className="gap-2">
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState onReset={() => setFilters(DEFAULT_FILTERS)} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(inst => (
              <InstitutionCard key={inst.id} institution={inst} />
            ))}
          </div>
        )}
      </main>

      <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <InstitutionFilterPanel
          filters={filters} onChange={setFilters}
          provinces={provinces} resultCount={filtered.length}
        />
        <div className="mt-6 pt-5 border-t border-border">
          <Button variant="primary" size="lg" className="w-full" onClick={() => setDrawerOpen(false)}>
            Show {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </Button>
        </div>
      </MobileFilterDrawer>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-12 text-center">
      <div className="grid place-items-center size-12 rounded-full bg-white border border-border mx-auto mb-4">
        <SearchX className="size-5 text-ink-50" />
      </div>
      <h3 className="font-display text-xl text-ink">No institutions match your filters</h3>
      <p className="mt-2 text-sm text-ink-50 max-w-sm mx-auto">
        Try removing one or more filters, or clear them all to see every institution on ZamAdmit.
      </p>
      <Button variant="outline" onClick={onReset} className="mt-6">Clear all filters</Button>
    </div>
  );
}

function MobileFilterDrawer({
  open, onClose, children,
}: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <aside
        role="dialog" aria-modal="true" aria-label="Filter institutions"
        className={cn(
          'absolute right-0 top-0 bottom-0 w-[88%] max-w-[400px] bg-white shadow-elevate flex flex-col',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <h2 className="font-display text-lg text-ink">Filters</h2>
          <button
            type="button" aria-label="Close filters" onClick={onClose}
            className="grid place-items-center size-10 rounded-full bg-ink-5 text-ink hover:bg-ink-10"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}

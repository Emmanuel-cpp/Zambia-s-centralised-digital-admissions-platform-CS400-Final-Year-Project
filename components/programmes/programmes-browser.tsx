'use client';

import * as React from 'react';
import { SlidersHorizontal, X, SearchX, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ProgrammeFilterPanel, DEFAULT_PROGRAMME_FILTERS,
  type ProgrammeFilters,
} from './programme-filter-panel';
import { ROUTES } from '@/lib/routes';
import type { Programme, Institution } from '@/types/domain';
import { cn } from '@/lib/utils';

interface Props {
  programmes: Programme[];
  institutionsById: Record<string, Institution>;
}

export function ProgrammesBrowser({ programmes, institutionsById }: Props) {
  const [filters, setFilters] = React.useState<ProgrammeFilters>(DEFAULT_PROGRAMME_FILTERS);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const faculties = React.useMemo(() => {
    return Array.from(new Set(programmes.map(p => p.faculty))).sort();
  }, [programmes]);

  const filtered = React.useMemo(() => {
    return programmes.filter(p => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const inst = institutionsById[p.institutionId];
        const haystack = `${p.name} ${p.faculty} ${inst?.name ?? ''} ${inst?.shortName ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.qualification !== 'all' && p.qualification !== filters.qualification) return false;
      if (filters.studyMode !== 'all' && p.studyMode !== filters.studyMode) return false;
      if (filters.faculty !== 'all' && p.faculty !== filters.faculty) return false;
      return true;
    });
  }, [programmes, filters, institutionsById]);

  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
      <aside className="hidden lg:block sticky top-24 self-start">
        <ProgrammeFilterPanel
          filters={filters} onChange={setFilters}
          faculties={faculties} resultCount={filtered.length}
        />
      </aside>

      <main>
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-ink-50">
            <strong className="text-ink">{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'programme' : 'programmes'}
          </p>
          <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)} className="gap-2">
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState onReset={() => setFilters(DEFAULT_PROGRAMME_FILTERS)} />
        ) : (
          <div className="space-y-3">
            {filtered.map(p => {
              const inst = institutionsById[p.institutionId];
              return <ProgrammeRow key={p.id} programme={p} institution={inst} />;
            })}
          </div>
        )}
      </main>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ProgrammeFilterPanel
          filters={filters} onChange={setFilters}
          faculties={faculties} resultCount={filtered.length}
        />
        <div className="mt-6 pt-5 border-t border-border">
          <Button variant="primary" size="lg" className="w-full" onClick={() => setDrawerOpen(false)}>
            Show {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </Button>
        </div>
      </MobileDrawer>
    </div>
  );
}

function ProgrammeRow({
  programme, institution,
}: { programme: Programme; institution?: Institution }) {
  return (
    <Link
      href={ROUTES.programme(programme.slug)}
      className="block p-5 rounded-lg border border-border bg-white hover:border-brand-200 hover:shadow-card transition-all group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">
              {programme.qualification}
            </span>
            <span className="text-xs text-ink-50">{programme.faculty}</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl text-ink leading-tight group-hover:text-brand-700 transition-colors">
            {programme.name}
          </h3>
          {institution && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-50">
              <MapPin className="size-3.5 text-ink-30" />
              {institution.name} · {institution.city}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-50">
            <span>{programme.durationYears} years</span>
            <span>·</span>
            <span>{programme.studyMode}</span>
            <span>·</span>
            <span>Intake {programme.intake}</span>
          </div>
        </div>

        <div className="flex sm:flex-col sm:items-end gap-2 sm:gap-1.5 sm:min-w-[120px] sm:text-right">
          {programme.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-[10px] font-semibold text-ink-50 bg-ink-5 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-12 text-center">
      <div className="grid place-items-center size-12 rounded-full bg-white border border-border mx-auto mb-4">
        <SearchX className="size-5 text-ink-50" />
      </div>
      <h3 className="font-display text-xl text-ink">No programmes match your filters</h3>
      <p className="mt-2 text-sm text-ink-50 max-w-sm mx-auto">
        Try removing one or more filters, or clear them all to see every programme on ZamAdmit.
      </p>
      <Button variant="outline" onClick={onReset} className="mt-6">Clear all filters</Button>
    </div>
  );
}

function MobileDrawer({
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
        role="dialog" aria-modal="true"
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

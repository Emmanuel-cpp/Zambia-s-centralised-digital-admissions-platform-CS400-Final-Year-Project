'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ProgrammeFilters {
  search:        string;
  qualification: 'all' | 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'PhD';
  studyMode:     'all' | 'Full-time' | 'Part-time' | 'Distance';
  faculty:       string;
}

export const DEFAULT_PROGRAMME_FILTERS: ProgrammeFilters = {
  search: '', qualification: 'all', studyMode: 'all', faculty: 'all',
};

interface Props {
  filters: ProgrammeFilters;
  onChange: (next: ProgrammeFilters) => void;
  faculties: string[];
  resultCount: number;
}

export function ProgrammeFilterPanel({ filters, onChange, faculties, resultCount }: Props) {
  const isFiltered = filters.search !== ''
    || filters.qualification !== 'all'
    || filters.studyMode !== 'all'
    || filters.faculty !== 'all';

  function update<K extends keyof ProgrammeFilters>(key: K, value: ProgrammeFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="prog-search" className="block text-sm font-semibold text-ink mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-30" />
          <Input
            id="prog-search" type="text" value={filters.search}
            onChange={e => update('search', e.target.value)}
            placeholder="Programme name or institution…"
            className="pl-9 pr-9"
          />
          {filters.search && (
            <button
              type="button" onClick={() => update('search', '')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-6 rounded-full text-ink-30 hover:bg-ink-5 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <Group label="Qualification level">
        <Chips
          options={[
            { value: 'all',         label: 'All' },
            { value: 'Certificate', label: 'Certificate' },
            { value: 'Diploma',     label: 'Diploma' },
            { value: 'Bachelor',    label: 'Bachelor' },
            { value: 'Master',      label: 'Master' },
          ]}
          value={filters.qualification}
          onChange={v => update('qualification', v as ProgrammeFilters['qualification'])}
        />
      </Group>

      <Group label="Study mode">
        <Chips
          options={[
            { value: 'all',       label: 'All' },
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Distance',  label: 'Distance' },
          ]}
          value={filters.studyMode}
          onChange={v => update('studyMode', v as ProgrammeFilters['studyMode'])}
        />
      </Group>

      <Group label="Faculty">
        <select
          value={filters.faculty}
          onChange={e => update('faculty', e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
        >
          <option value="all">All faculties</option>
          {faculties.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Group>

      <div className="pt-4 border-t border-border space-y-3">
        <p className="text-xs text-ink-50">
          <strong className="text-ink">{resultCount}</strong>{' '}
          {resultCount === 1 ? 'programme' : 'programmes'} found
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_PROGRAMME_FILTERS)}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink mb-2">{label}</p>
      {children}
    </div>
  );
}

function Chips({
  options, value, onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors',
            value === opt.value
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-ink-70 border-border hover:border-brand-300 hover:text-ink',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

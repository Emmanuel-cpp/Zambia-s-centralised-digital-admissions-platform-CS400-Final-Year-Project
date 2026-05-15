'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface InstitutionFilters {
  search:   string;
  status:   'all' | 'open' | 'closed';
  type:     'all' | 'public' | 'private';
  province: string;
}

export const DEFAULT_FILTERS: InstitutionFilters = {
  search: '', status: 'all', type: 'all', province: 'all',
};

interface Props {
  filters: InstitutionFilters;
  onChange: (next: InstitutionFilters) => void;
  provinces: string[];
  resultCount: number;
}

export function InstitutionFilterPanel({ filters, onChange, provinces, resultCount }: Props) {
  const isFiltered = filters.search !== ''
    || filters.status !== 'all' || filters.type !== 'all' || filters.province !== 'all';

  function update<K extends keyof InstitutionFilters>(key: K, value: InstitutionFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="search" className="block text-sm font-semibold text-ink mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-30" />
          <Input
            id="search" type="text" value={filters.search}
            onChange={e => update('search', e.target.value)}
            placeholder="Institution name…"
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

      <FilterGroup label="Admission status">
        <FilterChips
          options={[
            { value: 'all', label: 'All' },
            { value: 'open', label: 'Open now' },
            { value: 'closed', label: 'Closed' },
          ]}
          value={filters.status}
          onChange={v => update('status', v as InstitutionFilters['status'])}
        />
      </FilterGroup>

      <FilterGroup label="Institution type">
        <FilterChips
          options={[
            { value: 'all', label: 'All' },
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]}
          value={filters.type}
          onChange={v => update('type', v as InstitutionFilters['type'])}
        />
      </FilterGroup>

      <FilterGroup label="Province">
        <select
          value={filters.province}
          onChange={e => update('province', e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
        >
          <option value="all">All provinces</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </FilterGroup>

      <div className="pt-4 border-t border-border space-y-3">
        <p className="text-xs text-ink-50">
          <strong className="text-ink">{resultCount}</strong>{' '}
          {resultCount === 1 ? 'institution' : 'institutions'} found
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink mb-2">{label}</p>
      {children}
    </div>
  );
}

function FilterChips({
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

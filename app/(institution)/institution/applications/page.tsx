'use client';

import * as React from 'react';
import { Search, Download, X, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IncomingApplicationRow } from '@/components/institution-admin/incoming-application-row';
import { getIncomingApplications, getAdminProgrammes } from '@/lib/data';
import type { ApplicationStatus, IncomingApplication } from '@/types/domain';

type StatusFilter = 'all' | ApplicationStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',          label: 'All statuses' },
  { value: 'submitted',    label: 'Submitted' },
  { value: 'under_review', label: 'Under review' },
  { value: 'accepted',     label: 'Accepted' },
  { value: 'rejected',     label: 'Rejected' },
  { value: 'waitlisted',   label: 'Waitlisted' },
];

export default function InstitutionApplicationsPage() {
  const allApps   = React.useMemo(() => getIncomingApplications(), []);
  const programmes = React.useMemo(() => getAdminProgrammes(), []);

  const [search,      setSearch]      = React.useState('');
  const [status,      setStatus]      = React.useState<StatusFilter>('all');
  const [programmeId, setProgrammeId] = React.useState('all');

  const filtered: IncomingApplication[] = React.useMemo(() => allApps.filter(app => {
    if (status !== 'all' && app.status !== status) return false;
    if (programmeId !== 'all' && app.programmeId !== programmeId) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const hay = `${app.applicant.fullName} ${app.applicant.email} ${app.applicant.nrc} ${app.programmeName}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [allApps, search, status, programmeId]);

  const isFiltered = search !== '' || status !== 'all' || programmeId !== 'all';

  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="All applications"
        description={`${allApps.length} total applications received this cycle`}
        actions={
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
        }
      />

      {/* Filters */}
      <div className="rounded-xl border border-border bg-white p-4 mb-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-30" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, NRC, programme…"
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button" onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-6 rounded-full text-ink-30 hover:bg-ink-5"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <select
            value={status}
            onChange={e => setStatus(e.target.value as StatusFilter)}
            className="h-10 rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={programmeId}
            onChange={e => setProgrammeId(e.target.value)}
            className="h-10 rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
          >
            <option value="all">All programmes</option>
            {programmes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <p className="text-xs text-ink-50">
            <strong className="text-ink">{filtered.length}</strong> of {allApps.length} applications
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStatus('all'); setProgrammeId('all'); }}
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <SlidersHorizontal className="size-7 text-ink-30 mx-auto mb-3" />
          <p className="font-display text-xl text-ink">No applications match</p>
          <p className="text-sm text-ink-50 mt-2">Try adjusting or clearing the filters.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          {filtered.map(app => (
            <IncomingApplicationRow key={app.id} application={app} />
          ))}
        </div>
      )}
    </>
  );
}

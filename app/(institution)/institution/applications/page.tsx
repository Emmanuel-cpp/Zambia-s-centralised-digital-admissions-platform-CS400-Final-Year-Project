'use client';

import * as React from 'react';
import { Search, Download, X, SlidersHorizontal, Loader2, AlertCircle, ArrowDownWideNarrow } from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IncomingApplicationRow } from '@/components/institution-admin/incoming-application-row';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { IncomingApplication, ApplicationStatus } from '@/types/domain';

type StatusFilter = 'all' | ApplicationStatus;
type SortMode = 'newest' | 'match';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',          label: 'All statuses' },
  { value: 'submitted',    label: 'Submitted' },
  { value: 'under_review', label: 'Under review' },
  { value: 'accepted',     label: 'Accepted' },
  { value: 'rejected',     label: 'Rejected' },
  { value: 'waitlisted',   label: 'Waitlisted' },
];

/**
 * Shape returned by Laravel /api/admin/applications
 */
interface ApiAdminApplication {
  id: number;
  status: ApplicationStatus;
  personal_statement: string | null;
  submitted_at: string | null;
  decision_at:  string | null;
  match_score:  number | null;
  user: {
    id:         number;
    first_name: string;
    last_name:  string;
    full_name:  string;
    email:      string;
    nrc:        string | null;
    phone:      string | null;
    province:   string | null;
  };
  programme: {
    id:   number;
    name: string;
    slug: string;
  };
}

/**
 * Map API response to the IncomingApplication shape the row component expects.
 */
function mapApplication(api: ApiAdminApplication): IncomingApplication {
  return {
    id:            String(api.id),
    programmeId:   String(api.programme.id),
    programmeName: api.programme.name,
    status:        api.status,
    submittedAt:   api.submitted_at ?? '',
    decisionAt:    api.decision_at ?? undefined,
    lastUpdated:   api.decision_at ?? api.submitted_at ?? '',
    matchScore:    api.match_score,
    applicant: {
      fullName:      api.user.full_name || `${api.user.first_name} ${api.user.last_name}`,
      email:         api.user.email,
      nrc:           api.user.nrc ?? '',
      phone:         api.user.phone ?? '',
      province:      api.user.province ?? '',
      dateOfBirth:   '',
      grades:        [],
      statement:     api.personal_statement ?? '',
      documentNames: [],
    },
  };
}

export default function InstitutionApplicationsPage() {
  const [applications, setApplications] = React.useState<IncomingApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  const [search,      setSearch]      = React.useState('');
  const [status,      setStatus]      = React.useState<StatusFilter>('all');
  const [programmeId, setProgrammeId] = React.useState('all');
  const [sortMode,    setSortMode]    = React.useState<SortMode>('newest');

  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data  = await api.get<ApiAdminApplication[]>('/admin/applications', token ?? undefined);
        setApplications(data.map(mapApplication));
      } catch (err: any) {
        setError(err.message || 'Could not load applications.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /**
   * Download the Excel export. Sends the current filters as query params
   * so the file matches exactly what the admin sees on screen.
   */
  async function handleExport() {
    setExporting(true);
    try {
      const token = getToken();
      const params = new URLSearchParams();
      if (status !== 'all')      params.set('status', status);
      if (programmeId !== 'all') params.set('programme_id', programmeId);
      if (search.trim())         params.set('search', search.trim());

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(
        `${base}/api/admin/applications/export?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/octet-stream',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Export failed. Please try again.');
      }

      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `applications-by-school-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Could not export. Please try again.');
    } finally {
      setExporting(false);
    }
  }

  // Build the list of unique programmes from the applications themselves
  // so the filter only shows programmes that actually have applications.
  const programmes = React.useMemo(() => {
    const map = new Map<string, string>();
    applications.forEach(app => map.set(app.programmeId, app.programmeName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [applications]);

  const filtered = React.useMemo(() => {
    const rows = applications.filter(app => {
      if (status !== 'all' && app.status !== status) return false;
      if (programmeId !== 'all' && app.programmeId !== programmeId) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${app.applicant.fullName} ${app.applicant.email} ${app.applicant.nrc} ${app.programmeName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortMode === 'match') {
      // Best match first; unranked (null) applications sink to the bottom.
      return [...rows].sort((a, b) => {
        const as = a.matchScore ?? -1;
        const bs = b.matchScore ?? -1;
        return bs - as;
      });
    }

    // 'newest' — the API already returns newest-first.
    return rows;
  }, [applications, search, status, programmeId, sortMode]);

  const isFiltered = search !== '' || status !== 'all' || programmeId !== 'all';

  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="All applications"
        description={`${applications.length} total applications received this cycle`}
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting || loading || applications.length === 0}
          >
            {exporting
              ? <Loader2 className="size-4 animate-spin" />
              : <Download className="size-4" />}
            {exporting ? 'Exporting…' : 'Export'}
          </Button>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 text-brand-600 animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
          <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="rounded-xl border border-border bg-white p-4 mb-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
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
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <select
                value={status}
                onChange={e => setStatus(e.target.value as StatusFilter)}
                className="h-10 rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
                aria-label="Filter by status"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select
                value={programmeId}
                onChange={e => setProgrammeId(e.target.value)}
                className="h-10 rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
                aria-label="Filter by programme"
              >
                <option value="all">All programmes</option>
                {programmes.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                className="h-10 rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
                aria-label="Sort applications"
              >
                <option value="newest">Sort: Newest</option>
                <option value="match">Sort: Best match</option>
              </select>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <p className="text-xs text-ink-50">
                <strong className="text-ink">{filtered.length}</strong> of {applications.length} applications
                {sortMode === 'match' && (
                  <span className="ml-2 inline-flex items-center gap-1 text-brand-700 font-semibold">
                    <ArrowDownWideNarrow className="size-3.5" />
                    Ranked by requirements match
                  </span>
                )}
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
              <p className="font-display text-xl text-ink">
                {applications.length === 0 ? 'No applications yet' : 'No applications match'}
              </p>
              <p className="text-sm text-ink-50 mt-2">
                {applications.length === 0
                  ? 'When students apply to your programmes, they will appear here.'
                  : 'Try adjusting or clearing the filters.'}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              {filtered.map(app => (
                <IncomingApplicationRow key={app.id} application={app} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
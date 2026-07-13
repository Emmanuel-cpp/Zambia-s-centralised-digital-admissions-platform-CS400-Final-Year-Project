'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Plus, Search, Pencil, Eye, X, Clock, Calendar,
  Loader2, AlertCircle, BookOpen, Users,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/lib/routes';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface ApiProgramme {
  id:                 number;
  slug:               string;
  name:               string;
  qualification:      string;
  school:             string;
  duration_years:     number;
  study_mode:         string;
  intake:             string;
  applications_count: number;
}

export default function InstitutionProgrammesPage() {
  const [programmes, setProgrammes] = React.useState<ApiProgramme[]>([]);
  const [loading, setLoading]       = React.useState(true);
  const [error, setError]           = React.useState<string | null>(null);
  const [search, setSearch]         = React.useState('');

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiProgramme[]>('/admin/programmes', token ?? undefined);
        setProgrammes(data);
      } catch (err: any) {
        setError(err.message || 'Could not load programmes.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return programmes;
    return programmes.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.school.toLowerCase().includes(q) ||
      p.qualification.toLowerCase().includes(q),
    );
  }, [programmes, search]);

  return (
    <>
      <PageHeader
        eyebrow="Manage"
        title="Programmes"
        description="The programmes offered by your institution."
        actions={
          <Button asChild>
            <Link href={ROUTES.institutionProgrammeNew}>
              <Plus className="size-4" />
              New programme
            </Link>
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
          {/* Search */}
          <div className="mb-5 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-30" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search programmes…"
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-6 rounded-full text-ink-30 hover:bg-ink-5 hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <BookOpen className="size-7 text-ink-30 mx-auto mb-3" />
              <p className="font-display text-xl text-ink">
                {programmes.length === 0 ? 'No programmes yet' : 'No programmes match'}
              </p>
              <p className="text-sm text-ink-50 mt-2 mb-5">
                {programmes.length === 0
                  ? 'Add your first programme to start accepting applications.'
                  : 'Try a different search term.'}
              </p>
              {programmes.length === 0 && (
                <Button asChild>
                  <Link href={ROUTES.institutionProgrammeNew}>
                    <Plus className="size-4" />
                    Add a programme
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(p => (
                <ProgrammeRow key={p.id} programme={p} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

function ProgrammeRow({ programme }: { programme: ApiProgramme }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 flex items-start gap-4 hover:border-brand-200 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">
            {programme.qualification}
          </span>
          <span className="text-xs text-ink-50">{programme.school}</span>
        </div>
        <h3 className="font-display text-lg text-ink leading-tight">{programme.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-50">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {programme.duration_years} years · {programme.study_mode}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {programme.intake}
          </span>
          {programme.applications_count > 0 && (
            <span className="inline-flex items-center gap-1.5 text-brand-700 font-semibold">
              <Users className="size-3.5" />
              {programme.applications_count} {programme.applications_count === 1 ? 'application' : 'applications'}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1 shrink-0">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/programmes/${programme.slug}`} target="_blank">
            <Eye className="size-4" />
            View
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.institutionProgrammeEdit(programme.id)}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}
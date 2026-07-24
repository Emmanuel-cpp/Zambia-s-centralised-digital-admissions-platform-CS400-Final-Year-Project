'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Plus, Search, X, Loader2, AlertCircle, Building2,
  ShieldAlert, ShieldCheck, MapPin, Users, GraduationCap,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface PlatformInstitution {
  id:                 number;
  slug:               string;
  name:               string;
  short_name:         string;
  city:               string;
  province:           string;
  is_suspended:       boolean;
  suspension_reason:  string | null;
  is_accepting_applications: boolean;
  programmes_count:   number;
  admins_count:       number;
  applications_count: number;
}

export default function PlatformInstitutionsPage() {
  const [institutions, setInstitutions] = React.useState<PlatformInstitution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);
  const [search, setSearch]   = React.useState('');
  const [busyId, setBusyId]   = React.useState<number | null>(null);

  async function load() {
    try {
      const token = getToken();
      const data = await api.get<PlatformInstitution[]>('/platform/institutions', token ?? undefined);
      setInstitutions(data);
    } catch (err: any) {
      setError(err.message || 'Could not load institutions.');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  async function handleSuspend(inst: PlatformInstitution) {
    const reason = prompt(
      `Suspend ${inst.name}?\n\nThe institution will be hidden from the public site and its administrators will be unable to sign in. No data is deleted and the action is reversible.\n\nReason:`,
    );
    if (!reason?.trim()) return;

    setBusyId(inst.id);
    try {
      const token = getToken();
      await api.put(`/platform/institutions/${inst.id}/suspend`, { reason: reason.trim() }, token ?? undefined);
      await load();
    } catch (err: any) {
      alert(err.message || 'Could not suspend this institution.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleReactivate(inst: PlatformInstitution) {
    if (!confirm(`Reactivate ${inst.name}? It will reappear publicly and its administrators can sign in again.`)) return;

    setBusyId(inst.id);
    try {
      const token = getToken();
      await api.put(`/platform/institutions/${inst.id}/reactivate`, {}, token ?? undefined);
      await load();
    } catch (err: any) {
      alert(err.message || 'Could not reactivate this institution.');
    } finally {
      setBusyId(null);
    }
  }

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return institutions;
    return institutions.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.short_name.toLowerCase().includes(q) ||
      i.city.toLowerCase().includes(q),
    );
  }, [institutions, search]);

  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Institutions"
        description="Every institution on ZamAdmit, including suspended accounts."
        actions={
          <Button asChild>
            <Link href={ROUTES.platformInstitutionNew}>
              <Plus className="size-4" />
              Onboard institution
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
          <div className="mb-5 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-30" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search institutions…"
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-6 rounded-full text-ink-30 hover:bg-ink-5 hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <Building2 className="size-7 text-ink-30 mx-auto mb-3" />
              <p className="font-display text-xl text-ink">
                {institutions.length === 0 ? 'No institutions yet' : 'No institutions match'}
              </p>
              <p className="text-sm text-ink-50 mt-2 mb-5">
                {institutions.length === 0
                  ? 'Onboard the first institution to get started.'
                  : 'Try a different search term.'}
              </p>
              {institutions.length === 0 && (
                <Button asChild>
                  <Link href={ROUTES.platformInstitutionNew}>
                    <Plus className="size-4" />
                    Onboard institution
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(inst => (
                <div
                  key={inst.id}
                  className={cn(
                    'rounded-xl border bg-white p-5 flex flex-col sm:flex-row sm:items-start gap-4',
                    inst.is_suspended ? 'border-warning/40 bg-warning-soft/30' : 'border-border',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">
                        {inst.short_name}
                      </span>
                      {inst.is_suspended ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-warning bg-warning-soft border border-warning/30 rounded-full px-2 py-0.5">
                          <ShieldAlert className="size-3" />
                          Suspended
                        </span>
                      ) : inst.is_accepting_applications ? (
                        <span className="text-[11px] font-bold text-success bg-success-soft border border-success/20 rounded-full px-2 py-0.5">
                          Open
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-ink-50 bg-ink-5 rounded-full px-2 py-0.5">
                          Closed
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg text-ink leading-tight">{inst.name}</h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-50">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {inst.city}, {inst.province}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="size-3.5" />
                        {inst.programmes_count} programmes
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {inst.admins_count} admins
                      </span>
                      <span>{inst.applications_count} applications</span>
                    </div>

                    {inst.is_suspended && inst.suspension_reason && (
                      <p className="mt-2 text-xs text-warning">
                        <strong>Reason:</strong> {inst.suspension_reason}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {inst.is_suspended ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReactivate(inst)}
                        disabled={busyId === inst.id}
                      >
                        {busyId === inst.id
                          ? <Loader2 className="size-4 animate-spin" />
                          : <ShieldCheck className="size-4" />}
                        Reactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspend(inst)}
                        disabled={busyId === inst.id}
                        className="text-danger hover:bg-danger-soft"
                      >
                        {busyId === inst.id
                          ? <Loader2 className="size-4 animate-spin" />
                          : <ShieldAlert className="size-4" />}
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
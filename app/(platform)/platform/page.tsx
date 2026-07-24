'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2, Users, GraduationCap, ClipboardList,
  Wallet, ShieldAlert, Loader2, AlertCircle, Plus,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

interface PlatformStats {
  institutions_total:     number;
  institutions_active:    number;
  institutions_suspended: number;
  students:      number;
  admins:        number;
  programmes:    number;
  applications:  number;
  payments_completed: number;
  platform_revenue:   number;
  gross_processed:    number;
}

export default function PlatformOverviewPage() {
  const [stats, setStats]     = React.useState<PlatformStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        setStats(await api.get<PlatformStats>('/platform/stats', token ?? undefined));
      } catch (err: any) {
        setError(err.message || 'Could not load platform statistics.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="ZamAdmit"
        title="Platform overview"
        description="Every institution, applicant, and transaction on ZamAdmit."
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

      {stats && !loading && !error && (
        <div className="space-y-6">
          {/* Institutions */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile
              icon={<Building2 className="size-4" />}
              label="Institutions"
              value={stats.institutions_total}
              hint={`${stats.institutions_active} active`}
            />
            <StatTile
              icon={<ShieldAlert className="size-4" />}
              label="Suspended"
              value={stats.institutions_suspended}
              tone={stats.institutions_suspended > 0 ? 'warning' : undefined}
            />
            <StatTile
              icon={<Users className="size-4" />}
              label="Institution admins"
              value={stats.admins}
            />
          </div>

          {/* Usage */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile
              icon={<Users className="size-4" />}
              label="Registered students"
              value={stats.students}
            />
            <StatTile
              icon={<GraduationCap className="size-4" />}
              label="Programmes listed"
              value={stats.programmes}
            />
            <StatTile
              icon={<ClipboardList className="size-4" />}
              label="Applications submitted"
              value={stats.applications}
            />
          </div>

          {/* Revenue */}
          <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="grid place-items-center size-9 rounded-md bg-brand-50 text-brand-700">
                <Wallet className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink">Transactions</h2>
                <p className="text-xs text-ink-50">
                  ZamAdmit retains 5% of each application fee.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">
                  Completed payments
                </p>
                <p className="font-display text-2xl text-ink mt-1 tabular-nums">
                  {stats.payments_completed}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">
                  Gross processed
                </p>
                <p className="font-display text-2xl text-ink mt-1 tabular-nums">
                  K{stats.gross_processed.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-700">
                  Platform revenue
                </p>
                <p className="font-display text-2xl text-brand-700 mt-1 tabular-nums">
                  K{stats.platform_revenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatTile({
  icon, label, value, hint, tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
  tone?: 'warning';
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-ink-50">{label}</p>
        <span className={
          tone === 'warning'
            ? 'grid place-items-center size-8 rounded-md bg-warning-soft text-warning'
            : 'grid place-items-center size-8 rounded-md bg-brand-50 text-brand-700'
        }>
          {icon}
        </span>
      </div>
      <p className="font-display text-3xl text-ink mt-2 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-ink-50 mt-1">{hint}</p>}
    </div>
  );
}
import Link from 'next/link';
import { ClipboardList, Clock, CheckCircle2, GraduationCap, ArrowRight, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/shared/stat-card';
import { IncomingApplicationRow } from '@/components/institution-admin/incoming-application-row';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import {
  getAdminInstitution, getAdminProgrammes,
  getIncomingApplications, getInstitutionStats,
} from '@/lib/data';

export const metadata: Metadata = { title: 'Admin dashboard' };

export default function InstitutionDashboardPage() {
  const inst   = getAdminInstitution();
  const stats  = getInstitutionStats();
  const recent = getIncomingApplications().slice(0, 5);
  const progs  = getAdminProgrammes();

  return (
    <>
      <PageHeader
        eyebrow={inst.shortName}
        title={inst.name}
        description={`2025/2026 admission cycle · Closes ${formatDate(inst.applicationDeadline)}`}
        actions={
          <Button asChild>
            <Link href={ROUTES.institutionApplications}>
              View all applications
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      {/* KPI grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total applications" value={stats.total}        hint="This cycle"      icon={<ClipboardList className="size-4" />} />
        <StatCard label="Pending review"     value={stats.pending}      hint={stats.pending > 0 ? 'Action needed' : 'All caught up'} hintVariant={stats.pending > 0 ? 'warning' : 'success'} icon={<Clock className="size-4" />} />
        <StatCard label="Accepted"           value={stats.accepted}     hint="Offers extended" hintVariant="success" icon={<CheckCircle2 className="size-4" />} />
        <StatCard label="Programmes"         value={stats.programmeCount} hint="Listed"         icon={<GraduationCap className="size-4" />} />
      </div>

      {/* Two-column body */}
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Recent applications */}
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-ink">Recent applications</h3>
              <p className="text-xs text-ink-50 mt-0.5">Newest first</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.institutionApplications} className="gap-1.5 text-brand-700">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-50">No applications yet.</p>
          ) : (
            recent.map(app => <IncomingApplicationRow key={app.id} application={app} />)
          )}
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* Cycle card */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4 text-brand-600" />
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50">Admission cycle</p>
            </div>
            <p className="font-display text-2xl text-ink">{formatDate(inst.applicationDeadline)}</p>
            <p className="text-xs text-ink-50 mt-2 leading-relaxed">
              Application deadline. After this date no new applications are accepted.
            </p>
          </div>

          {/* Programmes */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50">Your programmes</p>
              <Link href={ROUTES.institutionProgrammes} className="text-[11px] font-bold text-brand-700 hover:underline">
                Manage →
              </Link>
            </div>
            <ul className="space-y-2">
              {progs.map(p => (
                <li key={p.id} className="flex items-center gap-2.5">
                  <GraduationCap className="size-4 text-brand-600 shrink-0" />
                  <span className="text-sm text-ink truncate">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pending action */}
          {stats.pending > 0 && (
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-700 mb-1">Action needed</p>
              <p className="font-display text-2xl text-brand-700">{stats.pending}</p>
              <p className="text-sm text-brand-700/70 mt-1 mb-4">
                {stats.pending === 1 ? 'application' : 'applications'} awaiting a decision.
              </p>
              <Button asChild className="w-full">
                <Link href={ROUTES.institutionDecisions}>
                  Process decisions <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

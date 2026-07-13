'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ClipboardList, Clock, CheckCircle2, GraduationCap,
  ArrowRight, Calendar, Loader2, AlertCircle, BarChart3,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/shared/stat-card';
import { IncomingApplicationRow } from '@/components/institution-admin/incoming-application-row';
import { SubmissionsChart } from '@/components/institution-admin/analytics/submissions-chart';
import { StatusChart } from '@/components/institution-admin/analytics/status-chart';
import { ProgrammePopularityChart } from '@/components/institution-admin/analytics/programme-popularity-chart';
import { ProvinceChart } from '@/components/institution-admin/analytics/province-chart';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import { api } from '@/lib/api';
import { getToken, getAuthUser } from '@/lib/auth';
import type { IncomingApplication, ApplicationStatus } from '@/types/domain';

interface ApiAdminApplication {
  id: number;
  status: ApplicationStatus;
  submitted_at: string | null;
  decision_at:  string | null;
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

interface ApiInstitution {
  id:                       number;
  slug:                     string;
  name:                     string;
  short_name:               string;
  application_deadline:     string;
  programmes:               { id: number; name: string; slug: string }[];
}

interface ApiAnalytics {
  daily_submissions:     { date: string; count: number }[];
  status_distribution:   { status: string; count: number }[];
  programme_popularity:  { programme: string; count: number }[];
  province_distribution: { province: string; count: number }[];
}

function mapApplication(api: ApiAdminApplication): IncomingApplication {
  return {
    id:            String(api.id),
    programmeId:   String(api.programme.id),
    programmeName: api.programme.name,
    status:        api.status,
    submittedAt:   api.submitted_at ?? '',
    decisionAt:    api.decision_at ?? undefined,
    lastUpdated:   api.decision_at ?? api.submitted_at ?? '',
    applicant: {
      fullName:      api.user.full_name || `${api.user.first_name} ${api.user.last_name}`,
      email:         api.user.email,
      nrc:           api.user.nrc ?? '',
      phone:         api.user.phone ?? '',
      province:      api.user.province ?? '',
      dateOfBirth:   '',
      grades:        [],
      statement:     '',
      documentNames: [],
    },
  };
}

export default function InstitutionDashboardPage() {
  const [institution, setInstitution]   = React.useState<ApiInstitution | null>(null);
  const [applications, setApplications] = React.useState<IncomingApplication[]>([]);
  const [analytics, setAnalytics]       = React.useState<ApiAnalytics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      const token    = getToken();
      const authUser = getAuthUser();

      try {
        // Fetch applications, analytics, and the institution list in parallel
        const [apps, analyticsData, allInstitutions] = await Promise.all([
          api.get<ApiAdminApplication[]>('/admin/applications', token ?? undefined),
          api.get<ApiAnalytics>('/admin/analytics', token ?? undefined),
          api.get<ApiInstitution[]>('/institutions'),
        ]);

        const found = allInstitutions.find(i => i.id === authUser?.institution_id);
        if (found) {
          const full = await api.get<ApiInstitution>(`/institutions/${found.slug}`);
          setInstitution(full);
        }

        setApplications(apps.map(mapApplication));
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(err.message || 'Could not load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = React.useMemo(() => {
    const total    = applications.length;
    const accepted = applications.filter(a => a.status === 'accepted').length;
    const pending  = applications.filter(a =>
      a.status === 'submitted' || a.status === 'under_review',
    ).length;
    return {
      total,
      accepted,
      pending,
      programmeCount: institution?.programmes?.length ?? 0,
    };
  }, [applications, institution]);

  const recent = applications.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
        <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={institution?.short_name ?? '—'}
        title={institution?.name ?? 'Institution dashboard'}
        description={
          institution?.application_deadline
            ? `2026/2027 admission cycle · Closes ${formatDate(institution.application_deadline)}`
            : '2026/2027 admission cycle'
        }
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
        <StatCard
          label="Total applications"
          value={stats.total}
          hint="This cycle"
          icon={<ClipboardList className="size-4" />}
        />
        <StatCard
          label="Pending review"
          value={stats.pending}
          hint={stats.pending > 0 ? 'Action needed' : 'All caught up'}
          hintVariant={stats.pending > 0 ? 'warning' : 'success'}
          icon={<Clock className="size-4" />}
        />
        <StatCard
          label="Accepted"
          value={stats.accepted}
          hint="Offers extended"
          hintVariant="success"
          icon={<CheckCircle2 className="size-4" />}
        />
        <StatCard
          label="Programmes"
          value={stats.programmeCount}
          hint="Listed"
          icon={<GraduationCap className="size-4" />}
        />
      </div>

      {/* Analytics section */}
      {analytics && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="size-4 text-brand-600" />
            <h2 className="font-semibold text-ink">Analytics</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SubmissionsChart            data={analytics.daily_submissions} />
            <StatusChart                 data={analytics.status_distribution} />
            <ProgrammePopularityChart    data={analytics.programme_popularity} />
            <ProvinceChart               data={analytics.province_distribution} />
          </div>
        </section>
      )}

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
            <p className="p-8 text-center text-sm text-ink-50">
              No applications yet. When students apply to your programmes,
              they will appear here.
            </p>
          ) : (
            recent.map(app => <IncomingApplicationRow key={app.id} application={app} />)
          )}
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {institution?.application_deadline && (
            <div className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-brand-600" />
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50">
                  Admission cycle
                </p>
              </div>
              <p className="font-display text-2xl text-ink">
                {formatDate(institution.application_deadline)}
              </p>
              <p className="text-xs text-ink-50 mt-2 leading-relaxed">
                Application deadline. After this date, no new applications are accepted.
              </p>
            </div>
          )}

          {institution?.programmes && institution.programmes.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50">
                  Your programmes
                </p>
                <span className="text-[11px] font-bold text-ink-50">
                  {institution.programmes.length}
                </span>
              </div>
              <ul className="space-y-2">
                {institution.programmes.map(p => (
                  <li key={p.id} className="flex items-center gap-2.5">
                    <GraduationCap className="size-4 text-brand-600 shrink-0" />
                    <span className="text-sm text-ink truncate">{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stats.pending > 0 && (
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-700 mb-1">
                Action needed
              </p>
              <p className="font-display text-2xl text-brand-700">{stats.pending}</p>
              <p className="text-sm text-brand-700/70 mt-1 mb-4">
                {stats.pending === 1 ? 'application' : 'applications'} awaiting a decision.
              </p>
              <Button asChild className="w-full">
                <Link href={ROUTES.institutionApplications}>
                  Review now <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
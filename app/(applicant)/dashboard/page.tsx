'use client';

import Link from 'next/link';
import {
  ClipboardList, GraduationCap, Sparkles, FileText,
  ArrowRight, Compass, FilePlus2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/shared/stat-card';
import { OfferCard } from '@/components/shared/offer-card';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/hooks/use-auth';
import * as React from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

    export default function DashboardPage() {
      const { user, loading } = useAuth();

    const [applications, setApplications] = React.useState<any[]>([]);
    const [appsLoading, setAppsLoading] = React.useState(true);

    React.useEffect(() => {
      async function loadApps() {
        try {
          const token = getToken();
          const data = await api.get<any[]>('/applications', token ?? undefined);
          setApplications(data);
        } catch {
          setApplications([]);
        } finally {
          setAppsLoading(false);
        }
      }
      loadApps();
    }, []);

    const submittedCount = applications.filter(a => a.status !== 'draft').length;
    const acceptedCount  = applications.filter(a => a.status === 'accepted').length;
    const recent         = [...applications]
      .filter(a => a.status !== 'draft')
      .slice(0, 3);

  const greeting = getGreeting();
  const firstName = user?.first_name || '...';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-ink-50 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        description="2026/2027 application cycle — Deadline: 31 August 2026"
      />

      {/* KPI grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label="Applications submitted"
          value={submittedCount}
          hint="+1 this week"
          hintVariant="success"
          icon={<ClipboardList className="size-4" />}
        />
        <StatCard
          label="Offers received"
          value={acceptedCount}
          hint="Accepted"
          hintVariant="success"
          icon={<GraduationCap className="size-4" />}
        />
        <StatCard
          label="Recommendations"
          value={8}
          hint="New matches"
          hintVariant="warning"
          icon={<Sparkles className="size-4" />}
        />
        <StatCard
          label="Documents uploaded"
          value={5}
          hint="Profile 85%"
          icon={<FileText className="size-4" />}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Recent applications</CardTitle>
              <Button variant="link" asChild className="h-auto">
                <Link href={ROUTES.applications}>
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardHeader>
                <div className="border-t border-border">
                  {appsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="size-5 text-ink-30 animate-spin" />
                    </div>
                  ) : recent.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-ink-50">
                      No applications yet. Browse programmes to get started.
                    </p>
                  ) : (
                    recent.map(app => (
                      <DashboardApplicationRow key={app.id} application={app} />
                    ))
                  )}
                </div>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="grid place-items-center size-12 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                <Compass className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-ink">Discover more programmes</h3>
                <p className="mt-1 text-sm text-ink-50 leading-relaxed">
                  We&apos;ve found 8 programmes that match your grades and interests.
                </p>
              </div>
              <Button variant="primary" asChild className="shrink-0">
                <Link href={ROUTES.recommendations}>
                  See recommendations
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <OfferCard
            programmeName="BSc Computer Science"
            institutionName="Copperbelt University"
          />

          {/* Profile completion */}
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50 mb-3">
                Profile completion
              </p>
              <div className="flex items-center gap-3 mb-2">
                <Progress
                  value={user?.profile_complete ? 100 : 40}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-brand-700 tabular-nums">
                  {user?.profile_complete ? '100' : '40'}%
                </span>
              </div>
              <p className="text-xs text-ink-50 leading-relaxed mb-4">
                {user?.profile_complete
                  ? 'Your profile is complete. You can apply to any programme.'
                  : 'Complete your profile to unlock applications and recommendations.'}
              </p>
              {!user?.profile_complete && (
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="w-full bg-brand-50 text-brand-700 hover:bg-brand-100"
                >
                  <Link href={ROUTES.profileComplete}>Complete profile</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50 mb-3">
                Quick actions
              </p>
              <div className="space-y-2">
                <QuickAction icon={<Compass className="size-4" />}    href={ROUTES.programmes}      label="Browse programmes" />
                <QuickAction icon={<FilePlus2 className="size-4" />}  href={ROUTES.documents}       label="Upload a document" />
                <QuickAction icon={<Sparkles className="size-4" />}   href={ROUTES.recommendations} label="View recommendations" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function QuickAction({ icon, label, href }: {
  icon: React.ReactNode; label: string; href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border bg-white text-sm font-medium text-ink hover:border-brand-200 hover:bg-brand-50/40 transition-colors"
    >
      <span className="text-ink-50">{icon}</span>
      {label}
    </Link>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function DashboardApplicationRow({ application }: { application: any }) {
  const programmeName = application.programme?.name ?? 'Unknown';
  const institutionName = application.programme?.institution?.name ?? 'Unknown';

  return (
    <Link
      href={ROUTES.application(String(application.id))}
      className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-b-0 hover:bg-ink-5/60 transition-colors group"
    >
      <div className="grid place-items-center size-10 rounded-md bg-brand-600 text-white font-display text-base shrink-0">
        {institutionName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{programmeName}</p>
        <p className="text-xs text-ink-50 truncate">{institutionName}</p>
      </div>
      <span className="text-xs font-medium text-ink-50 capitalize">
        {application.status?.replace('_', ' ')}
      </span>
    </Link>
  );
}
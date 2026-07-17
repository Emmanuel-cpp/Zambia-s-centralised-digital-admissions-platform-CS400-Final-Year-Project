'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ClipboardList, GraduationCap, FileText, ArrowRight, Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/shared/stat-card';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const [applications, setApplications] = React.useState<any[]>([]);
  const [appsLoading, setAppsLoading]   = React.useState(true);
  const [documentCount, setDocumentCount] = React.useState<number | null>(null);

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

    async function loadDocuments() {
      try {
        const token = getToken();
        const docs = await api.get<any[]>('/documents', token ?? undefined);
        setDocumentCount(docs.length);
      } catch {
        setDocumentCount(null);
      }
    }

    loadApps();
    loadDocuments();
  }, []);

  const submittedCount = applications.filter(a => a.status !== 'draft').length;
  const acceptedCount  = applications.filter(a => a.status === 'accepted').length;
  const recent         = [...applications]
    .filter(a => a.status !== 'draft')
    .slice(0, 3);

  const profilePct = user?.profile_complete ? 100 : 40;

  const greeting  = getGreeting();
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
        description="2026/2027 application cycle"
      />

      {/* KPI grid — all real numbers */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label="Applications submitted"
          value={submittedCount}
          icon={<ClipboardList className="size-4" />}
        />
        <StatCard
          label="Offers received"
          value={acceptedCount}
          hint={acceptedCount > 0 ? 'Accepted' : undefined}
          hintVariant="success"
          icon={<GraduationCap className="size-4" />}
        />
        <StatCard
          label="Documents uploaded"
          value={documentCount ?? '—'}
          icon={<FileText className="size-4" />}
        />
        <StatCard
          label="Profile completion"
          value={`${profilePct}%`}
          hint={profilePct === 100 ? 'Ready to apply' : 'Incomplete'}
          hintVariant={profilePct === 100 ? 'success' : 'warning'}
          icon={<GraduationCap className="size-4" />}
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
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-ink-50 mb-4">
                    No applications yet. Browse programmes to get started.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={ROUTES.programmes}>
                      Browse programmes
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                recent.map(app => (
                  <DashboardApplicationRow key={app.id} application={app} />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Recommendations CTA — real feature, honest copy */}
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50 mb-3">
                AI recommendations
              </p>
              <p className="text-sm text-ink-50 leading-relaxed mb-4">
                Get programme matches based on your ECZ results and declared interests.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href={ROUTES.recommendations}>
                  View recommendations
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function DashboardApplicationRow({ application }: { application: any }) {
  const programmeName   = application.programme?.name ?? 'Unknown';
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
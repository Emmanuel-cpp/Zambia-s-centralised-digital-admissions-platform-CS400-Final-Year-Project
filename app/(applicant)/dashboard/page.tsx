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
import { ApplicationRow } from '@/components/shared/application-row';
import { OfferCard } from '@/components/shared/offer-card';
import { ROUTES } from '@/lib/routes';
import { applications, currentUser } from '@/lib/mock-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  const submittedCount = applications.filter(a => a.status !== 'draft').length;
  const acceptedCount  = applications.filter(a => a.status === 'accepted').length;
  const recent         = [...applications]
    .filter(a => a.status !== 'draft')
    .slice(0, 3);

  const greeting = getGreeting();

  return (
    <>
      <PageHeader
        title={`${greeting}, ${currentUser.firstName}`}
        description="2025/2026 application cycle — Deadline: 31 August 2025"
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
        {/* Left column — recent applications + recommendations preview */}
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
              {recent.map(app => <ApplicationRow key={app.id} application={app} />)}
            </div>
          </Card>

          {/* Discovery prompt */}
          <Card>
            <CardContent className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="grid place-items-center size-12 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                <Compass className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-ink">Discover more programmes</h3>
                <p className="mt-1 text-sm text-ink-50 leading-relaxed">
                  We&apos;ve found 8 programmes that match your grades and interests. Browse what fits you.
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

        {/* Right column — offer + profile completion + quick actions */}
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
                <Progress value={currentUser.completionPct} className="flex-1" />
                <span className="text-sm font-semibold text-brand-700 tabular-nums">
                  {currentUser.completionPct}%
                </span>
              </div>
              <p className="text-xs text-ink-50 leading-relaxed mb-4">
                Add your Grade 12 results to unlock all recommendations.
              </p>
              <Button variant="secondary" size="sm" asChild className="w-full bg-brand-50 text-brand-700 hover:bg-brand-100">
                <Link href={ROUTES.profile}>Complete profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50 mb-3">
                Quick actions
              </p>
              <div className="space-y-2">
                <QuickAction icon={<Compass className="size-4" />} href={ROUTES.discover} label="Browse programmes" />
                <QuickAction icon={<FilePlus2 className="size-4" />} href={ROUTES.documents} label="Upload a document" />
                <QuickAction icon={<Sparkles className="size-4" />} href={ROUTES.recommendations} label="View recommendations" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ──────────────── helpers ──────────────── */

function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
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

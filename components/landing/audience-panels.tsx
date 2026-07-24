'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles, GraduationCap, Search, ShieldCheck, Users, ClipboardList,
  BarChart3, Building2, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { getAuthUser, type AuthUser } from '@/lib/auth';

export function AudiencePanels() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  React.useEffect(() => { setUser(getAuthUser()); }, []);

  return (
    <section id="for-students" className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-600 mb-3">
            Built for both sides
          </p>
          <h2 className="font-display text-display-md sm:text-display-lg text-ink leading-[1.05] tracking-tight">
            Whether you&apos;re applying or admitting,
            <span className="text-brand-700"> the process should be modern.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">

          {/* ─── For Students ─────────────────────────────────────────── */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-8 sm:p-10 hover:shadow-elevate transition-shadow">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-brand-700 text-xs font-bold uppercase tracking-[0.08em] border border-brand-100 mb-6">
              <GraduationCap className="size-3.5" />
              For students
            </div>

            <h3 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
              Apply once. <br />Reach everywhere.
            </h3>

            <p className="mt-4 text-base text-ink-70 leading-relaxed max-w-md">
              Build a portable applicant profile, get matched to programmes that fit your grades,
              and track every application in one place.
            </p>

            <ul className="mt-7 space-y-4">
              <FeatureBullet icon={<Sparkles className="size-4" />} title="Smart programme recommendations">
                Our AI reads your ECZ results and interests to surface programmes you&apos;re likely to thrive in.
              </FeatureBullet>
              <FeatureBullet icon={<ShieldCheck className="size-4" />} title="Documents verified in seconds">
                Upload your NRC and Grade 12 certificate once. Our AI does the reading.
              </FeatureBullet>
              <FeatureBullet icon={<Search className="size-4" />} title="Compare with clarity">
                See every institution, programme, and requirement side by side — no more digging through PDFs.
              </FeatureBullet>
            </ul>

            <div className="mt-8 flex gap-3">
              {!user && (
                <Button asChild>
                  <Link href={ROUTES.register}>
                    Get started free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href={ROUTES.institutions}>Explore institutions</Link>
              </Button>
            </div>

            <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-brand-100/30 blur-2xl" />
          </div>

          {/* ─── For Institutions ─────────────────────────────────────── */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-ink-90 border border-ink-90 p-8 sm:p-10 hover:shadow-elevate transition-shadow">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-[0.08em] border border-white/15 mb-6">
              <Building2 className="size-3.5" />
              For institutions
            </div>

            <h3 className="font-display text-3xl sm:text-4xl text-white leading-tight tracking-tight">
              Modern admissions, <br />without new infrastructure.
            </h3>

            <p className="mt-4 text-base text-white/70 leading-relaxed max-w-md">
              A branded admissions portal, real-time analytics, and a review workflow your team already understands.
            </p>

            <ul className="mt-7 space-y-4">
              <FeatureBullet dark icon={<Users className="size-4" />} title="Verified applicant pipelines">
                Every incoming application is pre-verified — NRC, certificate, and profile completeness.
              </FeatureBullet>
              <FeatureBullet dark icon={<ClipboardList className="size-4" />} title="Streamlined review workflow">
                Filter, sort, and decide from a purpose-built dashboard. Notes, decisions, and audit history included.
              </FeatureBullet>
              <FeatureBullet dark icon={<BarChart3 className="size-4" />} title="Analytics that matter">
                Track applications by programme, region, and grade profile. Export what you need, when you need it.
              </FeatureBullet>
            </ul>

            <div className="mt-8">
              {!user && (
                <Button
                  asChild
                  className="bg-white text-ink hover:bg-brand-50 hover:text-brand-700 shadow-soft"
                >
                  <Link href={ROUTES.forInstitutions}>
                    Request partnership
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-brand-500/10 blur-2xl" />
          </div>

        </div>
      </div>
    </section>
  );
}

/* Feature bullet */

interface FeatureBulletProps {
  icon:     React.ReactNode;
  title:    string;
  children: React.ReactNode;
  dark?:    boolean;
}

function FeatureBullet({ icon, title, children, dark = false }: FeatureBulletProps) {
  return (
    <li className="flex gap-3">
      <span
        className={
          dark
            ? 'grid place-items-center size-8 rounded-md bg-white/10 text-white shrink-0'
            : 'grid place-items-center size-8 rounded-md bg-white text-brand-700 border border-brand-100 shrink-0'
        }
      >
        {icon}
      </span>
      <div>
        <p className={dark ? 'text-white font-semibold text-sm' : 'text-ink font-semibold text-sm'}>{title}</p>
        <p className={dark ? 'text-white/60 text-sm mt-0.5 leading-relaxed' : 'text-ink-50 text-sm mt-0.5 leading-relaxed'}>{children}</p>
      </div>
    </li>
  );
}
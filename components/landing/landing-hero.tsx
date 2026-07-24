'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { HeroSlideshow } from '@/components/shared/hero-slideshow';
import { ROUTES, homeRouteFor } from '@/lib/routes';
import { getAuthUser, type AuthUser } from '@/lib/auth';
import { useStats } from '@/hooks/use-stats';

const HERO_SLIDES = [
  '/images/hero/slide-1.jpg',
  '/images/hero/slide-2.jpg',
  '/images/hero/slide-3.jpg',
  '/images/hero/slide-4.jpg',
  '/images/hero/slide-5.jpg',
];

export function LandingHero() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  React.useEffect(() => { setUser(getAuthUser()); }, []);

  const stats = useStats();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-brand-900 text-white">
      {/* ── Background slideshow ── */}
      <HeroSlideshow
        images={HERO_SLIDES}
        alt="Students at universities and colleges across Zambia"
        intervalMs={6000}
        fadeMs={1500}
      />

      {/* ── Layered overlays for legibility ── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/65 to-ink/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-brand-900/65 via-brand-900/30 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,28,20,0.35)_100%)]"
      />

      {/* Content */}
      <div className="relative z-10 container min-h-[100svh] flex flex-col">
        {/* Spacer for the fixed navbar */}
        <div className="h-20 lg:h-24 shrink-0" />

        {/* Main copy block */}
        <div className="flex-1 flex items-center py-12">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white">
              <span className="size-1.5 rounded-full bg-brand-300 animate-pulse" />
              Zambia&apos;s centralised admissions portal
            </span>

            <h1 className="mt-6 font-display text-[44px] sm:text-[56px] lg:text-[78px] leading-[1.02] tracking-[-0.025em] text-white">
              One application.
              <br />
              <span className="text-brand-300 italic">Every institution.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-2xl">
              Apply to universities and colleges across Zambia with a single profile.
              Stop re-entering your details everywhere — ZamAdmit sends your application
              wherever you choose.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {!user && (
                <Link
                  href={ROUTES.register}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-brand-700 px-7 py-4 text-base font-bold hover:bg-brand-50 transition-all shadow-elevate hover:scale-[1.02]"
                >
                  Create free account
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <Link
                href={ROUTES.institutions}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white px-7 py-4 text-base font-semibold hover:bg-white/20 transition-all"
              >
                Browse institutions
              </Link>
            </div>

            {/* Inline trust indicator */}
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-white/85">
                <GraduationCap className="size-4 text-brand-300" />
                <strong className="text-white">
                  {stats ? stats.institutions_open : '—'}{' '}
                  {stats?.institutions_open === 1 ? 'institution' : 'institutions'}
                </strong>
                <span className="text-white/60">currently admitting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
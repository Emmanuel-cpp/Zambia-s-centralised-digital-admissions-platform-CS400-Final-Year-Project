import Link from 'next/link';
import { ArrowRight, GraduationCap, MapPin, Users } from 'lucide-react';
import { HeroSlideshow } from '@/components/shared/hero-slideshow';
import { ROUTES } from '@/lib/routes';


const HERO_SLIDES = [
  'C:\Users\HP\OneDrive\Desktop\CS4\Project\current\zamadmit-next\public\images\hero\slide-1.jpg',
  '/images/hero/slide-2.jpg',
  '/images/hero/slide-3.jpg',
  '/images/hero/slide-4.jpg',
  '/images/hero/slide-5.jpg',
];

export function LandingHero() {
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
              <Link
                href={ROUTES.register}
                className="inline-flex items-center gap-2 rounded-full bg-white text-brand-700 px-7 py-4 text-base font-bold hover:bg-brand-50 transition-all shadow-elevate hover:scale-[1.02]"
              >
                Create free account
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={ROUTES.institutions}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white px-7 py-4 text-base font-semibold hover:bg-white/20 transition-all"
              >
                Browse institutions
              </Link>
            </div>

            {/* Inline trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {['E', 'C', 'M', 'N', 'T'].map((l, i) => (
                    <span
                      key={l}
                      className="grid place-items-center size-8 rounded-full bg-brand-600 text-white text-xs font-bold border-2 border-ink"
                      style={{ marginLeft: i === 0 ? 0 : -10 }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-white/85">
                  <strong className="text-white">2,400+ students</strong>
                  <span className="text-white/60"> applied this cycle</span>
                </p>
              </div>

              <div className="hidden sm:block h-5 w-px bg-white/20" />

              <div className="flex items-center gap-2 text-sm text-white/85">
                <GraduationCap className="size-4 text-brand-300" />
                <strong className="text-white">12+ institutions</strong>
                <span className="text-white/60">currently admitting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom feature strip — sits at the bottom of the hero */}
        <div className="pb-10 hidden lg:block">
          <div className="grid grid-cols-3 gap-4 max-w-4xl">
            <FeatureChip
              icon={<Users className="size-5" />}
              title="2,400+"
              subtitle="Students applied this cycle"
            />
            <FeatureChip
              icon={<GraduationCap className="size-5" />}
              title="500+"
              subtitle="Programmes across Zambia"
            />
            <FeatureChip
              icon={<MapPin className="size-5" />}
              title="10/10"
              subtitle="Provinces represented"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureChip({
  icon, title, subtitle,
}: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white/8 backdrop-blur-md border border-white/15 px-5 py-4">
      <div className="grid place-items-center size-10 rounded-lg bg-brand-600/80 text-white shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl text-white leading-none">{title}</p>
        <p className="text-xs text-white/65 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

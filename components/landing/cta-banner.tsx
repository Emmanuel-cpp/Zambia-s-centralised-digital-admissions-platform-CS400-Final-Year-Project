import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

const CTA_STATS = [
  { value: '2,400+', label: 'Applications this cycle' },
  { value: '94%',    label: 'Applicant satisfaction' },
  { value: '5 min',  label: 'Average profile setup time' },
] as const;

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500">
      <div aria-hidden className="absolute -right-24 -bottom-24 size-96 rounded-full bg-white/[0.04]" />
      <div aria-hidden className="absolute left-2/5 -top-16 size-52 rounded-full bg-white/[0.03]" />

      <div className="container relative py-20 lg:py-24 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <h2 className="font-display text-display-md sm:text-display-lg text-white tracking-tight">
            Start your application today.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
            Join thousands of Zambian students who have already simplified their path to higher education.
            Free to join. Five minutes to create your profile.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              asChild
              className="bg-white text-brand-700 hover:bg-brand-50 hover:text-brand-700 shadow-soft"
            >
              <Link href={ROUTES.register}>Create free account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href={ROUTES.institutions}>Browse institutions</Link>
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-3 shrink-0">
          {CTA_STATS.map(stat => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/10 border border-white/15 px-6 py-4 min-w-[200px]"
            >
              <p className="font-display text-3xl text-white leading-none">{stat.value}</p>
              <p className="mt-1.5 text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

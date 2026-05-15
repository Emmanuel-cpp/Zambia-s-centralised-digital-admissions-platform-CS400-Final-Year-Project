import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

const STUDENT_ITEMS = [
  'Single profile sent to all chosen institutions',
  'Upload documents once, reuse everywhere',
  'Smart recommendations based on your ECZ grades',
  'Real-time notifications on admission decisions',
  'Completely free — no application fee to ZamAdmit',
] as const;

const INSTITUTION_ITEMS = [
  'Reach more qualified applicants across Zambia',
  'Reduce admissions admin by up to 60%',
  'Real-time intake analytics and reporting',
  'No setup fees — onboarding in two weeks',
  'Dedicated partnership support team',
] as const;

interface PanelProps {
  variant: 'students' | 'institutions';
  eyebrow: string;
  title: string;
  description: string;
  items: readonly string[];
  ctaLabel: string;
  ctaHref: string;
}

function Panel({
  variant, eyebrow, title, description, items, ctaLabel, ctaHref,
}: PanelProps) {
  const isStudents = variant === 'students';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isStudents ? 'bg-ink' : 'bg-brand-700',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'absolute inset-0',
          isStudents
            ? 'bg-gradient-to-tr from-ink via-ink to-brand-900'
            : 'bg-gradient-to-tr from-brand-800 via-brand-700 to-brand-600',
        )}
      />
      <div
        aria-hidden
        className={cn(
          'absolute -top-20 -right-20 size-96 rounded-full blur-3xl opacity-30',
          isStudents ? 'bg-brand-700' : 'bg-brand-300',
        )}
      />
      <div aria-hidden className="absolute -bottom-20 -right-20 size-72 rounded-full bg-white/[0.03]" />

      <div className="relative p-10 sm:p-14 lg:p-16 min-h-[560px] flex flex-col">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/55 mb-3">
          {eyebrow}
        </p>
        <h3 className="font-display text-3xl sm:text-[40px] text-white tracking-tight leading-[1.1] max-w-md">
          {title}
        </h3>
        <p
          className={cn(
            'mt-4 text-base sm:text-lg leading-relaxed max-w-md',
            isStudents ? 'text-white/65' : 'text-white/75',
          )}
        >
          {description}
        </p>

        <ul className="mt-8 space-y-3 max-w-md">
          {items.map(item => (
            <li
              key={item}
              className={cn(
                'flex items-start gap-3 text-[15px]',
                isStudents ? 'text-white/85' : 'text-white/90',
              )}
            >
              <span className="grid place-items-center size-5 mt-0.5 rounded-full bg-white/15 shrink-0">
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <Link
            href={ctaHref}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold transition-all shadow-elevate hover:scale-[1.02]',
              isStudents
                ? 'bg-brand-600 text-white hover:bg-brand-500'
                : 'bg-white text-brand-700 hover:bg-brand-50',
            )}
          >
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AudiencePanels() {
  return (
    <section id="for-institutions" className="grid lg:grid-cols-2">
      <Panel
        variant="students"
        eyebrow="For students"
        title="Everything you need to apply with confidence."
        description="Whether you are applying to one institution or six, ZamAdmit makes the process straightforward, fast, and free."
        items={STUDENT_ITEMS}
        ctaLabel="Get started free"
        ctaHref={ROUTES.register}
      />
      <Panel
        variant="institutions"
        eyebrow="For institutions"
        title="Bring your admissions online with ZamAdmit."
        description="Partner with us to digitise your intake cycle. Our team handles your setup so you can focus on selecting the right students."
        items={INSTITUTION_ITEMS}
        ctaLabel="Request a partnership"
        ctaHref={ROUTES.forInstitutions}
      />
    </section>
  );
}

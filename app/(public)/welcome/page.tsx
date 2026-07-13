import Link from 'next/link';
import {
  ArrowRight, FileText, GraduationCap, User, CheckCircle2,
} from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { Greeting } from '@/components/shared/greeting';

export const metadata: Metadata = {
  title: 'Welcome to ZamAdmit',
};

const STEPS = [
  {
    icon: User,
    title: 'Personal information',
    description: 'Your name, NRC, phone number, and province.',
  },
  {
    icon: GraduationCap,
    title: 'Grade 12 ECZ results',
    description: 'Your subjects and grades from your ECZ certificate.',
  },
  {
    icon: FileText,
    title: 'Upload documents',
    description: 'NRC, Grade 12 certificate, and a passport photo.',
  },
] as const;

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="grid place-items-center size-16 rounded-2xl bg-brand-600 mx-auto mb-5">
            <CheckCircle2 className="size-8 text-white" />
          </div>
            <Greeting />
          <p className="mt-2 text-base text-ink-50 leading-relaxed max-w-sm mx-auto">
            Your account is ready. Complete your profile so you can start
            applying to institutions across Zambia.
          </p>
        </div>

        {/* What you'll fill in */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-50 mb-4">
            Takes about 5 minutes
          </p>

          <ul className="space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex items-start gap-4">
                  <div className="grid place-items-center size-9 rounded-lg bg-brand-50 text-brand-600 shrink-0 mt-0.5">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-xs text-ink-50 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <Button asChild size="lg" className="w-full">
          <Link href={ROUTES.profileComplete}>
            Complete my profile
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        {/* Skip link */}
        <p className="text-center mt-4 text-sm text-ink-50">
          <Link
            href={ROUTES.dashboard}
            className="hover:text-ink transition-colors"
          >
            Skip for now — I&apos;ll do this later
          </Link>
        </p>

        <p className="text-center mt-2 text-xs text-ink-30">
          You won&apos;t be able to apply to programmes until your profile is complete.
        </p>
      </div>
    </div>
  );
}

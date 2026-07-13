import Link from 'next/link';
import { CheckCircle2, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export function StepDone() {
  return (
    <div className="text-center py-4">
      <div className="grid place-items-center size-16 rounded-2xl bg-success mx-auto mb-5">
        <CheckCircle2 className="size-8 text-white" />
      </div>

      <h2 className="font-display text-display-sm text-ink leading-tight">
        Profile complete!
      </h2>
      <p className="mt-2 text-base text-ink-50 leading-relaxed max-w-sm mx-auto">
        You&apos;re all set. You can now apply to any institution on ZamAdmit with
        a single click — no re-entering your details.
      </p>

      <div className="mt-8 space-y-3">
        <Button asChild size="lg" className="w-full">
          <Link href={ROUTES.programmes}>
            <GraduationCap className="size-4" />
            Browse programmes
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href={ROUTES.dashboard}>
            Go to dashboard
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

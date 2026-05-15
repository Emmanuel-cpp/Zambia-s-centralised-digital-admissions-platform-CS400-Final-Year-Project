import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4 py-16 bg-surface-subtle">
      <div className="max-w-md text-center">
        <p className="font-display text-[120px] sm:text-[180px] leading-none text-brand-600/20">
          404
        </p>
        <h1 className="font-display text-display-md sm:text-display-lg text-ink mt-2">
          Page not found
        </h1>
        <p className="mt-3 text-base text-ink-50 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, or it may have moved.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href={ROUTES.home}>
              <Home className="size-4" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.institutions}>
              <ArrowLeft className="size-4" />
              Browse institutions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstitutionCard } from '@/components/shared/institution-card';
import { SectionHeader } from './section-header';
import { ROUTES } from '@/lib/routes';
import { getAllInstitutions } from '@/lib/data';
import type { Institution } from '@/types/domain';

export function FeaturedInstitutions() {
  const [institutions, setInstitutions] = React.useState<Institution[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    getAllInstitutions()
      .then(data => { if (!cancelled) setInstitutions(data); })
      .catch(() => { if (!cancelled) setInstitutions([]); });
    return () => { cancelled = true; };
  }, []);

  // Show open institutions first — they're the ones a visitor can act on.
  const ordered = React.useMemo(() => {
    if (!institutions) return [];
    return [...institutions].sort((a, b) =>
      Number(b.isAcceptingApplications) - Number(a.isAcceptingApplications),
    );
  }, [institutions]);

  const featured  = ordered.slice(0, 6);
  const total     = institutions?.length ?? 0;
  const openCount = institutions?.filter(i => i.isAcceptingApplications).length ?? 0;

  const description = institutions === null
    ? 'Loading participating institutions…'
    : openCount === 0
      ? 'No institutions are open for applications at the moment.'
      : `${openCount} higher learning ${openCount === 1 ? 'institution is' : 'institutions are'} open for the 2026/2027 intake cycle.`;

  return (
    <section className="py-20 lg:py-24 bg-surface-subtle">
      <div className="container">
        <SectionHeader
          eyebrow="Participating institutions"
          title="Currently accepting applications"
          description={description}
        />

        {institutions === null ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 text-brand-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map(inst => (
                <InstitutionCard key={inst.id} institution={inst} />
              ))}
            </div>

            {total > 0 && (
              <div className="mt-10 text-center">
                <Button variant="outline" asChild>
                  <Link href={ROUTES.institutions}>
                    View all {total} {total === 1 ? 'institution' : 'institutions'}
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
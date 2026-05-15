import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InstitutionCard } from '@/components/shared/institution-card';
import { SectionHeader } from './section-header';
import { ROUTES } from '@/lib/routes';
import { institutions } from '@/lib/mock-data';

export function FeaturedInstitutions() {
  const featured = institutions.slice(0, 6);

  return (
    <section className="py-20 lg:py-24 bg-surface-subtle">
      <div className="container">
        <SectionHeader
          eyebrow="Participating institutions"
          title="Currently accepting applications"
          description="Twelve higher learning institutions are now open for the 2025/2026 intake cycle."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(inst => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <Link href={ROUTES.institutions}>View all 12 institutions</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

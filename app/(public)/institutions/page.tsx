import type { Metadata } from 'next';
import { InstitutionsBrowser } from '@/components/institutions/institutions-browser';
import { institutions } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Browse institutions',
  description: 'Discover all higher learning institutions on ZamAdmit. Filter by location, type, and admission status.',
};

export default function InstitutionsPage() {
  const openCount = institutions.filter(i => i.isAcceptingApplications).length;

  return (
    <div className="bg-surface">
      {/* Page header band */}
      <div className="border-b border-border bg-white">
        <div className="container py-12 lg:py-14 pt-24 lg:pt-28">
          <p className="eyebrow mb-3">Institutions</p>
          <h1 className="font-display text-display-md sm:text-display-lg text-ink max-w-3xl">
            Find your university or college.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-50 max-w-2xl">
            Browse every higher learning institution on ZamAdmit.
            <strong className="text-ink"> {openCount}</strong> currently accepting applications
            for the 2025/2026 cycle.
          </p>
        </div>
      </div>

      {/* Browse area */}
      <div className="container py-10 lg:py-12">
        <InstitutionsBrowser institutions={institutions} />
      </div>
    </div>
  );
}

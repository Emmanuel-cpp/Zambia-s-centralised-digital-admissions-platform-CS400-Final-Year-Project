import type { Metadata } from 'next';
import { ProgrammesBrowser } from '@/components/programmes/programmes-browser';
import { getAllProgrammes, getAllInstitutions } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Browse programmes',
};

export default async function ProgrammesPage() {
  const programmes = await getAllProgrammes();
  const institutions = await getAllInstitutions();

  const institutionsById: Record<string, typeof institutions[number]> = {};
  for (const inst of institutions) institutionsById[inst.id] = inst;

  return (
    <div className="bg-surface min-h-screen">
      <div className="border-b border-border bg-white">
        <div className="container py-12 lg:py-14 pt-24 lg:pt-28">
          <p className="eyebrow mb-3">Programmes</p>
          <h1 className="font-display text-display-md sm:text-display-lg text-ink max-w-3xl">
            Find your programme.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-50 max-w-2xl">
            Browse <strong className="text-ink">{programmes.length}</strong> programmes
            across all institutions on ZamAdmit.
          </p>
        </div>
      </div>
      <div className="container py-10 lg:py-12">
        <ProgrammesBrowser programmes={programmes} institutionsById={institutionsById} />
      </div>
    </div>
  );
}
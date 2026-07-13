import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Calendar, Building2, GraduationCap, ChevronRight, BookOpen,
} from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageBackLink } from '@/components/shared/page-back-link';
import { ProgrammeCard } from '@/components/shared/programme-card';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import {
  getInstitutionBySlug, getProgrammesByInstitution, getAllInstitutions,
} from '@/lib/data';
import type { Programme } from '@/types/domain';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const institution = await getInstitutionBySlug(slug);
  if (!institution) return { title: 'Institution not found' };
  return {
    title: institution.name,
    description: institution.description,
  };
}

export async function generateStaticParams() {
  const institutions = await getAllInstitutions();
  return institutions.map(i => ({ slug: i.slug }));
}

/**
 * Group an array of programmes by their `faculty` field (mapped from the
 * backend's `school` column). Returns an array of [school, programmes[]]
 * tuples sorted alphabetically for stable rendering.
 */
function groupProgrammesBySchool(programmes: Programme[]): [string, Programme[]][] {
  const map = new Map<string, Programme[]>();

  for (const p of programmes) {
    const school = p.faculty?.trim() || 'Other programmes';
    if (!map.has(school)) map.set(school, []);
    map.get(school)!.push(p);
  }

  return Array.from(map.entries())
    .map(([school, progs]) =>
      [school, [...progs].sort((a, b) => a.name.localeCompare(b.name))] as [string, Programme[]],
    )
    .sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function InstitutionPage({ params }: PageProps) {
  const { slug } = await params;
  const institution = await getInstitutionBySlug(slug);
  if (!institution) notFound();

  const programmes = await getProgrammesByInstitution(institution.id);
  const grouped    = groupProgrammesBySchool(programmes);

  return (
    <article className="bg-surface">
      {/* Hero */}
      <header className="relative h-[360px] sm:h-[420px] lg:h-[460px] overflow-hidden bg-ink">
        {institution.imageUrl && (
          <Image
            src={institution.imageUrl}
            alt={`${institution.name} campus`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/55 to-ink/85" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/30 to-transparent" />

        <div className="relative z-10 container h-full flex flex-col justify-end pb-12 lg:pb-14 pt-24">
          <div className="mb-5">
            <PageBackLink href={ROUTES.institutions} label="All institutions" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1">
              {institution.shortName}
            </span>
            {institution.isAcceptingApplications ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 text-white text-[11px] font-bold px-2.5 py-1">
                <span className="size-1.5 rounded-full bg-brand-200 animate-pulse" />
                Accepting applications
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-white/15 text-white/80 text-[11px] font-bold px-2.5 py-1">
                Closed
              </span>
            )}
          </div>

          <h1 className="font-display text-display-md sm:text-display-lg lg:text-display-xl text-white max-w-3xl">
            {institution.name}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-white/80 text-sm sm:text-base">
            <MapPin className="size-4" />
            {institution.city}, {institution.province} Province
          </p>
        </div>
      </header>

      {/* Quick facts */}
      <section className="border-b border-border bg-white">
        <div className="container py-5 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
          <Fact icon={<Building2 className="size-4" />}    label="Type"        value={institution.type === 'public' ? 'Public' : 'Private'} />
          <Fact icon={<Calendar className="size-4" />}     label="Established" value={String(institution.established)} />
          <Fact icon={<GraduationCap className="size-4" />} label="Programmes"  value={String(programmes.length)} />
          <Fact
            icon={<Calendar className="size-4" />}
            label="Closes"
            value={institution.isAcceptingApplications ? formatDate(institution.applicationDeadline) : '—'}
          />
        </div>
      </section>

      {/* Body */}
      <section className="container py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">
          <div>
            <div>
              <h2 className="font-display text-display-sm text-ink mb-4">
                About {institution.shortName}
              </h2>
              <p className="text-base text-ink-70 leading-relaxed max-w-2xl">
                {institution.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {institution.tags.map(tag => (
                  <Badge key={tag} variant="brand">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-display-sm text-ink">Programmes</h2>
                  <p className="mt-1 text-sm text-ink-50">
                    {programmes.length === 0
                      ? 'No programmes listed yet.'
                      : `${programmes.length} programme${programmes.length === 1 ? '' : 's'} across ${grouped.length} ${grouped.length === 1 ? 'school' : 'schools'}`}
                  </p>
                </div>
              </div>

              {programmes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-ink-50">
                  Programme listings for this institution are coming soon.
                </div>
              ) : (
                <div className="space-y-10">
                  {grouped.map(([school, schoolProgrammes]) => (
                    <SchoolSection
                      key={school}
                      schoolName={school}
                      programmes={schoolProgrammes}
                      isOpen={institution.isAcceptingApplications}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            {institution.isAcceptingApplications ? (
              <div className="rounded-xl border border-border bg-white p-5 shadow-card">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-700 mb-1.5">
                  Currently open
                </p>
                <p className="text-sm text-ink-70 leading-relaxed">
                  Applications close on <strong className="text-ink">{formatDate(institution.applicationDeadline)}</strong>.
                  Pick a programme below to get started.
                </p>
                {programmes.length > 0 && (
                  <Button asChild variant="primary" className="w-full mt-4">
                    <Link href={ROUTES.programme(programmes[0].slug)}>
                      Browse programmes
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-surface-subtle p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50 mb-1.5">
                  Not accepting applications
                </p>
                <p className="text-sm text-ink-70 leading-relaxed">
                  This institution is not currently accepting applications.
                </p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href={ROUTES.institutions}>See open institutions</Link>
                </Button>
              </div>
            )}

            {grouped.length > 0 && (
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50 mb-3">
                  Schools
                </p>
                <ul className="space-y-1.5">
                  {grouped.map(([school, schoolProgrammes]) => {
                    const anchor = '#' + schoolSlug(school);
                    return (
                      <li key={school}>
                        <Link
                          href={anchor}
                          className="flex items-center justify-between text-sm text-ink-70 hover:text-brand-700 transition-colors"
                        >
                          <span className="truncate flex items-center gap-2">
                            <BookOpen className="size-3.5 text-ink-30 shrink-0" />
                            {school}
                          </span>
                          <span className="text-xs text-ink-30 shrink-0 ml-2">
                            {schoolProgrammes.length}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50 mb-2">
                Need help?
              </p>
              <p className="text-sm text-ink-70 leading-relaxed mb-3">
                Questions about a programme? Our team can help.
              </p>
              <Link href="#" className="text-sm font-semibold text-brand-700 hover:underline">
                Contact ZamAdmit support →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}

/* School section — group header + its programmes */

function SchoolSection({
  schoolName, programmes, isOpen,
}: {
  schoolName: string;
  programmes: Programme[];
  isOpen: boolean;
}) {
  return (
    <section id={schoolSlug(schoolName)} className="scroll-mt-20">
      <div className="flex items-end justify-between gap-3 mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="grid place-items-center size-8 rounded-md bg-brand-50 text-brand-700 shrink-0">
            <BookOpen className="size-4" />
          </div>
          <h3 className="font-display text-xl text-ink leading-tight">
            {schoolName}
          </h3>
        </div>
        <p className="text-xs text-ink-50 shrink-0">
          {programmes.length} {programmes.length === 1 ? 'programme' : 'programmes'}
        </p>
      </div>

      <div className="space-y-3">
        {programmes.map(p => (
          <ProgrammeCard
            key={p.id}
            programme={p}
            variant="list"
            isOpen={isOpen}
          />
        ))}
      </div>
    </section>
  );
}

/* Helpers */

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50">
        <span className="text-ink-30">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}

/**
 * Make a URL-safe id from a school name for anchor links.
 */
function schoolSlug(name: string): string {
  return 'school-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

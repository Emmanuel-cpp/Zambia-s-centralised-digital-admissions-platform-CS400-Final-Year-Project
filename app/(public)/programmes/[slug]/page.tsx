import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, Building2, GraduationCap, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageBackLink } from '@/components/shared/page-back-link';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import {
  getProgrammeBySlug, getInstitutionById, getAllProgrammes,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);
  if (!programme) return { title: 'Programme not found' };
  return {
    title: programme.name,
    description: programme.description,
  };
}

export function generateStaticParams() {
  return getAllProgrammes().map(p => ({ slug: p.slug }));
}

export default async function ProgrammePage({ params }: PageProps) {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);
  if (!programme) notFound();

  const institution = getInstitutionById(programme.institutionId);
  if (!institution) notFound();

  const isOpen = institution.isAcceptingApplications;

  return (
    <article className="bg-surface min-h-screen">
      <header className="border-b border-border bg-white pt-24 lg:pt-28">
        <div className="container py-10 lg:py-12">
          <div className="mb-5">
            <PageBackLink
              href={ROUTES.institution(institution.slug)}
              label={`Back to ${institution.shortName}`}
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-12 items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="brand">{programme.qualification}</Badge>
                {programme.tags.map(tag => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>

              <h1 className="font-display text-display-md sm:text-display-lg text-ink leading-tight">
                {programme.name}
              </h1>

              <p className="mt-3 text-base sm:text-lg text-ink-50">
                Offered by{' '}
                <Link
                  href={ROUTES.institution(institution.slug)}
                  className="font-semibold text-ink hover:text-brand-700 transition-colors"
                >
                  {institution.name}
                </Link>
                {' · '}{institution.city}
              </p>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
              {isOpen ? (
                <>
                  <Button size="lg" asChild>
                    <Link href={ROUTES.apply(programme.slug)}>
                      Apply now
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-ink-50">
                    Closes {formatDate(institution.applicationDeadline)}
                  </p>
                </>
              ) : (
                <>
                  <Button size="lg" disabled>Applications closed</Button>
                  <p className="text-xs text-ink-50">
                    Check back next intake cycle
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="container py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pb-8 border-b border-border">
              <Fact icon={<Clock className="size-4" />}        label="Duration"   value={`${programme.durationYears} years`} />
              <Fact icon={<Building2 className="size-4" />}    label="Mode"       value={programme.studyMode} />
              <Fact icon={<Calendar className="size-4" />}     label="Intake"     value={programme.intake} />
              <Fact icon={<GraduationCap className="size-4" />} label="Faculty"    value={programme.faculty} />
            </div>

            <div>
              <h2 className="font-display text-display-sm text-ink mb-4">
                About this programme
              </h2>
              <p className="text-base text-ink-70 leading-relaxed max-w-2xl">
                {programme.description}
              </p>
            </div>

            <div>
              <h2 className="font-display text-display-sm text-ink mb-2">
                Entry requirements
              </h2>
              <p className="text-sm text-ink-50 mb-5 max-w-2xl">
                Minimum Grade 12 ECZ grades required for admission. The Zambian ECZ scale runs from
                1 (distinction) to 9 (failing) — lower numbers are better.
              </p>

              <div className="rounded-lg border border-border overflow-hidden max-w-xl">
                <table className="w-full text-sm">
                  <thead className="bg-surface-subtle border-b border-border">
                    <tr>
                      <th className="text-left font-semibold text-ink-50 px-4 py-3 text-xs uppercase tracking-[0.06em]">
                        Subject
                      </th>
                      <th className="text-right font-semibold text-ink-50 px-4 py-3 text-xs uppercase tracking-[0.06em]">
                        Min grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {programme.minRequirements.map(req => (
                      <tr key={req.subject} className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 font-medium text-ink">{req.subject}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center justify-center min-w-7 h-7 rounded-md bg-brand-50 text-brand-700 font-bold text-sm">
                            {req.minGrade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="rounded-xl border border-border bg-white p-5 shadow-card lg:hidden">
              {isOpen ? (
                <>
                  <Button size="lg" className="w-full" asChild>
                    <Link href={ROUTES.apply(programme.slug)}>
                      Apply now
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-ink-50 text-center mt-2">
                    Closes {formatDate(institution.applicationDeadline)}
                  </p>
                </>
              ) : (
                <Button size="lg" className="w-full" disabled>
                  Applications closed
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50 mb-3">
                Offered by
              </p>
              <Link
                href={ROUTES.institution(institution.slug)}
                className="block group"
              >
                <h3 className="font-display text-lg text-ink group-hover:text-brand-700 transition-colors leading-tight">
                  {institution.name}
                </h3>
                <p className="text-sm text-ink-50 mt-1">
                  {institution.city}, {institution.province} Province
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-700">
                  View institution
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>

            {isOpen && (
              <div className="rounded-xl border border-success/20 bg-success-soft p-5">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-success mb-1.5">
                  Application timeline
                </p>
                <p className="text-sm text-ink-70 leading-relaxed">
                  Applications close on <strong className="text-ink">{formatDate(institution.applicationDeadline)}</strong>.
                  Most students complete their application in 15–20 minutes.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </article>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50">
        <span className="text-ink-30">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink leading-tight">{value}</p>
    </div>
  );
}
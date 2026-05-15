import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ApplyWizard } from '@/components/apply/apply-wizard';
import {
  getProgrammeBySlug, getInstitutionById,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ programmeSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { programmeSlug } = await params;
  const programme = getProgrammeBySlug(programmeSlug);
  return {
    title: programme ? `Apply: ${programme.name}` : 'Apply',
  };
}

export default async function ApplyPage({ params }: PageProps) {
  const { programmeSlug } = await params;
  const programme = getProgrammeBySlug(programmeSlug);
  if (!programme) notFound();

  const institution = getInstitutionById(programme.institutionId);
  if (!institution) notFound();

  return <ApplyWizard programme={programme} institution={institution} />;
}

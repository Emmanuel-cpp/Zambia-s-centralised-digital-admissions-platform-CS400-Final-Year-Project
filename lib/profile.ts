import type { UserProfile, Document } from '@/types/domain';

/**
 * Calculates what percentage of the profile is complete.
 * Used to show the progress bar and decide if the user can apply.
 */
export function calculateProfileCompletion(
  profile: UserProfile,
  documents: Document[],
): number {
  const checks = [
    !!profile.firstName,
    !!profile.lastName,
    !!profile.email,
    !!profile.phone,
    !!profile.nrc,
    !!profile.province,
    !!profile.dateOfBirth,
    profile.grades.length > 0,
    documents.some(d => d.type === 'nrc'),
    documents.some(d => d.type === 'certificate'),
    documents.some(d => d.type === 'photo'),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

/**
 * Returns true only when the profile meets the minimum bar for applying.
 *
 * Minimum requirements:
 *   - All personal info fields filled
 *   - At least one ECZ grade entered
 *   - NRC document uploaded
 *   - Grade 12 certificate uploaded
 *   - Passport photo uploaded
 */
export function isProfileComplete(
  profile: UserProfile,
  documents: Document[],
): boolean {
  return calculateProfileCompletion(profile, documents) === 100;
}

/**
 * Returns a human-readable list of what's still missing.
 * Used to tell the user exactly what they need to fill in.
 */
export function getMissingProfileItems(
  profile: UserProfile,
  documents: Document[],
): string[] {
  const missing: string[] = [];

  if (!profile.firstName || !profile.lastName) missing.push('Full name');
  if (!profile.email)       missing.push('Email address');
  if (!profile.phone)       missing.push('Phone number');
  if (!profile.nrc)         missing.push('NRC number');
  if (!profile.province)    missing.push('Province');
  if (!profile.dateOfBirth) missing.push('Date of birth');
  if (profile.grades.length === 0) missing.push('Grade 12 ECZ results');
  if (!documents.some(d => d.type === 'nrc'))         missing.push('NRC document');
  if (!documents.some(d => d.type === 'certificate')) missing.push('Grade 12 certificate');
  if (!documents.some(d => d.type === 'photo'))       missing.push('Passport photo');

  return missing;
}

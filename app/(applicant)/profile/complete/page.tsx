import type { Metadata } from 'next';
import { ProfileCompletionWizard } from '@/components/profile/profile-completion-wizard';

export const metadata: Metadata = {
  title: 'Complete your profile',
};

/**
 * This page lives at /profile/complete.
 * It uses the (applicant) layout (sidebar + topbar) but the wizard itself
 * is full-bleed and handles its own layout internally.
 */
export default function ProfileCompletePage() {
  return <ProfileCompletionWizard />;
}

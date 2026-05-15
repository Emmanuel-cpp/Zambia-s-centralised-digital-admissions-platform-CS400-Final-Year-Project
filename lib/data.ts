import {
  institutions, programmes, applications, recommendations,
  documents, currentUser, notifications,
} from '@/lib/mock-data';
import {
  ADMIN_INSTITUTION_ID, incomingApplications,
} from '@/lib/institution-data';
import type {
  Institution, Programme, Application, Recommendation,
  Notification, IncomingApplication,
} from '@/types/domain';

/* ─────────────────────────────────
   INSTITUTIONS (public side)
───────────────────────────────── */
export function getAllInstitutions(): Institution[] { return institutions; }
export function getInstitutionBySlug(slug: string)  { return institutions.find(i => i.slug === slug); }
export function getInstitutionById(id: string)      { return institutions.find(i => i.id === id); }

/* ─────────────────────────────────
   PROGRAMMES (public side)
───────────────────────────────── */
export function getAllProgrammes(): Programme[]              { return programmes; }
export function getProgrammeBySlug(slug: string)             { return programmes.find(p => p.slug === slug); }
export function getProgrammesByInstitution(institutionId: string) {
  return programmes.filter(p => p.institutionId === institutionId);
}

/* ─────────────────────────────────
   APPLICATIONS (applicant side)
───────────────────────────────── */
export function getMyApplications(): Application[]     { return applications; }
export function getApplicationById(id: string)         { return applications.find(a => a.id === id); }

/* ─────────────────────────────────
   RECOMMENDATIONS
───────────────────────────────── */
export function getMyRecommendations(): Recommendation[] { return recommendations; }

/* ─────────────────────────────────
   NOTIFICATIONS
───────────────────────────────── */
export function getMyNotifications(): Notification[] {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
export function getUnreadNotificationCount(): number {
  return notifications.filter(n => !n.read).length;
}

/* ─────────────────────────────────
   INSTITUTION ADMIN (institution side)
───────────────────────────────── */

/** The currently logged-in admin's institution. Hard-coded as CBU for now. */
export function getAdminInstitution(): Institution {
  const inst = institutions.find(i => i.id === ADMIN_INSTITUTION_ID);
  if (!inst) throw new Error('Admin institution not found in data');
  return inst;
}

/** All programmes offered by the admin's institution */
export function getAdminProgrammes(): Programme[] {
  return programmes.filter(p => p.institutionId === ADMIN_INSTITUTION_ID);
}

/** All incoming applications addressed to the admin's institution */
export function getIncomingApplications(): IncomingApplication[] {
  return [...incomingApplications].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

/** A single incoming application by id */
export function getIncomingApplicationById(id: string): IncomingApplication | undefined {
  return incomingApplications.find(a => a.id === id);
}

/** Aggregated stats for the institution dashboard */
export function getInstitutionStats() {
  const apps = incomingApplications;
  return {
    total:        apps.length,
    submitted:    apps.filter(a => a.status === 'submitted').length,
    underReview:  apps.filter(a => a.status === 'under_review').length,
    accepted:     apps.filter(a => a.status === 'accepted').length,
    rejected:     apps.filter(a => a.status === 'rejected').length,
    waitlisted:   apps.filter(a => a.status === 'waitlisted').length,
    pending:      apps.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
    programmeCount: getAdminProgrammes().length,
  };
}

/* ─────────────────────────────────
   Re-exports
───────────────────────────────── */
export { documents, currentUser };

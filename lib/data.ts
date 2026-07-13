import { api } from './api';
import type {
  Institution, Programme, Application,
  Notification, IncomingApplication,
} from '@/types/domain';

// Keep mock data imports for things not yet on the backend
import {
  recommendations, documents, currentUser, notifications,
} from '@/lib/mock-data';
import {
  ADMIN_INSTITUTION_ID, incomingApplications,
} from '@/lib/institution-data';

/* ─────────────────────────────────
   INSTITUTIONS
───────────────────────────────── */

export async function getAllInstitutions(): Promise<Institution[]> {
  try { 
    const data = await api.get<any[]>('/institutions');
    return data.map(mapInstitution);
  } catch {
    // Fallback to mock data if API is unreachable
    const { institutions } = await import('./mock-data');
    return institutions;
  }
}

export async function getInstitutionBySlug(slug: string): Promise<Institution | undefined> {
  try {
    const data = await api.get<any>(`/institutions/${slug}`);
    return mapInstitution(data);
  } catch {
    const { institutions } = await import('./mock-data');
    return institutions.find(i => i.slug === slug);
  }
}

export async function getInstitutionById(id: string): Promise<Institution | undefined> {
  try {
    // Our API doesn't have a "by id" endpoint, so we fetch all and find locally
    const data = await api.get<any[]>('/institutions');
    const found = data.find((i: any) => String(i.id) === String(id));
    return found ? mapInstitution(found) : undefined;
  } catch {
    const { institutions } = await import('./mock-data');
    return institutions.find((i: Institution) => i.id === id);
  }
}
/* ─────────────────────────────────
   PROGRAMMES
───────────────────────────────── */

export async function getAllProgrammes(): Promise<Programme[]> {
  try {
    const data = await api.get<any[]>('/programmes');
    return data.map(mapProgramme);
  } catch {
    const { programmes } = await import('./mock-data');
    return programmes;
  }
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | undefined> {
  try {
    const data = await api.get<any>(`/programmes/${slug}`);
    return mapProgramme(data);
  } catch {
    const { programmes } = await import('./mock-data');
    return programmes.find((p: Programme) => p.slug === slug);
  }
}

export async function getProgrammesByInstitution(institutionId: string): Promise<Programme[]> {
  try {
    const data = await api.get<any[]>('/programmes');
    return data
      .filter((p: any) => String(p.institution_id) === String(institutionId))
      .map(mapProgramme);
  } catch {
    const { programmes } = await import('./mock-data');
    return programmes.filter((p: Programme) => p.institutionId === institutionId);
  }
}

/* ─────────────────────────────────
   APPLICATIONS (still mock for now)
───────────────────────────────── */

export function getMyApplications(): Application[] {
  const { applications } = require('./mock-data');
  return applications;
}

export function getApplicationById(id: string): Application | undefined {
  const { applications } = require('./mock-data');
  return applications.find((a: Application) => a.id === id);
}

/* ─────────────────────────────────
   RECOMMENDATIONS (still mock)
───────────────────────────────── */

export function getMyRecommendations() {
  return recommendations;
}

/* ─────────────────────────────────
   NOTIFICATIONS (still mock)
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
   INSTITUTION ADMIN (still mock)
───────────────────────────────── */

export function getAdminInstitution() {
  const { institutions } = require('./mock-data');
  return institutions.find((i: Institution) => i.id === ADMIN_INSTITUTION_ID);
}

export function getAdminProgrammes(): Programme[] {
  const { programmes } = require('./mock-data');
  return programmes.filter((p: Programme) => p.institutionId === ADMIN_INSTITUTION_ID);
}

export function getIncomingApplications(): IncomingApplication[] {
  return [...incomingApplications].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export function getIncomingApplicationById(id: string): IncomingApplication | undefined {
  return incomingApplications.find(a => a.id === id);
}

export function getInstitutionStats() {
  const apps = incomingApplications;
  return {
    total:         apps.length,
    submitted:     apps.filter(a => a.status === 'submitted').length,
    underReview:   apps.filter(a => a.status === 'under_review').length,
    accepted:      apps.filter(a => a.status === 'accepted').length,
    rejected:      apps.filter(a => a.status === 'rejected').length,
    waitlisted:    apps.filter(a => a.status === 'waitlisted').length,
    pending:       apps.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
    programmeCount: getAdminProgrammes().length,
  };
}

/* ─────────────────────────────────
   Re-exports
───────────────────────────────── */
export { documents, currentUser };

/* ─────────────────────────────────
   DATA MAPPERS
   Convert Laravel's snake_case response into our TypeScript types
───────────────────────────────── */

function mapInstitution(d: any): Institution {
  return {
    id:                       String(d.id),
    slug:                     d.slug,
    name:                     d.name,
    shortName:                d.short_name,
    type:                     d.type,
    city:                     d.city,
    province:                 d.province,
    description:              d.description ?? '',
    established:              d.established,
    programmeCount:           d.programmes?.length ?? 0,
    applicationDeadline:      d.application_deadline,
    isAcceptingApplications:  d.is_accepting_applications,
    brandColor:               '#1B6B3A',
    imageUrl:                 d.image_url ?? '',
    tags:                     [],
  };
}

function mapProgramme(d: any): Programme {
  return {
    id:               String(d.id),
    slug:             d.slug,
    institutionId:    String(d.institution_id),
    name:             d.name,
    qualification:    d.qualification,
    faculty:          d.school,
    durationYears:    d.duration_years,
    studyMode:        d.study_mode,
    intake:           d.intake ?? '',
    description:      d.description ?? '',
    minRequirements:  (d.requirements ?? []).map((r: any) => ({
      subject:  r.subject,
      minGrade: r.min_grade,
    })),
    tags: [],
  };
}
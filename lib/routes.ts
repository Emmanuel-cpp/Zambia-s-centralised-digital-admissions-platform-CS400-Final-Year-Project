/**
 * Centralised route definitions.
 * Use ROUTES.<key> instead of hardcoding strings — makes refactors trivial
 * and prevents typos in <Link href="..."> calls.
 */
export const ROUTES = {
  // Public
  home:           '/',
  institutions:   '/institutions',
  programmes:     '/programmes',
  institution:    (slug: string) => `/institutions/${slug}`,
  programme:      (slug: string) => `/programmes/${slug}`,
  forInstitutions: '/for-institutions',  // Partnership / contact page
  login:          '/login',
  register:       '/register',

  // Applicant portal
  dashboard:        '/dashboard',
  profile:          '/profile',
  discover:         '/discover',
  recommendations:  '/recommendations',
  applications:     '/applications',
  application:      (id: string) => `/applications/${id}`,
  apply:            (programmeSlug: string) => `/apply/${programmeSlug}`,
  documents:        '/documents',
  notifications:    '/notifications',

  // Institution portal (NOT linked from public site — admin-only)
  institutionDashboard:    '/institution/dashboard',
  institutionProgrammes:   '/institution/programmes',
  institutionApplications: '/institution/applications',
  institutionApplicant:    (id: string) => `/institution/applications/${id}`,
  institutionDecisions:    '/institution/decisions',
} as const;

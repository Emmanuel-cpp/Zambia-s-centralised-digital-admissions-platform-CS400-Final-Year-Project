/**
 * Centralised route definitions.
 * Use ROUTES.<key> instead of hardcoding strings.
 */
export const ROUTES = {
  // Public
  home:             '/',
  institutions:     '/institutions',
  programmes:       '/programmes',
  institution:      (slug: string) => `/institutions/${slug}`,
  programme:        (slug: string) => `/programmes/${slug}`,
  forInstitutions:  '/for-institutions',
  login:            '/login',
  register:         '/register',
  welcome:          '/welcome',          // Post-registration welcome screen
  changePassword:   '/change-password',
  join:             '/join',

  // Applicant portal
  dashboard:        '/dashboard',
  profile:          '/profile',
  profileComplete:  '/profile/complete', // Profile completion wizard
  discover:         '/discover',
  recommendations:  '/recommendations',
  applications:     '/applications',
  application:      (id: string) => `/applications/${id}`,
  apply:            (programmeSlug: string) => `/apply/${programmeSlug}`,
  documents:        '/documents',
  notifications:    '/notifications',

  // Institution portal (admin-only, not linked from public site)
  institutionDashboard:    '/institution/dashboard',
  institutionProgrammes:   '/institution/programmes',
  institutionApplications: '/institution/applications',
  institutionApplicant:    (id: string) => `/institution/applications/${id}`,
  institutionDecisions:    '/institution/decisions',
  institutionProgrammeNew:  '/institution/programmes/new',
  institutionProgrammeEdit: (id: string | number) => `/institution/programmes/${id}/edit`,
  institutionSettings:     '/institution/settings',
  institutionTeam:         '/institution/team',
  institutionActivity:     '/institution/activity',
  
  // ZamAdmit platform administration
  platformDashboard:    '/platform',
  platformInstitutions: '/platform/institutions',
  platformInstitutionNew: '/platform/institutions/new',
  platformInstitution:  (id: string | number) => `/platform/institutions/${id}`,
  platformActivity:     '/platform/activity',
} as const;

export function homeRouteFor(role: string | null | undefined): string {
  if (role === 'platform_admin')    return ROUTES.platformDashboard;
  if (role === 'institution_admin') return ROUTES.institutionDashboard;
  return ROUTES.dashboard;
}

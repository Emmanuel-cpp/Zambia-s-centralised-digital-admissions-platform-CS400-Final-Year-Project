/**
 * Domain models — these mirror the eventual database schema so that
 * swapping mock data for an API later requires zero component changes.
 */

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'waitlisted';

export type InstitutionType = 'public' | 'private';

export interface Institution {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  city: string;
  province: string;
  description: string;
  established: number;
  programmeCount: number;
  applicationDeadline: string;
  isAcceptingApplications: boolean;
  brandColor: string;
  imageUrl: string;
  tags: string[];
}

export interface Programme {
  id: string;
  slug: string;
  institutionId: string;
  name: string;
  qualification: 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'PhD';
  faculty: string;
  durationYears: number;
  studyMode: 'Full-time' | 'Part-time' | 'Distance';
  intake: string;
  description: string;
  minRequirements: GradeRequirement[];
  tags: string[];
}

export interface GradeRequirement {
  subject: string;
  minGrade: number;
}

export interface Application {
  id: string;
  programmeId: string;
  programmeName: string;
  institutionId: string;
  institutionName: string;
  status: ApplicationStatus;
  submittedAt?: string;
  decisionAt?: string;
  lastUpdated: string;
}

export interface Recommendation {
  programme: Programme;
  institution: Institution;
  matchScore: number;
  reasons: string[];
}

export interface Document {
  id: string;
  name: string;
  type: 'nrc' | 'certificate' | 'transcript' | 'photo' | 'birth_certificate' | 'other';
  sizeBytes: number;
  uploadedAt: string;
  verified: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nrc: string;
  phone: string;
  province: string;
  dateOfBirth: string;
  interests: string[];
  grades: GradeRequirement[];
  completionPct: number;
}

export type NotificationType =
  | 'application_submitted'
  | 'application_status_change'
  | 'offer_received'
  | 'document_verified'
  | 'deadline_reminder'
  | 'recommendation';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  linkHref?: string;
}

/* ─────────────────────────────────
   INSTITUTION-SIDE MODELS
───────────────────────────────── */

/** Snapshot of applicant info as captured at submission time */
export interface ApplicantSnapshot {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  nrc: string;
  dateOfBirth: string;
  grades: GradeRequirement[];
  statement: string;
  documentNames: string[];
}

export interface IncomingApplication {
  id: string;
  programmeId: string;
  programmeName: string;
  status: ApplicationStatus;
  submittedAt: string;
  decisionAt?: string;
  lastUpdated: string;
  applicant: ApplicantSnapshot;
  internalNote?: string;
  matchScore?: number | null;
}

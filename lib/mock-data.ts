import type {
  Institution, Programme, Application, Recommendation,
  Document, UserProfile, Notification,
} from '@/types/domain';

/* ─────────────────────────────────
   INSTITUTIONS
───────────────────────────────── */
export const institutions: Institution[] = [
  {
    id: 'cbu', slug: 'copperbelt-university', name: 'Copperbelt University', shortName: 'CBU',
    type: 'public', city: 'Kitwe', province: 'Copperbelt',
    description: 'A leading public university in Zambia with strong programmes in engineering, business, and the natural sciences.',
    established: 1987, programmeCount: 32, applicationDeadline: '2025-06-30',
    isAcceptingApplications: true, brandColor: '#1B6B3A',
    imageUrl: '/images/institutions/cbu.jpg',
    tags: ['Public', 'Engineering', 'Science', 'Business'],
  },
  {
    id: 'unza', slug: 'university-of-zambia', name: 'University of Zambia', shortName: 'UNZA',
    type: 'public', city: 'Lusaka', province: 'Lusaka',
    description: "Zambia's flagship public university, offering the widest range of academic programmes in the country.",
    established: 1965, programmeCount: 58, applicationDeadline: '2025-05-31',
    isAcceptingApplications: true, brandColor: '#1e3a8a',
    imageUrl: '/images/institutions/unza.jpg',
    tags: ['Public', 'Medicine', 'Law', 'Humanities'],
  },
  {
    id: 'mu', slug: 'mulungushi-university', name: 'Mulungushi University', shortName: 'MU',
    type: 'public', city: 'Kabwe', province: 'Central',
    description: 'A modern public university known for its business, education, and ICT programmes.',
    established: 2008, programmeCount: 24, applicationDeadline: '2025-06-15',
    isAcceptingApplications: true, brandColor: '#6d28d9',
    imageUrl: '/images/institutions/mu.jpg',
    tags: ['Public', 'Business', 'Education'],
  },
  {
    id: 'zaou', slug: 'zambia-open-university', name: 'Zambia Open University', shortName: 'ZAOU',
    type: 'public', city: 'Lusaka', province: 'Lusaka',
    description: 'A distance-learning institution providing flexible higher education across Zambia.',
    established: 2002, programmeCount: 18, applicationDeadline: '2025-07-31',
    isAcceptingApplications: true, brandColor: '#0e7490',
    imageUrl: '/images/institutions/zaou.jpg',
    tags: ['Public', 'Distance learning'],
  },
  {
    id: 'nu', slug: 'northrise-university', name: 'Northrise University', shortName: 'NU',
    type: 'private', city: 'Ndola', province: 'Copperbelt',
    description: 'A private faith-based university focused on technology, business, and health sciences.',
    established: 2004, programmeCount: 12, applicationDeadline: '2025-06-30',
    isAcceptingApplications: true, brandColor: '#92400e',
    imageUrl: '/images/institutions/nu.jpg',
    tags: ['Private', 'IT', 'Business', 'Health'],
  },
  {
    id: 'cuz', slug: 'cavendish-university-zambia', name: 'Cavendish University Zambia', shortName: 'CUZ',
    type: 'private', city: 'Lusaka', province: 'Lusaka',
    description: 'A private university offering professional programmes in business, ICT, and law.',
    established: 2004, programmeCount: 16, applicationDeadline: '2025-08-15',
    isAcceptingApplications: false, brandColor: '#6b7280',
    imageUrl: '/images/institutions/cuz.jpg',
    tags: ['Private', 'Business', 'Law'],
  },
];

/* ─────────────────────────────────
   PROGRAMMES (expanded)
───────────────────────────────── */
export const programmes: Programme[] = [
  {
    id: 'cbu-cs', slug: 'cbu-bsc-computer-science', institutionId: 'cbu',
    name: 'BSc Computer Science', qualification: 'Bachelor', faculty: 'School of ICT',
    durationYears: 4, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Four-year programme covering software engineering, data structures, AI, and systems design.',
    minRequirements: [
      { subject: 'Mathematics',     minGrade: 4 },
      { subject: 'English Language', minGrade: 5 },
      { subject: 'Physics',          minGrade: 5 },
    ],
    tags: ['Technology', 'In demand'],
  },
  {
    id: 'cbu-se', slug: 'cbu-beng-software-engineering', institutionId: 'cbu',
    name: 'BEng Software Engineering', qualification: 'Bachelor', faculty: 'School of Engineering',
    durationYears: 4, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Engineering-focused degree blending mathematics, electronics, and large-scale software design.',
    minRequirements: [
      { subject: 'Mathematics',     minGrade: 3 },
      { subject: 'Physics',          minGrade: 4 },
      { subject: 'English Language', minGrade: 5 },
    ],
    tags: ['Engineering', 'Technology'],
  },
  {
    id: 'cbu-mining', slug: 'cbu-beng-mining-engineering', institutionId: 'cbu',
    name: 'BEng Mining Engineering', qualification: 'Bachelor', faculty: 'School of Mines',
    durationYears: 5, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Five-year engineering programme rooted in the Copperbelt mining tradition.',
    minRequirements: [
      { subject: 'Mathematics',     minGrade: 3 },
      { subject: 'Physics',          minGrade: 3 },
      { subject: 'Chemistry',        minGrade: 4 },
    ],
    tags: ['Engineering', 'Mining'],
  },
  {
    id: 'unza-econ', slug: 'unza-ba-economics', institutionId: 'unza',
    name: 'BA Economics', qualification: 'Bachelor', faculty: 'School of Humanities & Social Sciences',
    durationYears: 4, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Comprehensive economics programme covering micro, macro, econometrics, and development economics.',
    minRequirements: [
      { subject: 'Mathematics',     minGrade: 4 },
      { subject: 'English Language', minGrade: 5 },
    ],
    tags: ['Business', 'High employability'],
  },
  {
    id: 'unza-law', slug: 'unza-llb', institutionId: 'unza',
    name: 'LLB Bachelor of Laws', qualification: 'Bachelor', faculty: 'School of Law',
    durationYears: 4, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Foundational law degree leading to admission to the Zambian Bar.',
    minRequirements: [
      { subject: 'English Language', minGrade: 3 },
      { subject: 'Mathematics',     minGrade: 6 },
    ],
    tags: ['Law', 'Professional'],
  },
  {
    id: 'unza-med', slug: 'unza-mbchb-medicine', institutionId: 'unza',
    name: 'MBChB Medicine and Surgery', qualification: 'Bachelor', faculty: 'School of Medicine',
    durationYears: 7, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Seven-year medical doctor programme with strong clinical placements.',
    minRequirements: [
      { subject: 'Biology',         minGrade: 2 },
      { subject: 'Chemistry',        minGrade: 2 },
      { subject: 'Mathematics',     minGrade: 3 },
      { subject: 'English Language', minGrade: 5 },
    ],
    tags: ['Medicine', 'Highly competitive'],
  },
  {
    id: 'mu-acc', slug: 'mu-bcom-accounting', institutionId: 'mu',
    name: 'BCom Accounting', qualification: 'Bachelor', faculty: 'School of Business',
    durationYears: 4, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Professional accounting degree aligned with ZICA and ACCA pathways.',
    minRequirements: [
      { subject: 'Mathematics',     minGrade: 5 },
      { subject: 'English Language', minGrade: 5 },
    ],
    tags: ['Business', 'Professional'],
  },
  {
    id: 'mu-edu', slug: 'mu-bed-secondary', institutionId: 'mu',
    name: 'BEd Secondary Education', qualification: 'Bachelor', faculty: 'School of Education',
    durationYears: 4, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Train as a secondary school teacher with a focus on STEM subjects.',
    minRequirements: [
      { subject: 'English Language', minGrade: 5 },
      { subject: 'Mathematics',     minGrade: 6 },
    ],
    tags: ['Education', 'In demand'],
  },
  {
    id: 'zaou-it', slug: 'zaou-diploma-it', institutionId: 'zaou',
    name: 'Diploma in Information Technology', qualification: 'Diploma', faculty: 'School of ICT',
    durationYears: 3, studyMode: 'Distance', intake: 'January 2026',
    description: 'Distance-learning IT diploma — study from anywhere in Zambia.',
    minRequirements: [
      { subject: 'Mathematics',     minGrade: 6 },
      { subject: 'English Language', minGrade: 6 },
    ],
    tags: ['IT', 'Online'],
  },
  {
    id: 'nu-nursing', slug: 'nu-bsc-nursing', institutionId: 'nu',
    name: 'BSc Nursing', qualification: 'Bachelor', faculty: 'Faculty of Health Sciences',
    durationYears: 4, studyMode: 'Full-time', intake: 'January 2026',
    description: 'Four-year nursing programme with hospital placements.',
    minRequirements: [
      { subject: 'Biology',         minGrade: 4 },
      { subject: 'Chemistry',        minGrade: 5 },
      { subject: 'English Language', minGrade: 5 },
    ],
    tags: ['Health', 'Professional'],
  },
];

/* ─────────────────────────────────
   APPLICATIONS (mock current user)
───────────────────────────────── */
export const applications: Application[] = [
  { id: 'app-1', programmeId: 'cbu-cs',   programmeName: 'BSc Computer Science',        institutionId: 'cbu',  institutionName: 'Copperbelt University',  status: 'accepted',     submittedAt: '2025-03-12', decisionAt: '2025-03-20', lastUpdated: '2025-03-20' },
  { id: 'app-2', programmeId: 'unza-econ', programmeName: 'BA Economics',                institutionId: 'unza', institutionName: 'University of Zambia',   status: 'under_review', submittedAt: '2025-03-08',                          lastUpdated: '2025-03-08' },
  { id: 'app-3', programmeId: 'mu-acc',    programmeName: 'BCom Accounting',             institutionId: 'mu',   institutionName: 'Mulungushi University',  status: 'submitted',    submittedAt: '2025-03-05',                          lastUpdated: '2025-03-05' },
  { id: 'app-4', programmeId: 'cbu-se',    programmeName: 'BEng Software Engineering',   institutionId: 'cbu',  institutionName: 'Copperbelt University',  status: 'draft',                                                            lastUpdated: '2025-03-01' },
];

/* ─────────────────────────────────
   RECOMMENDATIONS
───────────────────────────────── */
export const recommendations: Recommendation[] = [
  { programme: programmes[0], institution: institutions[0], matchScore: 97, reasons: ['Meets all Math requirements (Grade 2)', 'Declared interest: Technology', 'Admissions currently open'] },
  { programme: programmes[3], institution: institutions[1], matchScore: 94, reasons: ['Strong Math results', 'Aligns with Business interest', 'High employability outcome'] },
  { programme: programmes[1], institution: institutions[0], matchScore: 91, reasons: ['Physics Grade 2 qualifies', 'Technology interest alignment', 'Same campus as top choice'] },
  { programme: programmes[6], institution: institutions[2], matchScore: 88, reasons: ['Meets grade thresholds', 'Technology and Business crossover'] },
  { programme: programmes[8], institution: institutions[3], matchScore: 82, reasons: ['Distance learning option', 'IT focus matches your interests'] },
];

/* ─────────────────────────────────
   DOCUMENTS
───────────────────────────────── */
export const documents: Document[] = [
  { id: 'd1', name: 'NRC_Emmanuel_Siamoonga.pdf',  type: 'nrc',                sizeBytes: 1_200_000, uploadedAt: '2025-02-10', verified: true },
  { id: 'd2', name: 'Grade12_Certificate_2023.pdf', type: 'certificate',        sizeBytes: 2_400_000, uploadedAt: '2025-02-10', verified: true },
  { id: 'd3', name: 'Academic_Transcript_ECZ.pdf', type: 'transcript',         sizeBytes: 1_800_000, uploadedAt: '2025-02-10', verified: true },
  { id: 'd4', name: 'Passport_Photo.jpg',          type: 'photo',              sizeBytes:   340_000, uploadedAt: '2025-02-12', verified: true },
  { id: 'd5', name: 'Birth_Certificate.pdf',       type: 'birth_certificate',  sizeBytes:   890_000, uploadedAt: '2025-02-15', verified: false },
];

/* ─────────────────────────────────
   USER PROFILE
───────────────────────────────── */
export const currentUser: UserProfile = {
  id: 'u-1',
  firstName: 'Emmanuel', lastName: 'Siamoonga',
  email: 'emmanuel@cbu.ac.zm', nrc: '231456/78/1',
  phone: '+260 977 123 456', province: 'Copperbelt',
  dateOfBirth: '2002-04-15',
  interests: ['Technology', 'Business'],
  grades: [
    { subject: 'Mathematics',          minGrade: 2 },
    { subject: 'English Language',      minGrade: 3 },
    { subject: 'Physics',               minGrade: 2 },
    { subject: 'Additional Mathematics', minGrade: 3 },
  ],
  completionPct: 85,
};

/* ─────────────────────────────────
   NOTIFICATIONS
───────────────────────────────── */
export const notifications: Notification[] = [
  {
    id: 'n-1', type: 'offer_received',
    title: 'You have an offer from Copperbelt University',
    body: 'Congratulations! Your application to BSc Computer Science has been accepted.',
    createdAt: '2025-03-20T14:32:00Z', read: false,
    linkHref: '/applications/app-1',
  },
  {
    id: 'n-2', type: 'application_status_change',
    title: 'Your application is under review',
    body: 'University of Zambia has started reviewing your BA Economics application.',
    createdAt: '2025-03-08T09:14:00Z', read: false,
    linkHref: '/applications/app-2',
  },
  {
    id: 'n-3', type: 'recommendation',
    title: '3 new programme matches for you',
    body: 'Based on your updated grades, we found 3 new programmes that match your profile.',
    createdAt: '2025-03-06T18:00:00Z', read: true,
    linkHref: '/recommendations',
  },
  {
    id: 'n-4', type: 'application_submitted',
    title: 'Application submitted to Mulungushi University',
    body: 'Your application for BCom Accounting was successfully sent to MU.',
    createdAt: '2025-03-05T11:25:00Z', read: true,
    linkHref: '/applications/app-3',
  },
  {
    id: 'n-5', type: 'document_verified',
    title: 'Your Grade 12 certificate has been verified',
    body: 'ZamAdmit has verified your uploaded certificate. It will be auto-attached to all applications.',
    createdAt: '2025-02-11T16:00:00Z', read: true,
    linkHref: '/documents',
  },
  {
    id: 'n-6', type: 'deadline_reminder',
    title: 'UNZA admissions close in 14 days',
    body: 'University of Zambia stops accepting applications on 31 May 2025. Submit any pending applications soon.',
    createdAt: '2025-05-17T08:00:00Z', read: true,
  },
];

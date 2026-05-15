import { z } from 'zod';

const PROVINCES = [
  'Copperbelt','Lusaka','Northern','Eastern','Western',
  'Southern','Muchinga','North-Western','Luapula','Central',
] as const;

const nrcRegex = /^\d{6}\/\d{2}\/\d{1}$/;

/* ─────────────────────────────────
   STEP 2 — Personal information
───────────────────────────────── */
export const personalInfoSchema = z.object({
  firstName:   z.string().min(2, 'First name is too short'),
  lastName:    z.string().min(2, 'Last name is too short'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nrc:         z.string().regex(nrcRegex, 'NRC must look like 123456/78/9'),
  phone:       z.string().min(10, 'Enter a valid phone number'),
  province:    z.enum(PROVINCES, { errorMap: () => ({ message: 'Please select your province' }) }),
});
export type PersonalInfo = z.infer<typeof personalInfoSchema>;

/* ─────────────────────────────────
   STEP 3 — Grade 12 ECZ Results
   (one row per required subject; minGrade 1=best, 9=worst)
───────────────────────────────── */
export const gradeRowSchema = z.object({
  subject: z.string().min(1, 'Subject required'),
  grade:   z.coerce.number().int().min(1, 'Min 1').max(9, 'Max 9'),
});

export const gradesSchema = z.object({
  rows: z.array(gradeRowSchema).min(1, 'At least one grade is required'),
});
export type Grades = z.infer<typeof gradesSchema>;

/* ─────────────────────────────────
   STEP 4 — Personal statement
───────────────────────────────── */
export const personalStatementSchema = z.object({
  statement: z.string()
    .min(150, 'Personal statement must be at least 150 characters')
    .max(3000, 'Personal statement must be 3000 characters or less'),
});
export type PersonalStatement = z.infer<typeof personalStatementSchema>;

/* ─────────────────────────────────
   STEP 5 — Documents
───────────────────────────────── */
export const documentSelectionSchema = z.object({
  documentIds: z.array(z.string()).min(1, 'Attach at least one document'),
});
export type DocumentSelection = z.infer<typeof documentSelectionSchema>;

/* ─────────────────────────────────
   COMBINED — full application
───────────────────────────────── */
export const applicationSchema = z.object({
  programmeId: z.string(),
  personal: personalInfoSchema,
  grades:   gradesSchema,
  statement: personalStatementSchema.shape.statement,
  documentIds: documentSelectionSchema.shape.documentIds,
});
export type ApplicationDraft = Partial<z.infer<typeof applicationSchema>> & {
  programmeId: string;
};

export { PROVINCES };

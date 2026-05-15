import { z } from 'zod';

const PROVINCES = [
  'Copperbelt','Lusaka','Northern','Eastern','Western',
  'Southern','Muchinga','North-Western','Luapula','Central',
] as const;

const nrcRegex = /^\d{6}\/\d{2}\/\d{1}$/;

export const profileSchema = z.object({
  firstName:   z.string().min(2, 'First name is too short'),
  lastName:    z.string().min(2, 'Last name is too short'),
  email:       z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone:       z.string().min(10, 'Enter a valid phone number'),
  nrc:         z.string().regex(nrcRegex, 'NRC must look like 123456/78/9'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  province:    z.enum(PROVINCES, { errorMap: () => ({ message: 'Please select your province' }) }),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export { PROVINCES };

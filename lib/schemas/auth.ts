import { z } from 'zod';

export const loginSchema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginValues = z.infer<typeof loginSchema>;

const PROVINCES = [
  'Copperbelt','Lusaka','Northern','Eastern','Western',
  'Southern','Muchinga','North-Western','Luapula','Central',
] as const;

/** NRC format: 6 digits / 2 digits / 1 digit (e.g. 231456/78/1) */
const nrcRegex = /^\d{6}\/\d{2}\/\d{1}$/;

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName:  z.string().min(2, 'Last name is too short'),
  email:     z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone:     z.string().min(10, 'Enter a valid phone number'),
  nrc:       z.string().regex(nrcRegex, 'NRC must look like 123456/78/9'),
  province:  z.enum(PROVINCES, { errorMap: () => ({ message: 'Please select your province' }) }),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterValues = z.infer<typeof registerSchema>;

export { PROVINCES };

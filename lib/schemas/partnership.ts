import { z } from 'zod';

export const partnershipInquirySchema = z.object({
  fullName:        z.string().min(2, 'Full name is required'),
  workEmail:       z.string().min(1, 'Work email is required').email('Enter a valid email'),
  jobTitle:        z.string().min(2, 'Job title is required'),
  institutionName: z.string().min(2, 'Institution name is required'),
  phone:           z.string().min(10, 'Enter a valid phone number'),
  studentVolume:   z.enum(
    ['under-500', '500-2000', '2000-5000', '5000-plus'],
    { errorMap: () => ({ message: 'Please select an estimate' }) },
  ),
  message:         z.string().min(20, 'Tell us a bit about your needs (at least 20 characters)').max(1000, 'Keep it under 1000 characters'),
});

export type PartnershipInquiry = z.infer<typeof partnershipInquirySchema>;

export const STUDENT_VOLUME_OPTIONS = [
  { value: 'under-500',  label: 'Under 500 applicants per cycle' },
  { value: '500-2000',   label: '500 – 2,000 applicants' },
  { value: '2000-5000',  label: '2,000 – 5,000 applicants' },
  { value: '5000-plus',  label: 'Over 5,000 applicants' },
] as const;

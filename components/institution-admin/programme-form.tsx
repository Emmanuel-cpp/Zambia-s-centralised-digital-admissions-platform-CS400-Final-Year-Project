'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save, Loader2, AlertCircle, ArrowLeft, GraduationCap } from 'lucide-react';
import {
  Form, FormControl, FormField, FormItem, FormLabel,
  FormMessage, FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

/* ─────────────────────────────────
   Schema — mirrors backend validation
───────────────────────────────── */

const QUALIFICATIONS = ['Certificate', 'Diploma', 'Bachelor', 'Honours', 'Masters', 'PhD'] as const;
const STUDY_MODES    = ['Full-time', 'Part-time', 'Distance'] as const;

// Curated list of common Zambian university schools.
// Plus an "Other (specify)" escape hatch for custom values.
const SCHOOL_OPTIONS = [
  'School of Engineering',
  'School of Information & Communication Technology',
  'School of Business & Management',
  'School of Medicine & Health Sciences',
  'School of Education',
  'School of Law',
  'School of Mines & Mineral Sciences',
  'School of Natural Sciences',
  'School of Humanities & Social Sciences',
  'School of Agriculture & Natural Resources',
  'School of Built Environment',
  'School of Tourism & Hospitality',
];

const schema = z.object({
  name:           z.string().min(3, 'Programme name must be at least 3 characters').max(255),
  qualification:  z.enum(QUALIFICATIONS),
  school:         z.string().min(2, 'Please choose or enter a school').max(255),
  duration_years: z.coerce.number().int().min(1, 'At least 1 year').max(8, 'At most 8 years'),
  study_mode:     z.enum(STUDY_MODES),
  intake:         z.string().min(2, 'Please enter the intake (e.g. January 2026)').max(100),
  description:    z.string().max(5000).optional().nullable(),

  requirements: z.array(z.object({
    subject:   z.string().min(2, 'Subject required').max(100),
    min_grade: z.coerce.number().int().min(1, 'Min 1').max(9, 'Max 9'),
  })).max(12, 'At most 12 requirements'),
});

export type ProgrammeFormValues = z.infer<typeof schema>;

interface ProgrammeFormProps {
  /** When provided, the form is in edit mode and the API endpoint becomes PUT */
  programmeId?: number;
  initialValues?: Partial<ProgrammeFormValues>;
  title:       string;
  description: string;
}

export function ProgrammeForm({
  programmeId, initialValues, title, description,
}: ProgrammeFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  // School select state — handles the "Other (specify)" escape hatch.
  // If the initial school is not in the list, we start in "custom" mode.
  const initialSchool = initialValues?.school ?? '';
  const initialIsCustomSchool = initialSchool !== '' && !SCHOOL_OPTIONS.includes(initialSchool);
  const [useCustomSchool, setUseCustomSchool] = React.useState(initialIsCustomSchool);

  const form = useForm<ProgrammeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:           initialValues?.name ?? '',
      qualification:  initialValues?.qualification ?? 'Bachelor',
      school:         initialValues?.school ?? '',
      duration_years: initialValues?.duration_years ?? 4,
      study_mode:     initialValues?.study_mode ?? 'Full-time',
      intake:         initialValues?.intake ?? '',
      description:    initialValues?.description ?? '',
      requirements:   initialValues?.requirements ?? [
        { subject: 'Mathematics',      min_grade: 5 },
        { subject: 'English Language', min_grade: 5 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name:    'requirements',
  });

  async function onSubmit(values: ProgrammeFormValues) {
    setSubmitting(true);
    setServerError(null);

    try {
      const token = getToken();

      if (programmeId) {
        await api.put(`/admin/programmes/${programmeId}`, values, token ?? undefined);
      } else {
        await api.post('/admin/programmes', values, token ?? undefined);
      }

      router.push(ROUTES.institutionProgrammes);
    } catch (err: any) {
      setServerError(err.message || 'Could not save the programme. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Header */}
        <div>
          <button
            type="button"
            onClick={() => router.push(ROUTES.institutionProgrammes)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-50 hover:text-ink mb-3"
          >
            <ArrowLeft className="size-4" />
            Back to programmes
          </button>
          <div className="flex items-start gap-3">
            <div className="grid place-items-center size-10 rounded-lg bg-brand-50 text-brand-700 shrink-0">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-display-sm text-ink leading-tight">{title}</h1>
              <p className="text-sm text-ink-50 mt-1">{description}</p>
            </div>
          </div>
        </div>

        {/* Basic info section */}
        <Section title="Programme details" description="Public information shown to students.">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Programme name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. BSc Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="qualification" render={({ field }) => (
              <FormItem>
                <FormLabel>Qualification *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    aria-label="Qualification"
                    className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                  >
                    {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="duration_years" render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (years) *</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={8} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* School field with "Other (specify)" hybrid pattern */}
          <FormField control={form.control} name="school" render={({ field }) => (
            <FormItem>
              <FormLabel>School / Faculty *</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <select
                    value={useCustomSchool ? '__other__' : field.value}
                    aria-label="School or faculty"
                    onChange={(e) => {
                      if (e.target.value === '__other__') {
                        setUseCustomSchool(true);
                        field.onChange('');
                      } else {
                        setUseCustomSchool(false);
                        field.onChange(e.target.value);
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                  >
                    <option value="">Choose a school…</option>
                    {SCHOOL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    <option value="__other__">Other (specify…)</option>
                  </select>
                  {useCustomSchool && (
                    <Input
                      placeholder="Enter the school name"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Used to group programmes on your institution page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="study_mode" render={({ field }) => (
              <FormItem>
                <FormLabel>Study mode *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    aria-label="Study mode"
                    className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                  >
                    {STUDY_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="intake" render={({ field }) => (
              <FormItem>
                <FormLabel>Intake *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. January 2026" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  value={field.value ?? ''}
                  rows={5}
                  placeholder="What does this programme cover? What careers does it lead to?"
                  className="w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm resize-y min-h-[112px] focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                />
              </FormControl>
              <FormDescription>
                A few short paragraphs shown on the programme&apos;s public page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </Section>

        {/* Requirements section */}
        <Section
          title="Entry requirements"
          description="Minimum ECZ Grade 12 results students must have to apply. Used by the AI recommender to assess fit."
        >
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_44px] gap-3 px-4 py-2.5 bg-surface-subtle border-b border-border">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Subject</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Min grade</p>
              <span />
            </div>
            {fields.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-ink-50">
                No requirements yet. Add at least one.
              </p>
            )}
            {fields.map((row, i) => (
              <div key={row.id} className="grid grid-cols-[1fr_120px_44px] gap-3 px-4 py-3 border-b border-border last:border-b-0 items-start">
                <FormField control={form.control} name={`requirements.${i}.subject`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="e.g. Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`requirements.${i}.min_grade`} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" min={1} max={9} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i)}
                  aria-label="Remove requirement"
                  className="text-ink-30 hover:text-danger mt-0.5"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ subject: '', min_grade: 5 })}
            className="mt-3"
            disabled={fields.length >= 12}
          >
            <Plus className="size-4" />
            Add subject
          </Button>
          <p className="text-xs text-ink-50 mt-2">
            ECZ grading scale: 1 = distinction (best), 9 = fail.
          </p>
        </Section>

        {/* Error */}
        {serverError && (
          <div className="rounded-md bg-danger-soft border border-danger/20 px-4 py-3 flex items-start gap-2.5">
            <AlertCircle className="size-4 text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-danger font-medium">{serverError}</p>
          </div>
        )}

        {/* Sticky save bar */}
        <div className="sticky bottom-4">
          <div className="rounded-xl border border-border bg-white shadow-elevate p-4 flex items-center justify-between gap-4">
            <p className="text-sm text-ink-50">
              {form.formState.isDirty
                ? 'You have unsaved changes.'
                : programmeId
                  ? 'No changes yet.'
                  : 'Fill in the form to add a new programme.'}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(ROUTES.institutionProgrammes)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    {programmeId ? 'Save changes' : 'Create programme'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

function Section({
  title, description, children,
}: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-white p-6 sm:p-7">
      <header className="mb-5">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-50">{description}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
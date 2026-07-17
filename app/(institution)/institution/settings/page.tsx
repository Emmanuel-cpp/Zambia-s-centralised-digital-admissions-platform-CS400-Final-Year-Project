'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save, Loader2, AlertCircle, Check, Building2, CalendarClock,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import {
  Form, FormControl, FormField, FormItem, FormLabel,
  FormMessage, FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { cn } from '@/lib/utils';

const PROVINCES = [
  'Central', 'Copperbelt', 'Eastern', 'Luapula', 'Lusaka',
  'Muchinga', 'Northern', 'North-Western', 'Southern', 'Western',
] as const;

const schema = z.object({
  name:        z.string().min(3, 'Name must be at least 3 characters').max(255),
  short_name:  z.string().min(2, 'Short name required').max(50),
  city:        z.string().min(2, 'City required').max(100),
  province:    z.string().min(2, 'Please choose a province').max(100),
  description: z.string().max(5000).optional().nullable(),
  application_deadline:      z.string().min(1, 'Deadline required'),
  is_accepting_applications: z.boolean(),
  student_number_prefix: z.string().max(20).regex(/^\d*$/, 'Digits only').optional().nullable(),
  student_number_length: z.coerce.number().int().min(4, 'Min 4').max(20, 'Max 20'),
  application_fee: z.coerce.number().min(20, 'Min K20').max(10000, 'Max K10,000'),
});

type SettingsValues = z.infer<typeof schema>;

interface ApiInstitution {
  id:          number;
  name:        string;
  short_name:  string;
  city:        string;
  province:    string;
  description: string | null;
  application_deadline:      string | null;
  is_accepting_applications: boolean;
  student_number_prefix: string | null;
  student_number_length: number;
  application_fee: string | number;
}

export default function InstitutionSettingsPage() {
  const [loading, setLoading]       = React.useState(true);
  const [loadError, setLoadError]   = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [saved, setSaved]           = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', short_name: '', city: '', province: '',
      description: '', application_deadline: '',
      is_accepting_applications: true,
      student_number_prefix: '', student_number_length: 8,
      application_fee: 150,
    },
  });

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiInstitution>('/admin/institution', token ?? undefined);
        form.reset({
          name:        data.name,
          short_name:  data.short_name,
          city:        data.city,
          province:    data.province,
          description: data.description ?? '',
          // <input type="date"> needs YYYY-MM-DD
          application_deadline: data.application_deadline
            ? data.application_deadline.slice(0, 10)
            : '',
          is_accepting_applications: Boolean(data.is_accepting_applications),
          student_number_prefix: data.student_number_prefix ?? '',
          student_number_length: data.student_number_length ?? 8,
          application_fee: Number(data.application_fee ?? 150),
        });
      } catch (err: any) {
        setLoadError(err.message || 'Could not load institution settings.');
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: SettingsValues) {
    setSubmitting(true);
    setServerError(null);
    setSaved(false);

    try {
      const token = getToken();
      await api.put('/admin/institution', values, token ?? undefined);
      form.reset(values); // clears isDirty so the save bar settles
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setServerError(err.message || 'Could not save settings. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
        <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
        <p className="text-sm text-danger">{loadError}</p>
      </div>
    );
  }

  const accepting = form.watch('is_accepting_applications');

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Manage"
        title="Institution settings"
        description="Control how your institution appears to applicants."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Admissions status */}
          <Section
            title="Admissions status"
            description="Controls the Open/Closed badge students see, and whether new applications can be submitted."
          >
            <button
              type="button"
              onClick={() =>
                form.setValue('is_accepting_applications', !accepting, { shouldDirty: true })
              }
              className={cn(
                'w-full flex items-center justify-between gap-4 rounded-lg border p-4 text-left transition-colors',
                accepting
                  ? 'border-success/40 bg-success-soft'
                  : 'border-border bg-surface-subtle',
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'grid place-items-center size-10 rounded-lg shrink-0',
                  accepting ? 'bg-success text-white' : 'bg-ink-10 text-ink-50',
                )}>
                  <CalendarClock className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {accepting ? 'Accepting applications' : 'Closed to applications'}
                  </p>
                  <p className="text-xs text-ink-50 mt-0.5">
                    {accepting
                      ? 'Students can browse and apply to your open programmes.'
                      : 'Your programmes are visible but marked Closed — no new applications.'}
                  </p>
                </div>
              </div>

              {/* Toggle pill */}
              <span
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
                  accepting ? 'bg-success' : 'bg-ink-20',
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform',
                    accepting ? 'translate-x-[22px]' : 'translate-x-0.5',
                  )}
                />
              </span>
            </button>

            <FormField control={form.control} name="application_deadline" render={({ field }) => (
              <FormItem>
                <FormLabel>Application deadline *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Shown on your institution page and programme cards.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="application_fee" render={({ field }) => (
              <FormItem>
                <FormLabel>Application fee (ZMW) *</FormLabel>
                <FormControl>
                  <Input type="number" min={20} max={10000} step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  What each applicant pays via mobile money. ZamAdmit retains a 5%
                  platform commission; the remainder is forwarded to your institution.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </Section>

          {/* Registration */}
          <Section
            title="Registration"
            description="How student numbers are generated for accepted applicants."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="student_number_prefix" render={({ field }) => (
                <FormItem>
                  <FormLabel>Number prefix</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2610" inputMode="numeric" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>The fixed leading digits.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="student_number_length" render={({ field }) => (
                <FormItem>
                  <FormLabel>Total digits</FormLabel>
                  <FormControl>
                    <Input type="number" min={4} max={20} {...field} />
                  </FormControl>
                  <FormDescription>Full length of the number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <NumberPreview
              prefix={form.watch('student_number_prefix') ?? ''}
              length={Number(form.watch('student_number_length')) || 8}
            />
          </Section>

          {/* Public profile */}
          <Section
            title="Public profile"
            description="Shown on your institution's public page."
          >
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Institution name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Copperbelt University" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="short_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Short name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CBU" {...field} />
                  </FormControl>
                  <FormDescription>Used in badges and compact views.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kitwe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="province" render={({ field }) => (
              <FormItem>
                <FormLabel>Province *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    aria-label="Province"
                    className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                  >
                    <option value="">Choose a province…</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    value={field.value ?? ''}
                    rows={5}
                    placeholder="Tell prospective students what makes your institution distinctive."
                    className="w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm resize-y min-h-[112px] focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </Section>

          {/* Server error */}
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
                {saved ? (
                  <span className="inline-flex items-center gap-1.5 text-success font-semibold">
                    <Check className="size-4" /> Settings saved
                  </span>
                ) : form.formState.isDirty ? (
                  'You have unsaved changes.'
                ) : (
                  'Your settings are up to date.'
                )}
              </p>
              <Button type="submit" disabled={submitting || !form.formState.isDirty}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
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

function NumberPreview({ prefix, length }: { prefix: string; length: number }) {
  const seqDigits = Math.max(1, length - prefix.length);
  const first  = prefix + '1'.padStart(seqDigits, '0');
  const second = prefix + '2'.padStart(seqDigits, '0');
  return (
    <div className="rounded-lg bg-surface-subtle border border-border px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50 mb-1">
        Preview
      </p>
      <p className="text-sm text-ink tabular-nums">
        Students will be numbered: <strong>{first}</strong>, <strong>{second}</strong>, …
        When the range is exhausted, the prefix rolls forward automatically.
      </p>
    </div>
  );
}
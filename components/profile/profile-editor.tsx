'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Check, Loader2 } from 'lucide-react';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  profileSchema, PROVINCES, type ProfileValues,
} from '@/lib/schemas/profile';
import type { UserProfile, GradeRequirement } from '@/types/domain';

interface Props {
  profile: UserProfile;
}

export function ProfileEditor({ profile }: Props) {
  /* Personal info form */
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName:   profile.firstName,
      lastName:    profile.lastName,
      email:       profile.email,
      phone:       profile.phone,
      nrc:         profile.nrc,
      dateOfBirth: profile.dateOfBirth,
      province:    profile.province as ProfileValues['province'],
    },
  });

  /* Grades (managed locally — separate concern from main form) */
  const [grades, setGrades] = React.useState<GradeRequirement[]>(profile.grades);

  function addGrade() {
    setGrades(g => [...g, { subject: '', minGrade: 5 }]);
  }
  function removeGrade(index: number) {
    setGrades(g => g.filter((_, i) => i !== index));
  }
  function updateGrade(index: number, patch: Partial<GradeRequirement>) {
    setGrades(g => g.map((row, i) => i === index ? { ...row, ...patch } : row));
  }

  /* Save state (mock) */
  const [saving, setSaving] = React.useState(false);
  const [saved,  setSaved]  = React.useState(false);

  async function handleSubmit(personal: ProfileValues) {
    setSaving(true);
    setSaved(false);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    // In real app: send personal + grades to API
    console.log('Save profile', { personal, grades });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-7">

        {/* Personal information */}
        <Section
          title="Personal information"
          description="Used to pre-fill your applications. Keep it accurate."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="nrc" render={({ field }) => (
              <FormItem>
                <FormLabel>NRC Number</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="province" render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                >
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </Section>

        {/* Grade 12 results */}
        <Section
          title="Grade 12 ECZ results"
          description="Used to match you with programmes you qualify for. ECZ scale: 1 = distinction, 9 = failing."
        >
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_44px] gap-3 px-4 py-3 bg-surface-subtle border-b border-border">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Subject</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Grade</p>
              <span />
            </div>
            {grades.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_100px_44px] gap-3 px-4 py-3 border-b border-border last:border-b-0 items-center">
                <Input
                  value={row.subject}
                  onChange={e => updateGrade(i, { subject: e.target.value })}
                  placeholder="e.g. Biology"
                />
                <Input
                  type="number"
                  min={1}
                  max={9}
                  value={row.minGrade}
                  onChange={e => updateGrade(i, { minGrade: Number(e.target.value) })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGrade(i)}
                  aria-label={`Remove ${row.subject || 'grade'}`}
                  className="text-ink-30 hover:text-danger"
                  disabled={grades.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addGrade} className="mt-3">
            <Plus className="size-4" />
            Add subject
          </Button>
        </Section>

        {/* Save bar (sticky bottom) */}
        <div className="sticky bottom-4 mt-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-white shadow-elevate p-4 flex items-center justify-between gap-4">
            <p className="text-sm text-ink-50">
              {form.formState.isDirty || saved ? (
                saved ? (
                  <span className="inline-flex items-center gap-1.5 text-success font-semibold">
                    <Check className="size-4" /> Profile saved
                  </span>
                ) : (
                  'You have unsaved changes.'
                )
              ) : (
                'Your profile is up to date.'
              )}
            </p>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

/* Section wrapper */

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
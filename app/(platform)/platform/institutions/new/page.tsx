'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Building2, Loader2, AlertCircle, Copy, Check, ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

const PROVINCES = [
  'Central', 'Copperbelt', 'Eastern', 'Luapula', 'Lusaka',
  'Muchinga', 'Northern', 'North-Western', 'Southern', 'Western',
];

interface OnboardResult {
  institution: { id: number; name: string; short_name: string };
  owner: { name: string; email: string };
  temporary_password: string;
}

export default function OnboardInstitutionPage() {
  const router = useRouter();

  const [form, setForm] = React.useState({
    name: '', short_name: '', city: '', province: '', type: 'University',
    description: '', application_fee: '150', application_deadline: '',
    student_number_prefix: '', student_number_length: '8',
    owner_first_name: '', owner_last_name: '', owner_email: '',
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError]   = React.useState<string | null>(null);
  const [result, setResult] = React.useState<OnboardResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  const canSubmit =
    form.name.trim().length >= 3 &&
    form.short_name.trim().length >= 2 &&
    form.city.trim().length >= 2 &&
    form.province !== '' &&
    form.application_deadline !== '' &&
    form.owner_first_name.trim().length >= 2 &&
    form.owner_last_name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.owner_email.trim());

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const token = getToken();
      const res = await api.post<OnboardResult>('/platform/institutions', {
        ...form,
        application_fee: Number(form.application_fee),
        student_number_length: Number(form.student_number_length),
        student_number_prefix: form.student_number_prefix || null,
      }, token ?? undefined);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Could not onboard this institution.');
    } finally {
      setSubmitting(false);
    }
  }

  async function copyCredentials() {
    if (!result) return;
    await navigator.clipboard.writeText(
      `ZamAdmit access for ${result.institution.name}\n` +
      `Sign in: ${window.location.origin}/login\n` +
      `Email: ${result.owner.email}\n` +
      `Temporary password: ${result.temporary_password}\n` +
      `You will be asked to set a new password on first sign-in.`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  /* Success — credentials shown once */
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <PageHeader
          eyebrow="Platform"
          title="Institution onboarded"
          description={`${result.institution.name} is now live on ZamAdmit.`}
        />

        <div className="rounded-xl border border-success/30 bg-success-soft p-5 sm:p-6 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="size-5 text-success" />
            <p className="text-sm font-semibold text-ink">Owner credentials</p>
          </div>
          <p className="text-sm text-ink-70 leading-relaxed mb-4">
            Share these with {result.owner.name} through a secure channel.
            The password is shown <strong>once</strong> and must be changed at first sign-in.
          </p>

          <dl className="rounded-lg bg-white border border-border divide-y divide-border">
            <div className="flex justify-between gap-3 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-50">Email</dt>
              <dd className="text-sm font-medium text-ink">{result.owner.email}</dd>
            </div>
            <div className="flex justify-between gap-3 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-50">Password</dt>
              <dd className="text-sm font-mono font-semibold text-ink">{result.temporary_password}</dd>
            </div>
          </dl>

          <Button variant="outline" onClick={copyCredentials} className="mt-4">
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
            {copied ? 'Copied' : 'Copy handover message'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => router.push(ROUTES.platformInstitutions)}>
            Back to institutions
          </Button>
          <Button variant="outline" onClick={() => { setResult(null); setForm({
            name: '', short_name: '', city: '', province: '', type: 'University',
            description: '', application_fee: '150', application_deadline: '',
            student_number_prefix: '', student_number_length: '8',
            owner_first_name: '', owner_last_name: '', owner_email: '',
          }); }}>
            Onboard another
          </Button>
        </div>
      </div>
    );
  }

  /* Form */
  return (
    <div className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => router.push(ROUTES.platformInstitutions)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-50 hover:text-ink mb-4"
      >
        <ArrowLeft className="size-4" />
        Back to institutions
      </button>

      <div className="flex items-start gap-3 mb-7">
        <div className="grid place-items-center size-10 rounded-lg bg-brand-50 text-brand-700 shrink-0">
          <Building2 className="size-5" />
        </div>
        <div>
          <h1 className="font-display text-display-sm text-ink leading-tight">Onboard an institution</h1>
          <p className="text-sm text-ink-50 mt-1">
            Creates the institution and its first owner account in one step.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Section title="Institution">
          <Field label="Name *">
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Short name *">
              <Input value={form.short_name} onChange={e => set('short_name', e.target.value)} placeholder="" />
            </Field>
            <Field label="Type">
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                aria-label="Institution type"
                className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
              >
                <option>University</option>
                <option>College</option>
                <option>Institute</option>
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City *">
              <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="" />
            </Field>
            <Field label="Province *">
              <select
                value={form.province}
                onChange={e => set('province', e.target.value)}
                aria-label="Province"
                className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
              >
                <option value="">Choose a province…</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              placeholder="Shown on the institution's public page."
              className="w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:border-brand-600"
            />
          </Field>
        </Section>

        <Section title="Admissions">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Application fee (ZMW) *">
              <Input type="number" min={20} value={form.application_fee} onChange={e => set('application_fee', e.target.value)} />
            </Field>
            <Field label="Application deadline *">
              <Input type="date" value={form.application_deadline} onChange={e => set('application_deadline', e.target.value)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Student number prefix">
              <Input value={form.student_number_prefix} onChange={e => set('student_number_prefix', e.target.value)} placeholder="e.g. 2610" inputMode="numeric" />
            </Field>
            <Field label="Student number length">
              <Input type="number" min={4} max={20} value={form.student_number_length} onChange={e => set('student_number_length', e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="First owner">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First name *">
              <Input value={form.owner_first_name} onChange={e => set('owner_first_name', e.target.value)} />
            </Field>
            <Field label="Last name *">
              <Input value={form.owner_last_name} onChange={e => set('owner_last_name', e.target.value)} />
            </Field>
          </div>
          <Field label="Email *">
            <Input type="email" value={form.owner_email} onChange={e => set('owner_email', e.target.value)} placeholder="registrar@institution.zm" />
          </Field>
          <p className="text-xs text-ink-50">
            This person receives full control of the institution&apos;s account and can invite the rest of their team.
          </p>
        </Section>

        {error && (
          <div className="rounded-md bg-danger-soft border border-danger/20 px-4 py-3 flex items-start gap-2.5">
            <AlertCircle className="size-4 text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-danger font-medium">{error}</p>
          </div>
        )}

        <div className="sticky bottom-4">
          <div className="rounded-xl border border-border bg-white shadow-elevate p-4 flex items-center justify-between gap-4">
            <p className="text-sm text-ink-50">Creates the institution and owner together.</p>
            <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Building2 className="size-4" />}
              Onboard institution
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-ink mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1.5">{label}</label>
      {children}
    </div>
  );
}
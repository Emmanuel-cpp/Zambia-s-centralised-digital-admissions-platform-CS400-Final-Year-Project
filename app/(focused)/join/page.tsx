'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

interface InviteInfo {
  email:       string;
  admin_role:  string;
  institution: { name: string; short_name: string };
}

const ROLE_LABELS: Record<string, string> = {
  owner:              'Owner',
  admissions_officer: 'Admissions officer',
  viewer:             'Viewer',
};

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [invite, setInvite]   = React.useState<InviteInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName]   = React.useState('');
  const [password, setPassword]   = React.useState('');
  const [confirm, setConfirm]     = React.useState('');
  const [submitting, setSubmitting]   = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      if (!token) {
        setError('This invite link is incomplete. Ask for a fresh link.');
        setLoading(false);
        return;
      }
      try {
        const data = await api.get<InviteInfo>(`/invites/${token}`);
        setInvite(data);
      } catch (err: any) {
        setError(err.message || 'This invite link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const canSubmit =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    password.length >= 8 &&
    password === confirm;

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await api.post<{ user: any; token: string }>(
        `/invites/${token}/accept`,
        {
          first_name:            firstName.trim(),
          last_name:             lastName.trim(),
          password,
          password_confirmation: confirm,
        },
      );
      saveAuth(res.token, res.user);
      router.push(ROUTES.institutionDashboard);
    } catch (err: any) {
      setSubmitError(err.message || 'Could not create your account.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="max-w-md mx-auto pt-24 px-4">
        <div className="rounded-xl border border-danger/30 bg-danger-soft p-6 text-center">
          <AlertCircle className="size-10 text-danger mx-auto mb-3" />
          <h1 className="font-display text-xl text-ink mb-2">Invite not valid</h1>
          <p className="text-sm text-ink-70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pt-16 sm:pt-24 px-4 pb-16">
      <div className="text-center mb-8">
        <div className="grid place-items-center size-12 rounded-xl bg-brand-50 text-brand-700 mx-auto mb-4">
          <Building2 className="size-6" />
        </div>
        <h1 className="font-display text-display-sm text-ink">
          Join {invite.institution.name}
        </h1>
        <p className="text-sm text-ink-50 mt-2">
          You&apos;ve been invited as{' '}
          <strong className="text-ink">{ROLE_LABELS[invite.admin_role] ?? invite.admin_role}</strong>{' '}
          for {invite.institution.short_name} on ZamAdmit.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
          <Input value={invite.email} readOnly className="bg-surface-subtle" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="join-first">
              First name
            </label>
            <Input id="join-first" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="join-last">
              Last name
            </label>
            <Input id="join-last" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="join-pass">
            Password
          </label>
          <Input
            id="join-pass"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="join-confirm">
            Confirm password
          </label>
          <Input
            id="join-confirm"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          {confirm.length > 0 && confirm !== password && (
            <p className="text-xs text-danger mt-1.5">Passwords don&apos;t match.</p>
          )}
        </div>

        {submitError && (
          <div className="rounded-md bg-danger-soft border border-danger/20 px-3 py-2.5 flex items-start gap-2">
            <AlertCircle className="size-4 text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{submitError}</p>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={!canSubmit || submitting} className="w-full">
          {submitting
            ? <Loader2 className="size-4 animate-spin" />
            : <ShieldCheck className="size-4" />}
          Create my account
        </Button>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[60vh] grid place-items-center">
          <Loader2 className="size-6 text-brand-600 animate-spin" />
        </div>
      }
    >
      <JoinForm />
    </React.Suspense>
  );
}
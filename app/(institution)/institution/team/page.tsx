'use client';

import * as React from 'react';
import {
  UserPlus, Loader2, AlertCircle, Copy, Check, Trash2, Shield, Clock, X,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { OwnerGuard } from '@/components/institution-admin/owner-guard';

interface TeamMember {
  id:         number;
  first_name: string;
  last_name:  string;
  email:      string;
  admin_role: 'owner' | 'admissions_officer' | 'viewer';
  created_at: string;
}

interface PendingInvite {
  id:         number;
  email:      string;
  admin_role: string;
  expires_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  owner:              'Owner',
  admissions_officer: 'Admissions officer',
  viewer:             'Viewer',
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  owner:              'Full control: settings, programmes, team, and decisions.',
  admissions_officer: 'Can review and decide applications. No settings access.',
  viewer:             'Read-only access to applications and analytics.',
};

export default function TeamPage() {
  return (
    <OwnerGuard>
      <TeamPageInner />
    </OwnerGuard>
  );
}

function TeamPageInner() {
  const { user } = useAuth();

  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [invites, setInvites] = React.useState<PendingInvite[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  // Invite form state
  const [showInvite, setShowInvite]   = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole]   = React.useState('admissions_officer');
  const [inviting, setInviting]       = React.useState(false);
  const [inviteError, setInviteError] = React.useState<string | null>(null);

  // The one-time link, shown after a successful invite
  const [inviteUrl, setInviteUrl] = React.useState<string | null>(null);
  const [copied, setCopied]       = React.useState(false);

  async function load() {
    try {
      const token = getToken();
      const data = await api.get<{ admins: TeamMember[]; invites: PendingInvite[] }>(
        '/admin/team', token ?? undefined,
      );
      setMembers(data.admins);
      setInvites(data.invites);
    } catch (err: any) {
      setError(err.message || 'Could not load your team.');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  async function handleInvite() {
    setInviting(true);
    setInviteError(null);
    try {
      const token = getToken();
      const res = await api.post<{ invite_url: string }>(
        '/admin/team/invites',
        { email: inviteEmail.trim(), admin_role: inviteRole },
        token ?? undefined,
      );
      setInviteUrl(res.invite_url);
      setInviteEmail('');
      await load();
    } catch (err: any) {
      setInviteError(err.message || 'Could not create the invite.');
    } finally {
      setInviting(false);
    }
  }

  async function copyLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRoleChange(memberId: number, role: string) {
    try {
      const token = getToken();
      await api.put(`/admin/team/${memberId}`, { admin_role: role }, token ?? undefined);
      await load();
    } catch (err: any) {
      alert(err.message || 'Could not change the role.');
    }
  }

  async function handleRemove(member: TeamMember) {
    if (!confirm(`Remove ${member.first_name} ${member.last_name} from your team? Their access ends immediately.`)) {
      return;
    }
    try {
      const token = getToken();
      await api.delete(`/admin/team/${member.id}`, token ?? undefined);
      await load();
    } catch (err: any) {
      alert(err.message || 'Could not remove this admin.');
    }
  }

  async function handleRevokeInvite(id: number) {
    try {
      const token = getToken();
      await api.delete(`/admin/team/invites/${id}`, token ?? undefined);
      await load();
    } catch (err: any) {
      alert(err.message || 'Could not revoke the invite.');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Manage"
        title="Team"
        description="The people who run admissions for your institution."
        actions={
          <Button onClick={() => { setShowInvite(v => !v); setInviteUrl(null); }}>
            <UserPlus className="size-4" />
            Invite admin
          </Button>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 text-brand-600 animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
          <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">

          {/* Invite panel */}
          {showInvite && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2 className="text-base font-semibold text-ink">Invite a new admin</h2>
                <button
                  type="button"
                  onClick={() => { setShowInvite(false); setInviteUrl(null); }}
                  className="grid place-items-center size-7 rounded-full text-ink-30 hover:bg-ink-5 hover:text-ink"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              {inviteUrl ? (
                /* Success: show the one-time link */
                <div>
                  <p className="text-sm text-ink-70 mb-3">
                    Invite created. Share this link with the invitee — it can be
                    used <strong>once</strong> and expires in 7 days. For security,
                    it will not be shown again.
                  </p>
                  <div className="flex gap-2">
                    <Input readOnly value={inviteUrl} className="font-mono text-xs" />
                    <Button variant="outline" onClick={copyLink} className="shrink-0">
                      {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-[1fr_220px] gap-3">
                    <Input
                      type="email"
                      placeholder="colleague@institution.zm"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                    />
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value)}
                      aria-label="Role for the new admin"
                      className="h-10 rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600"
                    >
                      <option value="admissions_officer">Admissions officer</option>
                      <option value="viewer">Viewer</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  <p className="text-xs text-ink-50 mt-2">
                    {ROLE_DESCRIPTIONS[inviteRole]}
                  </p>

                  {inviteError && (
                    <div className="mt-3 rounded-md bg-danger-soft border border-danger/20 px-3 py-2 flex items-start gap-2">
                      <AlertCircle className="size-4 text-danger shrink-0 mt-0.5" />
                      <p className="text-sm text-danger">{inviteError}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleInvite}
                    disabled={inviting || !/^\S+@\S+\.\S+$/.test(inviteEmail.trim())}
                    className="mt-4"
                  >
                    {inviting
                      ? <Loader2 className="size-4 animate-spin" />
                      : <UserPlus className="size-4" />}
                    Create invite link
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Members */}
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            {members.map(m => {
              const isSelf = m.id === user?.id;
              return (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-border last:border-b-0"
                >
                  <div className="grid place-items-center size-10 rounded-md bg-brand-600 text-white font-display text-base shrink-0">
                    {m.first_name[0]}{m.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {m.first_name} {m.last_name}
                      {isSelf && <span className="text-ink-30 font-normal"> (you)</span>}
                    </p>
                    <p className="text-xs text-ink-50 truncate">{m.email}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Shield className="size-3.5 text-ink-30 hidden sm:block" />
                    <select
                      value={m.admin_role}
                      onChange={e => handleRoleChange(m.id, e.target.value)}
                      disabled={isSelf}
                      aria-label={`Role for ${m.first_name}`}
                      className={cn(
                        'h-9 rounded-md border border-input bg-white px-2.5 text-sm focus-visible:outline-none focus-visible:border-brand-600',
                        isSelf && 'opacity-60 cursor-not-allowed',
                      )}
                    >
                      <option value="owner">Owner</option>
                      <option value="admissions_officer">Admissions officer</option>
                      <option value="viewer">Viewer</option>
                    </select>

                    {!isSelf && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(m)}
                        aria-label={`Remove ${m.first_name}`}
                        className="text-ink-30 hover:text-danger"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending invites */}
          {invites.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50 mb-2.5">
                Pending invites
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                {invites.map(inv => (
                  <div
                    key={inv.id}
                    className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-b-0"
                  >
                    <Clock className="size-4 text-warning shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{inv.email}</p>
                      <p className="text-xs text-ink-50">
                        {ROLE_LABELS[inv.admin_role] ?? inv.admin_role} · expires{' '}
                        {new Date(inv.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeInvite(inv.id)}
                      className="text-ink-50 hover:text-danger shrink-0"
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
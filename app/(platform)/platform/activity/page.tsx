'use client';

import * as React from 'react';
import { Loader2, AlertCircle, ScrollText } from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatRelativeTime } from '@/lib/format';

interface ApiAuditLog {
  id:         number;
  action:     string;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user: { first_name: string; last_name: string; email: string } | null;
}

const ACTION_LABELS: Record<string, string> = {
  'platform.institution_created':     'onboarded an institution',
  'platform.institution_suspended':   'suspended an institution',
  'platform.institution_reactivated': 'reactivated an institution',
  'platform.admin_suspended':         'suspended an administrator',
  'platform.admin_reactivated':       'reactivated an administrator',
  'application.decided':  'made a decision on an application',
  'payment.completed':    'payment completed',
  'payment.failed':       'payment failed',
  'programme.created':    'created a programme',
  'programme.updated':    'updated a programme',
  'institution.updated':  'updated institution settings',
  'team.invited':         'invited a team member',
  'team.role_changed':    "changed a team member's role",
  'team.removed':         'removed a team member',
  'auth.login':           'signed in',
  'auth.login_failed':    'failed sign-in attempt',
  'auth.login_blocked':   'blocked sign-in attempt',
};

export default function PlatformActivityPage() {
  const [logs, setLogs]       = React.useState<ApiAuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        setLogs(await api.get<ApiAuditLog[]>('/platform/audit-logs', token ?? undefined));
      } catch (err: any) {
        setError(err.message || 'Could not load the activity log.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Activity"
        description="Every recorded action across every institution on ZamAdmit."
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
        logs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <ScrollText className="size-7 text-ink-30 mx-auto mb-3" />
            <p className="font-display text-xl text-ink">No activity yet</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            {logs.map(log => (
              <div key={log.id} className="px-5 py-3.5 border-b border-border last:border-b-0">
                <p className="text-sm text-ink">
                  <strong>{log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System'}</strong>{' '}
                  {ACTION_LABELS[log.action] ?? log.action}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-ink-50">
                  <span>{formatRelativeTime(log.created_at)}</span>
                  {log.ip_address && <span className="tabular-nums">IP {log.ip_address}</span>}
                  {log.new_values && Object.keys(log.new_values).length > 0 && (
                    <span className="font-mono text-[11px] text-ink-30 truncate max-w-full">
                      {JSON.stringify(log.new_values)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
}
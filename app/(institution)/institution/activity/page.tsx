'use client';

import * as React from 'react';
import { Loader2, AlertCircle, ScrollText } from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { OwnerGuard } from '@/components/institution-admin/owner-guard';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatRelativeTime } from '@/lib/format';

interface ApiAuditLog {
  id:         number;
  action:     string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user: { first_name: string; last_name: string; email: string } | null;
}

const ACTION_LABELS: Record<string, string> = {
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
};

export default function ActivityPage() {
  return (
    <OwnerGuard>
      <ActivityPageInner />
    </OwnerGuard>
  );
}

function ActivityPageInner() {
  const [logs, setLogs]       = React.useState<ApiAuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiAuditLog[]>('/admin/audit-logs', token ?? undefined);
        setLogs(data);
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
        eyebrow="Manage"
        title="Activity"
        description="A permanent record of important actions in your institution's account."
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
            <p className="text-sm text-ink-50 mt-2">
              Important actions will be recorded here automatically.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            {logs.map(log => (
              <div key={log.id} className="px-5 py-3.5 border-b border-border last:border-b-0">
                <p className="text-sm text-ink">
                  <strong>
                    {log.user
                      ? `${log.user.first_name} ${log.user.last_name}`
                      : 'System'}
                  </strong>{' '}
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
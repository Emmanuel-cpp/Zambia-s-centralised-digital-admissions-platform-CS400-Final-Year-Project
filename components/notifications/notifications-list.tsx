'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell, Check, GraduationCap, ClipboardCheck,
  AlertTriangle, FileCheck2, Sparkles, ArrowRight, BellOff,
  Loader2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/format';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { cn } from '@/lib/utils';

/* Shape returned by GET /api/notifications */
interface ApiNotification {
  id:         number;
  type:       string;
  title:      string;
  body:       string;
  link:       string | null;
  is_read:    boolean;
  created_at: string;
}

interface ApiResponse {
  notifications: ApiNotification[];
  unread_count:  number;
}

/* Map backend notification types → icons.
   Backend types are application_{status} (e.g. application_accepted). */
function iconFor(type: string): React.ComponentType<{ className?: string }> {
  if (type === 'application_accepted')     return GraduationCap;
  if (type === 'application_rejected')     return ClipboardCheck;
  if (type === 'application_waitlisted')   return AlertTriangle;
  if (type === 'application_under_review') return FileCheck2;
  if (type.startsWith('recommendation'))   return Sparkles;
  return Bell;
}

function accentFor(type: string): string {
  if (type === 'application_accepted')     return 'bg-success-soft text-success';
  if (type === 'application_rejected')     return 'bg-danger-soft text-danger';
  if (type === 'application_waitlisted')   return 'bg-warning-soft text-warning';
  if (type === 'application_under_review') return 'bg-brand-50 text-brand-700';
  return 'bg-brand-50 text-brand-700';
}

export function NotificationsList() {
  const router = useRouter();

  const [items, setItems]     = React.useState<ApiNotification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);
  const [filter, setFilter]   = React.useState<'all' | 'unread'>('all');

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiResponse>('/notifications', token ?? undefined);
        setItems(data.notifications);
      } catch (err: any) {
        setError(err.message || 'Could not load notifications.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visible     = filter === 'unread' ? items.filter(n => !n.is_read) : items;
  const unreadCount = items.filter(n => !n.is_read).length;

  async function markAllAsRead() {
    // Optimistic update — flip the UI immediately, sync in background
    setItems(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      const token = getToken();
      await api.post('/notifications/read-all', {}, token ?? undefined);
    } catch {
      // Silent — worst case the flags reappear on next load
    }
  }

  async function handleOpen(notification: ApiNotification) {
    // Mark as read (optimistically), then navigate if it has a link
    if (!notification.is_read) {
      setItems(prev => prev.map(n =>
        n.id === notification.id ? { ...n, is_read: true } : n,
      ));
      try {
        const token = getToken();
        await api.post(`/notifications/${notification.id}/read`, {}, token ?? undefined);
      } catch {
        // Silent — non-critical
      }
    }

    if (notification.link) {
      router.push(notification.link);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
        <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-1.5">
          <FilterChip
            label={`All (${items.length})`}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterChip
            label={`Unread (${unreadCount})`}
            active={filter === 'unread'}
            onClick={() => setFilter('unread')}
          />
        </div>

        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="gap-1.5">
            <Check className="size-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <ul className="space-y-2">
          {visible.map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              onOpen={() => handleOpen(n)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* Notification item */

function NotificationItem({
  notification, onOpen,
}: { notification: ApiNotification; onOpen: () => void }) {
  const Icon = iconFor(notification.type);

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          'w-full text-left flex items-start gap-4 p-4 sm:p-5 rounded-xl border transition-colors',
          notification.is_read
            ? 'bg-white border-border'
            : 'bg-brand-50/40 border-brand-200',
          notification.link && 'hover:border-brand-300 cursor-pointer',
        )}
      >
        {/* Icon */}
        <div className={cn(
          'grid place-items-center size-10 rounded-lg shrink-0',
          accentFor(notification.type),
        )}>
          <Icon className="size-5" />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className={cn(
              'text-sm leading-snug',
              notification.is_read ? 'text-ink' : 'font-semibold text-ink',
            )}>
              {notification.title}
            </p>
            {!notification.is_read && (
              <span className="size-2 rounded-full bg-brand-600 shrink-0 mt-1.5" aria-label="Unread" />
            )}
          </div>

          <p className="text-sm text-ink-50 mt-1 leading-relaxed">{notification.body}</p>

          <div className="flex items-center justify-between gap-3 mt-3">
            <p className="text-xs text-ink-30">
              {formatRelativeTime(notification.created_at)}
            </p>
            {notification.link && (
              <ArrowRight className="size-3.5 text-ink-30" />
            )}
          </div>
        </div>
      </button>
    </li>
  );
}

/* Filter chip */

function FilterChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors',
        active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-white text-ink-70 border-border hover:border-brand-300 hover:text-ink',
      )}
    >
      {label}
    </button>
  );
}

/* Empty state */

function EmptyState({ filter }: { filter: 'all' | 'unread' }) {
  if (filter === 'unread') {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-12 text-center">
        <Bell className="size-8 text-ink-30 mx-auto mb-3" />
        <h3 className="font-display text-xl text-ink mb-1">You&apos;re all caught up</h3>
        <p className="text-sm text-ink-50">No unread notifications.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-12 text-center">
      <BellOff className="size-8 text-ink-30 mx-auto mb-3" />
      <h3 className="font-display text-xl text-ink mb-1">Nothing here yet</h3>
      <p className="text-sm text-ink-50">
        Notifications about your applications and matches will appear here.
      </p>
    </div>
  );
}
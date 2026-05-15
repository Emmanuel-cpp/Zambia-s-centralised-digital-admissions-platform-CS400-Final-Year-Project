'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Bell, Check, GraduationCap, ClipboardCheck,
  AlertTriangle, FileCheck2, Sparkles, ArrowRight, BellOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/format';
import type { Notification, NotificationType } from '@/types/domain';
import { cn } from '@/lib/utils';

interface Props {
  initialNotifications: Notification[];
}

const ICON_MAP: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  application_submitted:    ClipboardCheck,
  application_status_change: ClipboardCheck,
  offer_received:           GraduationCap,
  document_verified:        FileCheck2,
  deadline_reminder:        AlertTriangle,
  recommendation:           Sparkles,
};

const ACCENT_MAP: Record<NotificationType, string> = {
  application_submitted:    'bg-info-soft text-info',
  application_status_change: 'bg-warning-soft text-warning',
  offer_received:           'bg-success-soft text-success',
  document_verified:        'bg-brand-50 text-brand-700',
  deadline_reminder:        'bg-warning-soft text-warning',
  recommendation:           'bg-brand-50 text-brand-700',
};

export function NotificationsList({ initialNotifications }: Props) {
  const [items, setItems] = React.useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const visible = filter === 'unread' ? items.filter(n => !n.read) : items;
  const unreadCount = items.filter(n => !n.read).length;

  function markAllAsRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }

  function toggleRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
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
              onToggleRead={() => toggleRead(n.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────────────
   Notification item
───────────────────────────────── */

function NotificationItem({
  notification, onToggleRead,
}: { notification: Notification; onToggleRead: () => void }) {
  const Icon = ICON_MAP[notification.type];

  const Wrapper: React.ElementType = notification.linkHref ? Link : 'div';
  const wrapperProps = notification.linkHref ? { href: notification.linkHref } : {};

  return (
    <li>
      <Wrapper
        {...wrapperProps}
        className={cn(
          'flex items-start gap-4 p-4 sm:p-5 rounded-xl border transition-colors',
          notification.read
            ? 'bg-white border-border'
            : 'bg-brand-50/40 border-brand-200',
          notification.linkHref && 'hover:border-brand-300 cursor-pointer',
        )}
      >
        {/* Icon */}
        <div className={cn(
          'grid place-items-center size-10 rounded-lg shrink-0',
          ACCENT_MAP[notification.type],
        )}>
          <Icon className="size-5" />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className={cn(
              'text-sm leading-snug',
              notification.read ? 'text-ink' : 'font-semibold text-ink',
            )}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="size-2 rounded-full bg-brand-600 shrink-0 mt-1.5" aria-label="Unread" />
            )}
          </div>

          <p className="text-sm text-ink-50 mt-1 leading-relaxed">{notification.body}</p>

          <div className="flex items-center justify-between gap-3 mt-3">
            <p className="text-xs text-ink-30">
              {formatRelativeTime(notification.createdAt)}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleRead(); }}
                className="text-xs font-medium text-ink-50 hover:text-brand-700"
              >
                {notification.read ? 'Mark unread' : 'Mark read'}
              </button>
              {notification.linkHref && (
                <ArrowRight className="size-3.5 text-ink-30" />
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </li>
  );
}

/* ─────────────────────────────────
   Filter chip
───────────────────────────────── */

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

/* ─────────────────────────────────
   Empty state
───────────────────────────────── */

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

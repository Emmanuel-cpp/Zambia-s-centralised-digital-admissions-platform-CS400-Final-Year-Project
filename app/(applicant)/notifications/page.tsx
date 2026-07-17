'use client';

import { PageHeader } from '@/components/layout/app-shell';
import { NotificationsList } from '@/components/notifications/notifications-list';

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Notifications"
        description="Updates on your applications and decisions, all in one place."
      />
      <NotificationsList />
    </div>
  );
}
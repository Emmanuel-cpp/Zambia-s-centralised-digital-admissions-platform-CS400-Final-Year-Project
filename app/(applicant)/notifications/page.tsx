import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/app-shell';
import { NotificationsList } from '@/components/notifications/notifications-list';
import { getMyNotifications } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default function NotificationsPage() {
  const notifications = getMyNotifications();

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Notifications"
        description="Updates on your applications, document verifications, and new programme matches."
      />
      <NotificationsList initialNotifications={notifications} />
    </div>
  );
}

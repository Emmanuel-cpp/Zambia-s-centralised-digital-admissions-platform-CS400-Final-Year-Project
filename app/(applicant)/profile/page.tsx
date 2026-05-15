import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/app-shell';
import { ProfileEditor } from '@/components/profile/profile-editor';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { currentUser } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Your profile"
        description="The information here is sent with every application you submit."
      />

      {/* Profile summary */}
      <div className="rounded-xl border border-border bg-white p-5 sm:p-6 mb-6 flex items-center gap-4">
        <Avatar className="size-14 rounded-xl">
          <AvatarFallback className="rounded-xl text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-ink leading-tight">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-sm text-ink-50 truncate">
            {currentUser.email} · {currentUser.province} Province
          </p>
        </div>
        <div className="hidden sm:block text-right shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50">Profile</p>
          <p className="font-display text-2xl text-brand-700 leading-none mt-0.5 tabular-nums">
            {currentUser.completionPct}%
          </p>
        </div>
      </div>

      <div className="mb-7">
        <Progress value={currentUser.completionPct} />
        <p className="text-xs text-ink-50 mt-2">
          A complete profile unlocks better recommendations and faster applications.
        </p>
      </div>

      <ProfileEditor profile={currentUser} />
    </div>
  );
}

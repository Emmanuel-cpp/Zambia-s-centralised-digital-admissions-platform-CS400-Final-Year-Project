'use client';

import { PageHeader } from '@/components/layout/app-shell';
import { ProfileEditor } from '@/components/profile/profile-editor';
import { InterestsEditor } from '@/components/profile/interests-editor';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { currentUser } from '@/lib/mock-data';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-ink-50 text-sm">Loading...</p>
      </div>
    );
  }

  const firstName = user?.first_name      || currentUser.firstName;
  const lastName  = user?.last_name       || currentUser.lastName;
  const email     = user?.email           || currentUser.email;
  const province  = user?.province        || currentUser.province;
  const interests = user?.interests       || [];
  const complete  = user?.profile_complete ? 100 : 40;
  const initials  = `${firstName[0]}${lastName[0]}`.toUpperCase();

  // Merge real auth user data with mock profile structure so the existing
  // ProfileEditor still works while the rest of the form is on real data.
  const mergedProfile = {
    ...currentUser,
    firstName,
    lastName,
    email,
    province: province || currentUser.province,
    completionPct: complete,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Your profile"
        description="The information here is sent with every application you submit."
      />

      {/* Profile summary */}
      <div className="rounded-xl border border-border bg-white p-5 sm:p-6 mb-6 flex items-center gap-4">
        <Avatar className="size-14 rounded-xl">
          <AvatarFallback className="rounded-xl text-lg bg-brand-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-ink leading-tight">
            {firstName} {lastName}
          </p>
          <p className="text-sm text-ink-50 truncate">
            {email} · {province} Province
          </p>
        </div>
        <div className="hidden sm:block text-right shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50">Profile</p>
          <p className="font-display text-2xl text-brand-700 leading-none mt-0.5 tabular-nums">
            {complete}%
          </p>
        </div>
      </div>

      <div className="mb-7">
        <Progress value={complete} />
        <p className="text-xs text-ink-50 mt-2">
          A complete profile unlocks better recommendations and faster applications.
        </p>
      </div>

      {/* Interests — AI-powered match input */}
      <InterestsEditor initialInterests={interests} />

      {/* Existing personal info editor */}
      <ProfileEditor profile={mergedProfile} />
    </div>
  );
}
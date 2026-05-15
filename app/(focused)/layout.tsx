import { PublicNavbar } from '@/components/layout/public-navbar';

/**
 * (focused) route group — for full-attention tasks like the apply wizard.
 *
 * Includes the public navbar (in solid mode, not transparent) so the user
 * keeps brand context and a way out, but no sidebar — keeping focus on the task.
 */
export default function FocusedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <PublicNavbar transparent={false} />
      {children}
    </div>
  );
}

import { Logo } from '@/components/layout/logo';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Single-column centered auth layout used by /login and /register.
 *
 * No marketing panel — by the time a user reaches an auth page they
 * already know what ZamAdmit is. Clean, focused, distraction-free.
 *
 * The Logo at the top links back to home — standard pattern
 * (Stripe, Linear, GitHub all do this).
 */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo — links home */}
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-card px-7 py-8 sm:px-8">
          <h1 className="font-display text-display-sm text-ink leading-tight">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-50">{subtitle}</p>

          <div className="mt-7">{children}</div>

          {footer && (
            <div className="mt-6 pt-5 border-t border-border text-center text-sm text-ink-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
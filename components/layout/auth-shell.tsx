import { Check } from 'lucide-react';
import { Logo } from '@/components/layout/logo';

interface AuthShellProps {
  title: string;
  subtitle: string;
  brandTitle: string;
  brandDescription: string;
  brandPoints: readonly string[];
  children: React.ReactNode;
  /** Optional footer link (e.g. "Already have an account?") */
  footer?: React.ReactNode;
}

export function AuthShell({
  title, subtitle, brandTitle, brandDescription, brandPoints,
  children, footer,
}: AuthShellProps) {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      {/* Brand side — visible only at lg+ */}
      <aside className="hidden lg:flex flex-col bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-12 pt-6 pb-10 text-white">
  <Logo variant="light" />

  <div className="mt-auto mb-auto pt-16">
    <h2 className="font-display text-display-md tracking-tight max-w-md">
      {brandTitle}
    </h2>
    <p className="mt-4 text-base text-white/70 leading-relaxed max-w-md">
      {brandDescription}
    </p>

    <ul className="mt-9 space-y-3">
      {brandPoints.map(point => (
        <li key={point} className="flex items-center gap-3 text-sm text-white/85">
          <span className="grid place-items-center size-6 rounded-full bg-white/15 shrink-0">
            <Check className="size-3 text-white" strokeWidth={3} />
          </span>
          {point}
        </li>
      ))}
    </ul>
  </div>

  <p className="text-xs text-white/40">
    © 2025 ZamAdmit · A CBU CS400 academic project
  </p>
</aside>
      {/* Form side */}
      <div className="flex flex-col lg:justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-12 bg-white">
        <div className="w-full max-w-[420px] mx-auto">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="font-display text-display-sm sm:text-3xl text-ink leading-tight">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-50">{subtitle}</p>

          <div className="mt-8">{children}</div>

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
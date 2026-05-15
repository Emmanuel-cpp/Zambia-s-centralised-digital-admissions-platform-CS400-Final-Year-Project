import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Use light variant for dark backgrounds */
  variant?: 'default' | 'light';
  /** Hide the wordmark, keep just the icon */
  iconOnly?: boolean;
  className?: string;
}

export function Logo({ variant = 'default', iconOnly = false, className }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      className={cn('flex items-center gap-2.5 group', className)}
      aria-label="ZamAdmit home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-brand-600 font-display text-lg leading-none text-white -tracking-[0.04em]">
        Z
      </span>
      {!iconOnly && (
        <span
          className={cn(
            'text-[17px] font-semibold tracking-tight',
            variant === 'light' ? 'text-white' : 'text-ink',
          )}
        >
          Zam
          <span className={variant === 'light' ? 'text-brand-300' : 'text-brand-600'}>Admit</span>
        </span>
      )}
    </Link>
  );
}

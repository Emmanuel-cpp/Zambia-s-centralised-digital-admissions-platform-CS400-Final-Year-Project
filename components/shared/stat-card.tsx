import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  hintVariant?: React.ComponentProps<typeof Badge>['variant'];
  dark?: boolean;
  icon?: React.ReactNode;
}

export function StatCard({
  label, value, hint, hintVariant = 'default', dark = false, icon,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'p-5',
        dark && 'bg-white/5 border-white/10',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn(
            'text-sm',
            dark ? 'text-white/45' : 'text-ink-50',
          )}>
            {label}
          </p>
          <p className={cn(
            'mt-2 font-display text-3xl leading-none tracking-tight',
            dark ? 'text-white' : 'text-ink',
          )}>
            {value}
          </p>
        </div>

        {icon && (
          <div className={cn(
            'grid place-items-center size-9 rounded-md',
            dark ? 'bg-white/10 text-white/70' : 'bg-brand-50 text-brand-600',
          )}>
            {icon}
          </div>
        )}
      </div>

      {hint && (
        <div className="mt-4">
          <Badge variant={hintVariant}>{hint}</Badge>
        </div>
      )}
    </Card>
  );
}

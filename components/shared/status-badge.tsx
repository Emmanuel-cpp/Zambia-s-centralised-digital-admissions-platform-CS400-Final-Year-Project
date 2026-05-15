import { Badge } from '@/components/ui/badge';
import { STATUS_LABEL } from '@/lib/format';
import type { ApplicationStatus } from '@/types/domain';

const VARIANT: Record<ApplicationStatus, React.ComponentProps<typeof Badge>['variant']> = {
  draft:        'default',
  submitted:    'info',
  under_review: 'warning',
  accepted:     'success',
  rejected:     'danger',
  waitlisted:   'warning',
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

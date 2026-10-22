import { Badge } from '@/components/ui/badge';
import { getOrderStatus } from '@/features/orders/lib/orderStatus';
import { cn } from '@/lib/utils';

export function OrderStatusBadge({ status, className }) {
  const { label, variant, icon: Icon } = getOrderStatus(status);
  return (
    <Badge variant={variant} className={cn('status-badge', className)}>
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  );
}

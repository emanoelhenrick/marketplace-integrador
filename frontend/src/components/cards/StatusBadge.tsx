import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABEL } from "@/lib/order-status";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={ORDER_STATUS_BADGE[status]}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

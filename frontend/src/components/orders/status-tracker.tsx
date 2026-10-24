import { cn } from "cn";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/types/order";

export function StatusTracker({ current }: { current: OrderStatus }) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(current);

  return (
    <ol className="flex items-center justify-between" aria-label="Andamento do pedido">
      {ORDER_STATUS_FLOW.map((status, idx) => {
        const isDone = idx <= currentIndex;
        return (
          <li
            key={status}
            aria-current={idx === currentIndex ? "step" : undefined}
            className="flex-1 flex items-center"
          >
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded-full border-2",
                  isDone ? "bg-primary border-primary" : "bg-card border-muted-foreground/40",
                )}
              />
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium text-center",
                  isDone ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {ORDER_STATUS_LABEL[status]}
              </span>
            </div>
            {idx < ORDER_STATUS_FLOW.length - 1 && (
              <div
                aria-hidden
                className={cn("h-0.5 flex-1 -mt-5", idx < currentIndex ? "bg-primary" : "bg-border")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

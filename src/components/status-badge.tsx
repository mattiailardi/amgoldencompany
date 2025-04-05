
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.New:
        return { label: "Nuovo", variant: "bg-blue-100 text-blue-800" };
      case OrderStatus.InPreparation:
        return { label: "In preparazione", variant: "bg-orange-100 text-orange-800" };
      case OrderStatus.ReadyForDelivery:
        return { label: "Pronto", variant: "bg-purple-100 text-purple-800" };
      case OrderStatus.InDelivery:
        return { label: "In consegna", variant: "bg-indigo-100 text-indigo-800" };
      case OrderStatus.Delivered:
        return { label: "Consegnato", variant: "bg-green-100 text-green-800" };
      case OrderStatus.Cancelled:
        return { label: "Annullato", variant: "bg-red-100 text-red-800" };
      default:
        return { label: "Sconosciuto", variant: "bg-gray-100 text-gray-800" };
    }
  };

  const { label, variant } = getStatusInfo(status);

  return (
    <Badge className={cn("font-medium", variant, className)}>
      {label}
    </Badge>
  );
}

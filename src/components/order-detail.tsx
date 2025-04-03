
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { ArrowUpRight, Calendar, MapPin, Phone, User } from "lucide-react";
import { StatusBadge } from "./status-badge";

interface OrderDetailProps {
  order: Order;
  onUpdateStatus?: (orderId: number, newStatus: OrderStatus) => void;
}

export function OrderDetail({ order, onUpdateStatus }: OrderDetailProps) {
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case OrderStatus.New:
        return OrderStatus.InPreparation;
      case OrderStatus.InPreparation:
        return OrderStatus.ReadyForDelivery;
      case OrderStatus.ReadyForDelivery:
        return OrderStatus.InDelivery;
      case OrderStatus.InDelivery:
        return OrderStatus.Delivered;
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case OrderStatus.New:
        return "Inizia Preparazione";
      case OrderStatus.InPreparation:
        return "Segna Pronto";
      case OrderStatus.ReadyForDelivery:
        return "Inizia Consegna";
      case OrderStatus.InDelivery:
        return "Segna Consegnato";
      default:
        return "Aggiorna Stato";
    }
  };

  const calculateTotal = () => {
    if (!order.items?.length) return 0;
    return order.items.reduce((sum, item) => sum + (item.quantity * item.priceAtOrder), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Stato</p>
          <StatusBadge status={order.status} className="mt-1" />
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm text-muted-foreground">Data ordine</p>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{new Date(order.creationDate).toLocaleDateString('it-IT')}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({formatDistanceToNow(new Date(order.creationDate), { addSuffix: true, locale: it })})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Cliente</p>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <p className="font-medium">{order.customerName}</p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Indirizzo di consegna</p>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p>{order.customerAddress}</p>
        </div>
      </div>

      {order.deliveryNotes && (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Note di consegna</p>
          <p className="bg-amber-50 border border-amber-200 p-2 rounded-md text-amber-800 text-sm">
            {order.deliveryNotes}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Prodotti</p>
          <Badge variant="outline" className="text-xs">
            {order.items?.length || 0} prodotti
          </Badge>
        </div>
        <div className="border rounded-md divide-y">
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2">
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x €{item.priceAtOrder.toFixed(2)}
                </p>
              </div>
              <p className="font-medium">€{(item.quantity * item.priceAtOrder).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between items-center p-3 bg-muted/20">
            <p className="font-semibold">Totale ordine</p>
            <p className="font-semibold">€{calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Orario consegna</p>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-xs text-muted-foreground">Richiesto</span>
              <span className="font-medium">{new Date(order.requestedDeliveryTime).toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            
            {order.estimatedDeliveryTime && (
              <div className="flex flex-col text-right">
                <span className="text-xs text-muted-foreground">Stimato</span>
                <span className="font-medium">{new Date(order.estimatedDeliveryTime).toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {onUpdateStatus && getNextStatus(order.status) && (
        <div className="pt-4 border-t flex justify-end gap-3">
          {order.status !== OrderStatus.Cancelled && (
            <Button 
              variant="outline" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onUpdateStatus(order.id, OrderStatus.Cancelled)}
            >
              Annulla ordine
            </Button>
          )}
          
          <Button 
            onClick={() => {
              const nextStatus = getNextStatus(order.status);
              if (nextStatus !== null) {
                onUpdateStatus(order.id, nextStatus);
              }
            }}
          >
            {getNextStatusLabel(order.status)}
          </Button>
        </div>
      )}
    </div>
  );
}

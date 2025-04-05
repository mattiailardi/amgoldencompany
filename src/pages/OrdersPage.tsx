
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { ArrowRight, Clock, MapPin, Plus, Search, Truck } from "lucide-react";
import { Customer, Order, OrderItem, OrderStatus, Product, generateMockCustomers, generateMockOrders, generateMockProducts } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OrderForm } from "@/components/order-form";
import { OrderDetail } from "@/components/order-detail";

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(generateMockOrders());
  const [searchQuery, setSearchQuery] = useState("");
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const activeOrders = orders.filter(order => 
    order.status !== OrderStatus.Delivered && order.status !== OrderStatus.Cancelled
  );

  const historyOrders = orders.filter(order => 
    order.status === OrderStatus.Delivered || order.status === OrderStatus.Cancelled
  );

  // Filter orders based on search query
  const filteredActiveOrders = activeOrders.filter(
    (order) =>
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(item => 
        item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredHistoryOrders = historyOrders.filter(
    (order) =>
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(item => 
        item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleCreateOrder = (newOrder: Order) => {
    // Assign a new ID to the order
    const newId = Math.max(0, ...orders.map(o => o.id)) + 1;
    const orderWithId = { ...newOrder, id: newId };
    
    setOrders([orderWithId, ...orders]);
    setNewOrderOpen(false);
    toast.success("Ordine creato con successo");
  };

  const handleUpdateStatus = (orderId: number, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    ));

    const statusMessages = {
      [OrderStatus.InPreparation]: "Ordine in preparazione",
      [OrderStatus.ReadyForDelivery]: "Ordine pronto per la consegna",
      [OrderStatus.InDelivery]: "Ordine in consegna",
      [OrderStatus.Delivered]: "Ordine consegnato con successo",
      [OrderStatus.Cancelled]: "Ordine annullato"
    };

    toast.success(statusMessages[newStatus] || "Stato ordine aggiornato");
  };

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
        return "Consegnato";
      default:
        return "Dettagli";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestione Ordini</h1>
        <Button className="gap-2" onClick={() => setNewOrderOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuovo Ordine
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca ordini per cliente o prodotto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nuovi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {orders.filter(o => o.status === OrderStatus.New).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Preparazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {orders.filter(o => o.status === OrderStatus.InPreparation).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pronti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {orders.filter(o => o.status === OrderStatus.ReadyForDelivery).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Consegna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {orders.filter(o => o.status === OrderStatus.InDelivery).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 md:w-[400px]">
          <TabsTrigger value="active">Ordini Attivi</TabsTrigger>
          <TabsTrigger value="history">Storico Ordini</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Ordini Attivi</CardTitle>
              <CardDescription>
                Ordini in corso che richiedono attenzione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredActiveOrders}
                columns={[
                  {
                    header: "Cliente",
                    accessorKey: "customerName",
                    cell: (row) => (
                      <div>
                        <div className="font-medium">{row.customerName}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {row.customerAddress}
                        </div>
                      </div>
                    )
                  },
                  {
                    header: "Orario",
                    accessorKey: "requestedDeliveryTime",
                    cell: (row) => (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-3 w-3" />
                          <span>Richiesto: {new Date(row.requestedDeliveryTime).toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                        {row.estimatedDeliveryTime && (
                          <div className="flex items-center gap-1 text-green-600 mt-1">
                            <Truck className="h-3 w-3" />
                            <span>Stimato: {new Date(row.estimatedDeliveryTime).toLocaleTimeString('it-IT', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        )}
                      </div>
                    )
                  },
                  {
                    header: "Prodotti",
                    accessorKey: "items",
                    cell: (row) => (
                      <div>
                        {row.items && row.items.length > 0 ? (
                          <div className="text-sm">
                            <span className="font-medium">{row.items.length} prodotti</span>
                            <div className="text-xs text-gray-500 mt-1">
                              {row.items.slice(0, 2).map((item, i) => (
                                <div key={i}>
                                  {item.quantity}x {item.productName}
                                </div>
                              ))}
                              {row.items.length > 2 && <div>+{row.items.length - 2} altro...</div>}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    )
                  },
                  {
                    header: "Totale",
                    accessorKey: "total",
                    cell: (row) => `€${row.total?.toFixed(2) || '0.00'}`
                  },
                  {
                    header: "Stato",
                    accessorKey: "status",
                    cell: (row) => <StatusBadge status={row.status} />
                  },
                  {
                    header: "Azioni",
                    accessorKey: "id",
                    cell: (row) => {
                      const nextStatus = getNextStatus(row.status);
                      const nextActionLabel = getNextStatusLabel(row.status);
                      
                      return (
                        <div className="flex items-center gap-2">
                          {nextStatus ? (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleUpdateStatus(row.id, nextStatus)}
                            >
                              {nextActionLabel}
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedOrder(row)}
                            >
                              Dettagli
                            </Button>
                          )}
                          {row.status !== OrderStatus.Cancelled && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(row.id, OrderStatus.Cancelled)}
                            >
                              Annulla
                            </Button>
                          )}
                        </div>
                      );
                    }
                  },
                ]}
                searchKey="customerName"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Storico Ordini</CardTitle>
              <CardDescription>
                Ordini completati o annullati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredHistoryOrders}
                columns={[
                  {
                    header: "Rif.",
                    accessorKey: "id",
                    cell: (row) => `#${row.id}`
                  },
                  {
                    header: "Cliente",
                    accessorKey: "customerName",
                  },
                  {
                    header: "Data",
                    accessorKey: "creationDate",
                    cell: (row) => new Date(row.creationDate).toLocaleDateString('it-IT')
                  },
                  {
                    header: "Quando",
                    accessorKey: "creationDate",
                    cell: (row) => formatDistanceToNow(new Date(row.creationDate), { 
                      addSuffix: true,
                      locale: it
                    })
                  },
                  {
                    header: "Totale",
                    accessorKey: "total",
                    cell: (row) => `€${row.total?.toFixed(2) || '0.00'}`
                  },
                  {
                    header: "Stato",
                    accessorKey: "status",
                    cell: (row) => <StatusBadge status={row.status} />
                  },
                  {
                    header: "Azioni",
                    accessorKey: "id",
                    cell: (row) => (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => setSelectedOrder(row)}
                      >
                        Dettagli
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )
                  },
                ]}
                searchKey="customerName"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-teal-50 border-teal-200">
        <CardHeader className="pb-3">
          <CardTitle>Ottimizzazione Consegne</CardTitle>
          <CardDescription className="text-teal-700">
            Raggruppa ordini per zone geografiche per ottimizzare i percorsi di consegna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-lg border p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-teal-400 mx-auto mb-2" />
                <p className="text-gray-500">Mappa dei percorsi ottimizzati</p>
                <p className="text-xs text-gray-400 mt-1">Integrazione con servizi di routing da implementare</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Suggerimenti di Raggruppamento</h4>
              
              <div className="bg-white rounded-lg border p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">Zona Centro</p>
                  <p className="text-sm text-gray-500">3 ordini &middot; Stimati 25 min</p>
                </div>
                <Button size="sm" className="gap-1">
                  Vedi Ordini
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="bg-white rounded-lg border p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">Zona Nord</p>
                  <p className="text-sm text-gray-500">2 ordini &middot; Stimati 15 min</p>
                </div>
                <Button size="sm" className="gap-1">
                  Vedi Ordini
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <Button className="w-full" variant="outline">
                Ottimizza Altri Percorsi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form modale per nuovo ordine */}
      <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crea nuovo ordine</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo ordine
            </DialogDescription>
          </DialogHeader>
          
          <OrderForm onSubmit={handleCreateOrder} onCancel={() => setNewOrderOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Modale dettagli ordine */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dettagli Ordine #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <OrderDetail 
              order={selectedOrder}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrdersPage;

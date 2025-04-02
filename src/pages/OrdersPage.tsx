
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { ArrowRight, Clock, MapPin, Plus, Search, Truck } from "lucide-react";
import { OrderStatus, generateMockOrders } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

export function OrdersPage() {
  const allOrders = generateMockOrders();
  const [searchQuery, setSearchQuery] = useState("");

  const activeOrders = allOrders.filter(order => 
    order.status !== OrderStatus.Delivered && order.status !== OrderStatus.Cancelled
  );

  const historyOrders = allOrders.filter(order => 
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestione Ordini</h1>
        <Button className="gap-2">
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
              {activeOrders.filter(o => o.status === OrderStatus.New).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Preparazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {activeOrders.filter(o => o.status === OrderStatus.InPreparation).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pronti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {activeOrders.filter(o => o.status === OrderStatus.ReadyForDelivery).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Consegna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {activeOrders.filter(o => o.status === OrderStatus.InDelivery).length}
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
                      let nextAction;
                      
                      switch(row.status) {
                        case OrderStatus.New:
                          nextAction = { label: "Inizia Preparazione", variant: "default" };
                          break;
                        case OrderStatus.InPreparation:
                          nextAction = { label: "Segna Pronto", variant: "default" };
                          break;
                        case OrderStatus.ReadyForDelivery:
                          nextAction = { label: "Inizia Consegna", variant: "default" };
                          break;
                        case OrderStatus.InDelivery:
                          nextAction = { label: "Consegnato", variant: "default" };
                          break;
                        default:
                          nextAction = { label: "Dettagli", variant: "outline" };
                      }
                      
                      return (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant={nextAction.variant as any}>
                            {nextAction.label}
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            Annulla
                          </Button>
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
                    cell: () => (
                      <Button variant="ghost" size="sm" className="gap-1">
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
    </div>
  );
}

export default OrdersPage;

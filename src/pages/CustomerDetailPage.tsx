
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, Phone, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Customer, CustomerType, Order, OrderStatus, Product, generateMockCustomers } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { supabase } from "@/lib/supabase";

// Mock orders for demo
const mockOrders = [
  {
    id: 1,
    creationDate: new Date(2025, 3, 1, 19, 30),
    status: OrderStatus.Delivered,
    items: [
      { productName: "Pizza Margherita", quantity: 2, priceAtOrder: 8.5 },
      { productName: "Coca Cola", quantity: 2, priceAtOrder: 3 }
    ],
    totalAmount: 23
  },
  {
    id: 2,
    creationDate: new Date(2025, 3, 5, 20, 15),
    status: OrderStatus.Delivered,
    items: [
      { productName: "Pizza Diavola", quantity: 1, priceAtOrder: 10 },
      { productName: "Pizza Quattro Formaggi", quantity: 1, priceAtOrder: 12 },
      { productName: "Birra", quantity: 2, priceAtOrder: 4 }
    ],
    totalAmount: 30
  },
  {
    id: 3,
    creationDate: new Date(2025, 3, 10, 13, 45),
    status: OrderStatus.Delivered,
    items: [
      { productName: "Pizza Margherita", quantity: 1, priceAtOrder: 8.5 },
      { productName: "Insalata Mista", quantity: 1, priceAtOrder: 5 }
    ],
    totalAmount: 13.5
  }
];

// Generate favorite products based on orders
const generateFavoriteProducts = (orders: any[]) => {
  const productMap = new Map<string, { name: string; count: number; totalSpent: number }>();
  
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      if (productMap.has(item.productName)) {
        const product = productMap.get(item.productName)!;
        product.count += item.quantity;
        product.totalSpent += item.quantity * item.priceAtOrder;
      } else {
        productMap.set(item.productName, {
          name: item.productName,
          count: item.quantity,
          totalSpent: item.quantity * item.priceAtOrder
        });
      }
    });
  });
  
  return Array.from(productMap.values())
    .sort((a, b) => b.count - a.count)
    .map((item, index) => ({
      id: index + 1,
      name: item.name,
      quantity: item.count,
      revenue: item.totalSpent,
      profit: item.totalSpent * 0.4 // Simplified profit calculation
    }));
};

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<any[]>(mockOrders);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  
  // In a real application, we would fetch customer data from Supabase
  // For now, let's use mock data
  useEffect(() => {
    if (id) {
      const mockCustomers = generateMockCustomers();
      const foundCustomer = mockCustomers.find(c => c.id.toString() === id);
      if (foundCustomer) {
        setCustomer(foundCustomer);
      }

      // Calculate total spent
      const spent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      setTotalSpent(spent);

      // Generate favorite products
      const favorites = generateFavoriteProducts(orders);
      setFavoriteProducts(favorites);
    }
  }, [id]);

  if (!customer) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p>Cliente non trovato</p>
      </div>
    );
  }

  const getCustomerTypeInfo = (type: CustomerType) => {
    switch (type) {
      case CustomerType.VIP:
        return { label: "VIP", class: "bg-yellow-100 text-yellow-800 border-yellow-200" };
      case CustomerType.Business:
        return { label: "Business", class: "bg-blue-100 text-blue-800 border-blue-200" };
      case CustomerType.Regular:
      default:
        return { label: "Regular", class: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };

  const typeInfo = getCustomerTypeInfo(customer.customerType);

  // Order columns for data table
  const orderColumns = [
    { 
      header: "Numero", 
      accessorKey: "id"
    },
    { 
      header: "Data", 
      accessorKey: "creationDate",
      cell: (row: any) => format(new Date(row.creationDate), "dd/MM/yyyy HH:mm")
    },
    { 
      header: "Prodotti", 
      accessorKey: "items",
      cell: (row: any) => row.items.length
    },
    { 
      header: "Stato", 
      accessorKey: "status",
      cell: (row: any) => (
        <Badge className={
          row.status === OrderStatus.Delivered 
            ? "bg-green-100 text-green-800 border-green-200" 
            : "bg-orange-100 text-orange-800 border-orange-200"
        }>
          {row.status}
        </Badge>
      )
    },
    { 
      header: "Totale", 
      accessorKey: "totalAmount",
      cell: (row: any) => `€${row.totalAmount.toFixed(2)}`
    },
    {
      header: "Azioni",
      accessorKey: "actions",
      cell: () => (
        <Button variant="ghost" size="sm">
          Dettagli
        </Button>
      )
    }
  ];

  // Favorite product columns
  const favoriteColumns = [
    { 
      header: "Prodotto", 
      accessorKey: "name" 
    },
    { 
      header: "Quantità", 
      accessorKey: "quantity" 
    },
    { 
      header: "Spesa", 
      accessorKey: "revenue",
      cell: (row: any) => `€${row.revenue.toFixed(2)}`
    },
    {
      header: "Margine",
      accessorKey: "profit",
      id: "margin",
      cell: (row: any) => {
        const margin = (row.profit / row.revenue) * 100;
        
        return (
          <Badge variant={margin > 65 ? "default" : margin > 50 ? "outline" : "secondary"}>
            {margin.toFixed(1)}%
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-6">
        <Link to="/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna a Clienti
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Informazioni Cliente</span>
              <Badge className={typeInfo.class}>{typeInfo.label}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium text-xl">
                {customer.firstName[0]}{customer.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{customer.firstName} {customer.lastName}</h2>
                <p className="text-sm text-muted-foreground">Cliente dal {format(new Date(2024, 0, 1), "MMMM yyyy", { locale: it })}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{customer.phone}</p>
                  <p className="text-xs text-muted-foreground">Telefono</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{customer.address}, {customer.houseNumber}</p>
                  <p className="text-xs text-muted-foreground">{customer.zipCode}</p>
                  <p className="text-xs text-muted-foreground">Indirizzo</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Note</p>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {customer.notes || "Nessuna nota disponibile per questo cliente."}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="font-medium">Statistiche cliente</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-2xl font-bold">€{totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">Totale speso</p>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-xs text-slate-500">Ordini effettuati</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Nuovo Ordine
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="orders">
            <TabsList className="mb-4">
              <TabsTrigger value="orders">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ordini
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Calendar className="h-4 w-4 mr-2" />
                Prodotti Preferiti
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Storico Ordini</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={orderColumns} 
                    data={orders}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prodotti Preferiti</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={favoriteColumns} 
                    data={favoriteProducts}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;

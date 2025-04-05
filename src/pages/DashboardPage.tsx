
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { BarChart, PieChart, Pizza, ShoppingCart, Users } from "lucide-react";
import { Customer, CustomerType, Order, OrderStatus, generateMockData, generateMockOrders } from "@/types";
import { BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, Cell, PieChart as RechartsPieChart, Pie, Legend } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

export function DashboardPage() {
  const { customers, products, orders, sales } = generateMockData();
  const recentOrders = generateMockOrders().filter(order => 
    order.status !== OrderStatus.Delivered && order.status !== OrderStatus.Cancelled
  );

  // Calculate stats
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const todaySales = sales.filter(sale => new Date(sale.datetime).toDateString() === new Date().toDateString());
  const productsSoldToday = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);

  // Sales by product data for chart
  const salesByProduct = sales.reduce((acc, sale) => {
    const existingProduct = acc.find(item => item.name === sale.productName);
    if (existingProduct) {
      existingProduct.value += sale.quantity;
    } else {
      acc.push({ name: sale.productName || `Product ${sale.productId}`, value: sale.quantity });
    }
    return acc;
  }, [] as { name: string, value: number }[]);

  // Daily sales data for chart
  const dailySales = [
    { name: "Lun", vendite: 420 },
    { name: "Mar", vendite: 380 },
    { name: "Mer", vendite: 450 },
    { name: "Gio", vendite: 520 },
    { name: "Ven", vendite: 630 },
    { name: "Sab", vendite: 720 },
    { name: "Dom", vendite: 520 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Ultimo aggiornamento: {new Date().toLocaleTimeString('it-IT')}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Fatturato Totale"
          value={`€${totalRevenue.toFixed(2)}`}
          description="Vendite totali"
          icon={BarChart}
          iconColor="text-blue-500"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Ordini Totali"
          value={totalOrders}
          description="Ordini registrati"
          icon={ShoppingCart}
          iconColor="text-orange-500"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Clienti Totali"
          value={totalCustomers}
          description="Clienti registrati"
          icon={Users}
          iconColor="text-green-500"
          trend={{ value: 3.1, isPositive: true }}
        />
        <StatsCard
          title="Prodotti Venduti Oggi"
          value={productsSoldToday}
          description="Prodotti venduti oggi"
          icon={Pizza}
          iconColor="text-purple-500"
          trend={{ value: 8.4, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-4">
          <CardHeader>
            <CardTitle>Vendite Settimanali</CardTitle>
            <CardDescription>
              Analisi delle vendite degli ultimi 7 giorni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart
                data={dailySales}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value}`, 'Vendite']} />
                <Bar dataKey="vendite" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-7 md:col-span-3">
          <CardHeader>
            <CardTitle>Prodotti Venduti</CardTitle>
            <CardDescription>
              Distribuzione dei prodotti venduti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={salesByProduct}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {salesByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} unità`, 'Quantità']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="col-span-12 md:col-span-8">
          <CardHeader>
            <CardTitle>Ordini Attivi</CardTitle>
            <CardDescription>
              Ordini che richiedono attenzione
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recentOrders}
              columns={[
                {
                  header: "Cliente",
                  accessorKey: "customerName",
                },
                {
                  header: "Creato",
                  accessorKey: "creationDate",
                  cell: (row) => formatDistanceToNow(new Date(row.creationDate), { 
                    addSuffix: true,
                    locale: it
                  })
                },
                {
                  header: "Consegna",
                  accessorKey: "requestedDeliveryTime",
                  cell: (row) => new Date(row.requestedDeliveryTime).toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                },
                {
                  header: "Importo",
                  accessorKey: "total",
                  cell: (row) => `€${row.total?.toFixed(2) || '0.00'}`
                },
                {
                  header: "Stato",
                  accessorKey: "status",
                  cell: (row) => <StatusBadge status={row.status} />
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-4">
          <CardHeader>
            <CardTitle>Clienti Recenti</CardTitle>
            <CardDescription>
              Ultimi clienti registrati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 5).map((customer) => (
                <div key={customer.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                    {customer.firstName[0]}{customer.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{customer.firstName} {customer.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{customer.address}, {customer.houseNumber}</p>
                  </div>
                  <Badge 
                    className={
                      customer.customerType === CustomerType.VIP 
                        ? "bg-yellow-100 text-yellow-800" 
                        : customer.customerType === CustomerType.Business 
                        ? "bg-indigo-100 text-indigo-800" 
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {customer.customerType === CustomerType.VIP 
                      ? "VIP" 
                      : customer.customerType === CustomerType.Business 
                      ? "Business" 
                      : "Regular"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;


import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

// Mock data for sales
const mockSalesData = [
  { id: 1, date: "2025-04-04", productName: "Pizza Margherita", category: "Pizze", quantity: 15, price: 8.50, total: 127.50 },
  { id: 2, date: "2025-04-04", productName: "Pizza Diavola", category: "Pizze", quantity: 8, price: 10.00, total: 80.00 },
  { id: 3, date: "2025-04-04", productName: "Coca Cola 33cl", category: "Bibite", quantity: 20, price: 3.00, total: 60.00 },
  { id: 4, date: "2025-04-03", productName: "Pizza Margherita", category: "Pizze", quantity: 12, price: 8.50, total: 102.00 },
  { id: 5, date: "2025-04-03", productName: "Tiramisù", category: "Dolci", quantity: 5, price: 5.00, total: 25.00 },
  { id: 6, date: "2025-04-03", productName: "Acqua 50cl", category: "Bibite", quantity: 15, price: 2.00, total: 30.00 },
  { id: 7, date: "2025-04-02", productName: "Pizza Napoli", category: "Pizze", quantity: 10, price: 9.50, total: 95.00 },
  { id: 8, date: "2025-04-02", productName: "Birra Moretti", category: "Bibite", quantity: 18, price: 4.00, total: 72.00 },
];

// Chart data transformation for categories
const getCategoryChartData = () => {
  const categoryMap = mockSalesData.reduce((acc, sale) => {
    if (!acc[sale.category]) {
      acc[sale.category] = { name: sale.category, value: 0 };
    }
    acc[sale.category].value += sale.total;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  return Object.values(categoryMap);
};

// Chart data transformation for daily sales
const getDailyChartData = () => {
  const dailyMap = mockSalesData.reduce((acc, sale) => {
    if (!acc[sale.date]) {
      acc[sale.date] = { date: format(new Date(sale.date), 'dd/MM'), value: 0 };
    }
    acc[sale.date].value += sale.total;
    return acc;
  }, {} as Record<string, { date: string; value: number }>);
  
  return Object.values(dailyMap);
};

const SalesPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  
  // Columns for the sales data table
  const columns = [
    { header: "Data", accessorKey: "date", cell: (row: any) => format(new Date(row.date), 'dd/MM/yyyy') },
    { header: "Prodotto", accessorKey: "productName" },
    { header: "Categoria", accessorKey: "category" },
    { header: "Quantità", accessorKey: "quantity" },
    { header: "Prezzo", accessorKey: "price", cell: (row: any) => `€${row.price.toFixed(2)}` },
    { header: "Totale", accessorKey: "total", cell: (row: any) => `€${row.total.toFixed(2)}` },
  ];
  
  // Filter data by selected date if in daily tab
  const filteredData = activeTab === "daily" && selectedDate 
    ? mockSalesData.filter(sale => sale.date === format(selectedDate, 'yyyy-MM-dd'))
    : mockSalesData;

  const chartConfig = {
    sales: {
      label: "Vendite",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9",
      },
    },
    quantity: {
      label: "Quantità",
      theme: {
        light: "#10b981",
        dark: "#10b981",
      },
    }
  };

  // Handle chart bar click to navigate to daily report
  const handleBarClick = useCallback((data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedDate = data.activePayload[0].payload.date;
      const formattedDate = clickedDate.split('/').reverse().join('-');
      navigate(`/accounting/report/2025-04-${formattedDate.substring(0, 2)}`);
    }
  }, [navigate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendite</h1>
          <p className="text-gray-500">Gestisci e analizza le tue vendite</p>
        </div>
        <Link to="/sales/new">
          <Button>
            <Plus className="mr-1" />
            Nuova vendita
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Panoramica
          </TabsTrigger>
          <TabsTrigger value="daily">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Vendite giornaliere
          </TabsTrigger>
          <TabsTrigger value="categories">
            Categorie
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Vendite totali</CardTitle>
                <CardDescription>Totale vendite</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  €{mockSalesData.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mockSalesData.length} prodotti venduti
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Prodotto più venduto</CardTitle>
                <CardDescription>Per quantità</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Pizza Margherita
                </div>
                <div className="text-sm text-muted-foreground">
                  27 unità vendute
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Categoria top</CardTitle>
                <CardDescription>Per fatturato</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Pizze
                </div>
                <div className="text-sm text-muted-foreground">
                  €404.50 di vendite
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Andamento vendite</CardTitle>
              <CardDescription>Vendite giornaliere degli ultimi 7 giorni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={getDailyChartData()}
                      onClick={handleBarClick}
                    >
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        content={<ChartTooltipContent />}
                        cursor={{fill: 'rgba(0, 0, 0, 0.1)'}}
                      />
                      <Bar 
                        dataKey="value" 
                        name="sales" 
                        fill="var(--color-sales)" 
                        style={{ cursor: 'pointer' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="text-center text-xs text-slate-500 mt-2">
                Clicca su una barra per vedere il report dettagliato del giorno
              </div>
            </CardContent>
          </Card>

          <Link to="/sales/history" className="flex items-center text-sm text-blue-600 hover:underline">
            Visualizza lo storico completo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seleziona data</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md p-3"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>
                  Vendite del {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
                </CardTitle>
                <CardDescription>
                  Dettaglio delle vendite giornaliere
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Totale vendite</h4>
                      <p className="text-2xl font-bold">
                        €{selectedDate ? 
                          mockSalesData
                            .filter(sale => sale.date === format(selectedDate, 'yyyy-MM-dd'))
                            .reduce((sum, sale) => sum + sale.total, 0)
                            .toFixed(2) : 
                          '0.00'
                        }
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Prodotti venduti</h4>
                      <p className="text-2xl font-bold">
                        {selectedDate ? 
                          mockSalesData
                            .filter(sale => sale.date === format(selectedDate, 'yyyy-MM-dd'))
                            .reduce((sum, sale) => sum + sale.quantity, 0) : 
                          '0'
                        }
                      </p>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="flex gap-2">
                    <Link to="/sales/new">
                      <Button size="sm" variant="outline">
                        <Plus className="mr-1 h-4 w-4" />
                        Aggiungi vendite
                      </Button>
                    </Link>
                    
                    {selectedDate && mockSalesData.some(sale => sale.date === format(selectedDate, 'yyyy-MM-dd')) && (
                      <Link to={`/accounting/report/${format(selectedDate, 'yyyy-MM-dd')}`}>
                        <Button size="sm" variant="secondary">
                          <BarChart3 className="mr-1 h-4 w-4" />
                          Report dettagliato
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {filteredData.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredData} 
              searchKey="productName"
            />
          ) : (
            <Card className="text-center py-8">
              <p className="text-muted-foreground">Nessuna vendita registrata per questa data.</p>
              <div className="mt-4">
                <Link to="/sales/new">
                  <Button>
                    <Plus className="mr-1" />
                    Registra vendite
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendite per categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getCategoryChartData()}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" name="sales" fill="var(--color-sales)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Dettaglio Categorie</CardTitle>
                <CardDescription>Suddivisione per categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(mockSalesData.map(s => s.category))).map((category) => {
                    const categoryTotal = mockSalesData
                      .filter(s => s.category === category)
                      .reduce((sum, sale) => sum + sale.total, 0);
                    
                    const categoryQuantity = mockSalesData
                      .filter(s => s.category === category)
                      .reduce((sum, sale) => sum + sale.quantity, 0);
                    
                    return (
                      <div key={category as string} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{category}</p>
                          <p className="text-sm text-muted-foreground">{categoryQuantity} prodotti</p>
                        </div>
                        <p className="font-medium">€{categoryTotal.toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DataTable 
            columns={columns} 
            data={mockSalesData} 
            searchKey="category"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesPage;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  Euro, 
  CreditCard, 
  HandCoins, 
  Coffee,
  Utensils,
  Pizza,
  Wine,
  Download,
  Share,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

// Colori per i grafici
const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ec4899", "#ef4444"];

const DailyReportPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("riepilogo");
  
  // Stati per i dati
  const [summary, setSummary] = useState({
    date: date || "",
    totalIncome: 0,
    totalExpenses: 0,
    profit: 0,
    profitMargin: 0,
    orderCount: 0,
    avgTicket: 0
  });
  
  // Dati di esempio per le entrate per categoria
  const [incomeByCategory, setIncomeByCategory] = useState([
    { name: "Pizze", value: 1250.75, percent: 45 },
    { name: "Bevande", value: 750.25, percent: 27 },
    { name: "Antipasti", value: 420.50, percent: 15 },
    { name: "Dolci", value: 320.00, percent: 12 },
    { name: "Extra", value: 35.50, percent: 1 }
  ]);
  
  // Dati di esempio per le spese per categoria
  const [expensesByCategory, setExpensesByCategory] = useState([
    { name: "Materie Prime", value: 580.25, percent: 48 },
    { name: "Personale", value: 350.50, percent: 29 },
    { name: "Utenze", value: 120.75, percent: 10 },
    { name: "Affitto", value: 150.00, percent: 12 },
    { name: "Altri costi", value: 15.00, percent: 1 }
  ]);
  
  // Dati di esempio per i prodotti più venduti
  const [topSellingItems, setTopSellingItems] = useState([
    { id: 1, name: "Margherita", quantity: 42, revenue: 378.00, profit: 290.00 },
    { id: 2, name: "Diavola", quantity: 38, revenue: 418.00, profit: 310.00 },
    { id: 3, name: "Quattro Stagioni", quantity: 24, revenue: 288.00, profit: 210.00 },
    { id: 4, name: "Birra Media", quantity: 56, revenue: 280.00, profit: 190.00 },
    { id: 5, name: "Acqua Naturale", quantity: 62, revenue: 124.00, profit: 100.00 }
  ]);
  
  // Dati di esempio per gli ordini della giornata
  const [dailyOrders, setDailyOrders] = useState([
    { id: 1, time: "12:30", table: "Tavolo 4", amount: 68.50, items: 7, payment: "Carta" },
    { id: 2, time: "13:15", table: "Tavolo 7", amount: 54.00, items: 5, payment: "Contanti" },
    { id: 3, time: "13:45", table: "Tavolo 2", amount: 93.00, items: 9, payment: "Carta" },
    { id: 4, time: "19:30", table: "Tavolo 1", amount: 120.50, items: 12, payment: "Carta" },
    { id: 5, time: "20:00", table: "Tavolo 9", amount: 75.00, items: 8, payment: "Contanti" },
    { id: 6, time: "20:45", table: "Tavolo 5", amount: 84.50, items: 7, payment: "Carta" },
    { id: 7, time: "21:15", table: "Tavolo 3", amount: 67.00, items: 6, payment: "Contanti" },
    { id: 8, time: "21:45", table: "Tavolo 8", amount: 102.00, items: 11, payment: "Carta" }
  ]);
  
  // Dati di esempio per le spese della giornata
  const [dailyExpenses, setDailyExpenses] = useState([
    { id: 1, description: "Farina 00", category: "Materie Prime", amount: 120.00 },
    { id: 2, description: "Mozzarella", category: "Materie Prime", amount: 180.50 },
    { id: 3, description: "Salario personale di sala", category: "Personale", amount: 180.00 },
    { id: 4, description: "Salario pizzaiolo", category: "Personale", amount: 170.50 },
    { id: 5, description: "Bolletta elettricità", category: "Utenze", amount: 120.75 },
    { id: 6, description: "Affitto locale", category: "Affitto", amount: 150.00 },
    { id: 7, description: "Pomodoro San Marzano", category: "Materie Prime", amount: 95.00 },
    { id: 8, description: "Cancelleria", category: "Altri costi", amount: 15.00 }
  ]);
  
  // Dati di esempio per l'andamento orario
  const [hourlyData, setHourlyData] = useState([
    { hour: "11-12", income: 120.50, orders: 2 },
    { hour: "12-13", income: 310.75, orders: 5 },
    { hour: "13-14", income: 420.00, orders: 7 },
    { hour: "14-15", income: 180.25, orders: 3 },
    { hour: "18-19", income: 250.00, orders: 4 },
    { hour: "19-20", income: 520.50, orders: 8 },
    { hour: "20-21", income: 680.00, orders: 10 },
    { hour: "21-22", income: 450.00, orders: 7 },
    { hour: "22-23", income: 280.00, orders: 4 }
  ]);
  
  useEffect(() => {
    // Qui in una applicazione reale faresti un fetch dei dati dal database
    const fetchData = async () => {
      try {
        // Simuliamo un caricamento
        setLoading(true);
        
        // Qui imposteresti i dati dal backend
        setSummary({
          date: date || "",
          totalIncome: 2777.00,
          totalExpenses: 1216.50,
          profit: 1560.50,
          profitMargin: 56.2,
          orderCount: 50,
          avgTicket: 55.54
        });
        
        // Fine del caricamento
        setLoading(false);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [date]);
  
  // Formatta la data in un formato leggibile
  const formattedDate = date 
    ? format(parseISO(date), "EEEE d MMMM yyyy", { locale: it })
    : "";
  
  const handleBack = () => {
    navigate("/accounting");
  };
  
  // Funzione per formattare le cifre come valuta
  const formatCurrency = (value: number) => {
    return `€${value.toFixed(2)}`;
  };
  
  // Custom tooltip per i grafici a torta
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-muted-foreground">{payload[0].payload.percent}%</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold capitalize">{formattedDate}</h1>
            <p className="text-muted-foreground">Rapporto giornaliero dettagliato</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            <span>Stampa</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Esporta</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share className="h-4 w-4" />
            <span>Condividi</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Entrate</span>
              <HandCoins className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalIncome)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Media per ordine: {formatCurrency(summary.avgTicket)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Uscite</span>
              <CreditCard className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {(summary.totalExpenses / summary.totalIncome * 100).toFixed(1)}% delle entrate
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Profitto</span>
              <Euro className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.profit)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Margine: {summary.profitMargin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Ordini</span>
              <Utensils className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{summary.orderCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Totale ordini del giorno
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="riepilogo">Riepilogo</TabsTrigger>
          <TabsTrigger value="ordini">Ordini</TabsTrigger>
          <TabsTrigger value="spese">Spese</TabsTrigger>
          <TabsTrigger value="andamento">Andamento orario</TabsTrigger>
        </TabsList>
        
        <TabsContent value="riepilogo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span>Entrate per categoria</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {incomeByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <ul className="space-y-3">
                    {incomeByCategory.map((category, index) => (
                      <li key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(category.value)}</div>
                          <div className="text-xs text-muted-foreground">{category.percent}%</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-red-500" />
                  <span>Spese per categoria</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <ul className="space-y-3">
                    {expensesByCategory.map((category, index) => (
                      <li key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(category.value)}</div>
                          <div className="text-xs text-muted-foreground">{category.percent}%</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Prodotti più venduti</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={topSellingItems}
                columns={[
                  {
                    header: "Prodotto",
                    accessorKey: "name",
                    cell: (row) => {
                      let icon;
                      if (row.name.toLowerCase().includes("pizza") || row.name.toLowerCase().includes("margherita") || row.name.toLowerCase().includes("diavola") || row.name.toLowerCase().includes("stagioni")) {
                        icon = <Pizza className="h-4 w-4 text-orange-500 mr-2" />;
                      } else if (row.name.toLowerCase().includes("birra") || row.name.toLowerCase().includes("vino")) {
                        icon = <Wine className="h-4 w-4 text-purple-500 mr-2" />;
                      } else if (row.name.toLowerCase().includes("acqua")) {
                        icon = <Coffee className="h-4 w-4 text-blue-500 mr-2" />;
                      } else {
                        icon = <Utensils className="h-4 w-4 text-gray-500 mr-2" />;
                      }
                      
                      return (
                        <div className="flex items-center">
                          {icon}
                          <span>{row.name}</span>
                        </div>
                      );
                    }
                  },
                  {
                    header: "Quantità",
                    accessorKey: "quantity",
                    cell: (row) => row.quantity
                  },
                  {
                    header: "Incasso",
                    accessorKey: "revenue",
                    cell: (row) => formatCurrency(row.revenue)
                  },
                  {
                    header: "Profitto",
                    accessorKey: "profit",
                    cell: (row) => formatCurrency(row.profit)
                  },
                  {
                    header: "Margine",
                    id: "margin",
                    cell: (row) => {
                      const margin = (row.profit / row.revenue) * 100;
                      
                      return (
                        <Badge variant={margin > 65 ? "success" : margin > 50 ? "outline" : "secondary"}>
                          {margin.toFixed(1)}%
                        </Badge>
                      );
                    }
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ordini" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ordini della giornata</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={dailyOrders}
                columns={[
                  {
                    header: "ID",
                    accessorKey: "id",
                    cell: (row) => `#${row.id}`
                  },
                  {
                    header: "Ora",
                    accessorKey: "time",
                  },
                  {
                    header: "Tavolo",
                    accessorKey: "table",
                  },
                  {
                    header: "Articoli",
                    accessorKey: "items",
                  },
                  {
                    header: "Importo",
                    accessorKey: "amount",
                    cell: (row) => formatCurrency(row.amount)
                  },
                  {
                    header: "Pagamento",
                    accessorKey: "payment",
                    cell: (row) => {
                      const isCard = row.payment === "Carta";
                      return (
                        <Badge variant={isCard ? "outline" : "secondary"}>
                          {isCard ? 
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" /> 
                              <span>Carta</span>
                            </div> : 
                            <div className="flex items-center gap-1">
                              <Euro className="h-3 w-3" /> 
                              <span>Contanti</span>
                            </div>
                          }
                        </Badge>
                      );
                    }
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spese" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spese della giornata</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={dailyExpenses}
                columns={[
                  {
                    header: "ID",
                    accessorKey: "id",
                    cell: (row) => `#${row.id}`
                  },
                  {
                    header: "Descrizione",
                    accessorKey: "description",
                  },
                  {
                    header: "Categoria",
                    accessorKey: "category",
                    cell: (row) => (
                      <Badge 
                        variant="outline" 
                        className={
                          row.category === "Materie Prime" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          row.category === "Personale" ? "bg-green-50 text-green-700 border-green-200" :
                          row.category === "Utenze" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          row.category === "Affitto" ? "bg-orange-50 text-orange-700 border-orange-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {row.category}
                      </Badge>
                    )
                  },
                  {
                    header: "Importo",
                    accessorKey: "amount",
                    cell: (row) => formatCurrency(row.amount)
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="andamento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Andamento orario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === "income") {
                          return [formatCurrency(value as number), "Incasso"];
                        } else {
                          return [value, "Ordini"];
                        }
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="income" name="Incasso" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="orders" name="Ordini" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyReportPage;

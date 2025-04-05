
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks } from "date-fns";
import { it } from "date-fns/locale";
import { 
  ArrowLeft, 
  ArrowRight, 
  CalendarDays, 
  CreditCard, 
  Euro, 
  FilePlus, 
  HandCoins,
  Receipt,
  Tag 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/stats-card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Line, 
  LineChart 
} from "recharts";

// Mock data for the accounting overview
const mockWeeklyData = [
  { day: "Lunedì", income: 850.50, expenses: 320.25, profit: 530.25 },
  { day: "Martedì", income: 920.00, expenses: 450.75, profit: 469.25 },
  { day: "Mercoledì", income: 1150.75, expenses: 380.50, profit: 770.25 },
  { day: "Giovedì", income: 1320.25, expenses: 425.00, profit: 895.25 },
  { day: "Venerdì", income: 1580.00, expenses: 560.25, profit: 1019.75 },
  { day: "Sabato", income: 1950.50, expenses: 620.75, profit: 1329.75 },
  { day: "Domenica", income: 1420.75, expenses: 480.25, profit: 940.50 },
];

const mockMonthlyData = [
  { week: "Settimana 1", income: 8050.50, expenses: 3220.25, profit: 4830.25 },
  { week: "Settimana 2", income: 8920.00, expenses: 3450.75, profit: 5469.25 },
  { week: "Settimana 3", income: 9150.75, expenses: 3580.50, profit: 5570.25 },
  { week: "Settimana 4", income: 9320.25, expenses: 3425.00, profit: 5895.25 },
];

const mockYearlyData = [
  { month: "Gen", income: 32050.50, expenses: 12220.25, profit: 19830.25 },
  { month: "Feb", income: 28920.00, expenses: 11450.75, profit: 17469.25 },
  { month: "Mar", income: 34150.75, expenses: 13580.50, profit: 20570.25 },
  { month: "Apr", income: 36320.25, expenses: 14425.00, profit: 21895.25 },
  { month: "Mag", income: 38580.00, expenses: 15560.25, profit: 23019.75 },
  { month: "Giu", income: 41950.50, expenses: 17620.75, profit: 24329.75 },
  { month: "Lug", income: 45420.75, expenses: 18480.25, profit: 26940.50 },
  { month: "Ago", income: 42150.75, expenses: 17580.50, profit: 24570.25 },
  { month: "Set", income: 38320.25, expenses: 15425.00, profit: 22895.25 },
  { month: "Ott", income: 35580.00, expenses: 14560.25, profit: 21019.75 },
  { month: "Nov", income: 31950.50, expenses: 13620.75, profit: 18329.75 },
  { month: "Dic", income: 39420.75, expenses: 16480.25, profit: 22940.50 },
];

// Top expense and income categories
const mockTopExpenseCategories = [
  { name: "Materie Prime", amount: 1250.75 },
  { name: "Stipendi", amount: 850.25 },
  { name: "Utenze", amount: 420.50 },
  { name: "Affitto", amount: 350.00 },
];

const mockTopIncomeCategories = [
  { name: "Pizze", amount: 5200.75 },
  { name: "Bevande", amount: 2350.25 },
  { name: "Dolci", amount: 920.50 },
  { name: "Antipasti", amount: 850.00 },
];

const AccountingPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("settimanale");
  
  // Calculate the start and end of the current week
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Get an array of dates for the current week
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek
  });

  // Summary calculations
  const totalIncome = mockWeeklyData.reduce((sum, day) => sum + day.income, 0);
  const totalExpenses = mockWeeklyData.reduce((sum, day) => sum + day.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;
  const profitMargin = (totalProfit / totalIncome) * 100;

  // Navigation functions for the date range
  const handlePreviousPeriod = () => {
    if (activeTab === "settimanale") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (activeTab === "mensile") {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setFullYear(currentDate.getFullYear() - 1);
      setCurrentDate(newDate);
    }
  };

  const handleNextPeriod = () => {
    if (activeTab === "settimanale") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (activeTab === "mensile") {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setFullYear(currentDate.getFullYear() + 1);
      setCurrentDate(newDate);
    }
  };

  // Format the date range for display
  const getDateRangeLabel = () => {
    if (activeTab === "settimanale") {
      return `${format(startOfCurrentWeek, "d MMMM", { locale: it })} - ${format(endOfCurrentWeek, "d MMMM yyyy", { locale: it })}`;
    } else if (activeTab === "mensile") {
      return format(currentDate, "MMMM yyyy", { locale: it });
    } else {
      return format(currentDate, "yyyy");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Contabilità</h1>
          <p className="text-gray-500">Panoramica finanziaria e gestione contabile</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/accounting/daily")}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Nuova Registrazione
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/accounting/categories")}
          >
            <Tag className="mr-2 h-4 w-4" />
            Gestione Categorie
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="settimanale">Settimanale</TabsTrigger>
          <TabsTrigger value="mensile">Mensile</TabsTrigger>
          <TabsTrigger value="annuale">Annuale</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePreviousPeriod}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{getDateRangeLabel()}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNextPeriod}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Entrate Totali"
            value={`€${totalIncome.toFixed(2)}`}
            description="Ricavi del periodo"
            icon={HandCoins}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Spese Totali"
            value={`€${totalExpenses.toFixed(2)}`}
            description="Costi del periodo"
            icon={CreditCard}
            iconColor="text-red-500"
          />
          <StatsCard
            title="Profitto Netto"
            value={`€${totalProfit.toFixed(2)}`}
            description="Utile del periodo"
            icon={Euro}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Margine di Profitto"
            value={`${profitMargin.toFixed(1)}%`}
            description="Percentuale di profitto"
            icon={Receipt}
            iconColor="text-purple-500"
          />
        </div>

        <TabsContent value="settimanale" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Settimanale</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  income: { label: "Entrate", color: "#22c55e" },
                  expenses: { label: "Uscite", color: "#ef4444" },
                  profit: { label: "Profitto", color: "#3b82f6" }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockWeeklyData}>
                    <XAxis 
                      dataKey="day" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Bar 
                      dataKey="income" 
                      fill="var(--color-income)" 
                      radius={[4, 4, 0, 0]} 
                      name="Entrate"
                    />
                    <Bar 
                      dataKey="expenses" 
                      fill="var(--color-expenses)" 
                      radius={[4, 4, 0, 0]} 
                      name="Uscite"
                    />
                    <Bar 
                      dataKey="profit" 
                      fill="var(--color-profit)" 
                      radius={[4, 4, 0, 0]} 
                      name="Profitto"
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Principali Categorie di Spesa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockTopExpenseCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between py-2">
                    <span>{category.name}</span>
                    <span className="font-semibold text-red-500">
                      €{category.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Principali Categorie di Entrata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockTopIncomeCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between py-2">
                    <span>{category.name}</span>
                    <span className="font-semibold text-green-500">
                      €{category.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mensile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Mensile</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  income: { label: "Entrate", color: "#22c55e" },
                  expenses: { label: "Uscite", color: "#ef4444" },
                  profit: { label: "Profitto", color: "#3b82f6" }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMonthlyData}>
                    <XAxis 
                      dataKey="week" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Bar 
                      dataKey="income" 
                      fill="var(--color-income)" 
                      radius={[4, 4, 0, 0]} 
                      name="Entrate"
                    />
                    <Bar 
                      dataKey="expenses" 
                      fill="var(--color-expenses)" 
                      radius={[4, 4, 0, 0]} 
                      name="Uscite"
                    />
                    <Bar 
                      dataKey="profit" 
                      fill="var(--color-profit)" 
                      radius={[4, 4, 0, 0]} 
                      name="Profitto"
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annuale" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Annuale</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  income: { label: "Entrate", color: "#22c55e" },
                  expenses: { label: "Uscite", color: "#ef4444" },
                  profit: { label: "Profitto", color: "#3b82f6" }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockYearlyData}>
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Line 
                      type="monotone"
                      dataKey="income" 
                      stroke="var(--color-income)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Entrate"
                    />
                    <Line 
                      type="monotone"
                      dataKey="expenses" 
                      stroke="var(--color-expenses)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Uscite"
                    />
                    <Line 
                      type="monotone"
                      dataKey="profit" 
                      stroke="var(--color-profit)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Profitto"
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingPage;

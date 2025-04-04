
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ArrowLeft, Calendar, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";

// Mock data for transactions
const mockTransactions = [
  { 
    id: 1, 
    date: "2025-04-04", 
    type: "income", 
    category: "Vendite Pizze", 
    amount: 850.50, 
    notes: "Incasso serale"
  },
  { 
    id: 2, 
    date: "2025-04-04", 
    type: "income", 
    category: "Vendite Bevande", 
    amount: 320.25, 
    notes: "Incasso serale"
  },
  { 
    id: 3, 
    date: "2025-04-04", 
    type: "expense", 
    category: "Materie Prime", 
    amount: 230.75, 
    notes: "Acquisto farina e pomodoro"
  },
  { 
    id: 4, 
    date: "2025-04-04", 
    type: "expense", 
    category: "Stipendi", 
    amount: 150.00, 
    notes: "Paga giornaliera aiutante"
  },
  { 
    id: 5, 
    date: "2025-04-03", 
    type: "income", 
    category: "Vendite Pizze", 
    amount: 750.50, 
    notes: "Incasso serale"
  },
  { 
    id: 6, 
    date: "2025-04-03", 
    type: "expense", 
    category: "Utenze", 
    amount: 85.30, 
    notes: "Bolletta elettricità"
  },
];

// Mock categories
const mockIncomeCategories = [
  "Vendite Pizze",
  "Vendite Bevande",
  "Vendite Dolci",
  "Vendite Antipasti",
  "Altri Ricavi"
];

const mockExpenseCategories = [
  "Materie Prime",
  "Stipendi",
  "Utenze",
  "Affitto",
  "Manutenzione",
  "Marketing",
  "Tasse",
  "Altro"
];

const AccountingDailyPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<string>("income");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Filter transactions based on the selected date
  const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
  const filteredTransactions = mockTransactions.filter(
    transaction => transaction.date === formattedSelectedDate
  );

  // Calculate daily totals
  const dailyIncome = filteredTransactions
    .filter(transaction => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const dailyExpenses = filteredTransactions
    .filter(transaction => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const dailyBalance = dailyIncome - dailyExpenses;

  // Handle form submission
  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount) {
      toast.error("Inserisci categoria e importo");
      return;
    }

    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Inserisci un importo valido");
      return;
    }

    // In a real application, this would send data to the backend
    toast.success(`${transactionType === "income" ? "Entrata" : "Uscita"} registrata con successo`);
    
    // Reset form fields
    setCategory("");
    setAmount("");
    setNotes("");
  };

  // Table columns for transactions
  const columns = [
    { 
      header: "Data", 
      accessorKey: "date", 
      cell: (row: any) => format(new Date(row.date), 'dd/MM/yyyy') 
    },
    { 
      header: "Tipo", 
      accessorKey: "type", 
      cell: (row: any) => (
        <span className={row.type === "income" ? "text-green-600" : "text-red-600"}>
          {row.type === "income" ? "Entrata" : "Uscita"}
        </span>
      ) 
    },
    { header: "Categoria", accessorKey: "category" },
    { 
      header: "Importo", 
      accessorKey: "amount", 
      cell: (row: any) => (
        <span className={row.type === "income" ? "text-green-600" : "text-red-600"}>
          {row.type === "income" ? "+" : "-"}€{row.amount.toFixed(2)}
        </span>
      ) 
    },
    { header: "Note", accessorKey: "notes" },
    {
      header: "Azioni",
      accessorKey: "actions",
      cell: () => (
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
          <Trash className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/accounting")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Indietro
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Registrazioni Giornaliere</h1>
          <p className="text-gray-500">Gestione entrate e uscite quotidiane</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {format(selectedDate, "dd MMMM yyyy", { locale: it })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date || new Date());
                setIsCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-green-600">Entrate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{dailyIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600">Uscite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{dailyExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={dailyBalance >= 0 ? "text-blue-600" : "text-orange-600"}>
              Bilancio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dailyBalance >= 0 ? "text-blue-600" : "text-orange-600"}`}>
              €{dailyBalance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmitTransaction}>
        <Card>
          <CardHeader>
            <CardTitle>Registra Nuova Transazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo di Transazione</Label>
                <Select 
                  value={transactionType} 
                  onValueChange={setTransactionType}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Entrata</SelectItem>
                    <SelectItem value="expense">Uscita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionType === "income"
                      ? mockIncomeCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                      : mockExpenseCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Importo (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <Label htmlFor="notes">Note (opzionale)</Label>
                <Textarea
                  id="notes"
                  placeholder="Aggiungi dettagli sulla transazione"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>

            <Button type="submit" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Transazione
            </Button>
          </CardContent>
        </Card>
      </form>

      <Separator />

      <h2 className="text-xl font-semibold">Transazioni del {format(selectedDate, "dd MMMM yyyy", { locale: it })}</h2>
      
      <DataTable 
        columns={columns} 
        data={filteredTransactions}
      />
    </div>
  );
};

export default AccountingDailyPage;

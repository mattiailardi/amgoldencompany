
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";

// Mock data for sales history
const mockSalesHistory = [
  { id: 1, date: "2025-04-04", productName: "Pizza Margherita", category: "Pizze", quantity: 15, price: 8.50, total: 127.50 },
  { id: 2, date: "2025-04-04", productName: "Pizza Diavola", category: "Pizze", quantity: 8, price: 10.00, total: 80.00 },
  { id: 3, date: "2025-04-04", productName: "Coca Cola 33cl", category: "Bibite", quantity: 20, price: 3.00, total: 60.00 },
  { id: 4, date: "2025-04-03", productName: "Pizza Margherita", category: "Pizze", quantity: 12, price: 8.50, total: 102.00 },
  { id: 5, date: "2025-04-03", productName: "Tiramisù", category: "Dolci", quantity: 5, price: 5.00, total: 25.00 },
  { id: 6, date: "2025-04-03", productName: "Acqua 50cl", category: "Bibite", quantity: 15, price: 2.00, total: 30.00 },
  { id: 7, date: "2025-04-02", productName: "Pizza Napoli", category: "Pizze", quantity: 10, price: 9.50, total: 95.00 },
  { id: 8, date: "2025-04-02", productName: "Birra Moretti", category: "Bibite", quantity: 18, price: 4.00, total: 72.00 },
  { id: 9, date: "2025-04-01", productName: "Pizza Diavola", category: "Pizze", quantity: 7, price: 10.00, total: 70.00 },
  { id: 10, date: "2025-04-01", productName: "Coca Cola 33cl", category: "Bibite", quantity: 14, price: 3.00, total: 42.00 },
  { id: 11, date: "2025-04-01", productName: "Panna Cotta", category: "Dolci", quantity: 8, price: 4.50, total: 36.00 },
  { id: 12, date: "2025-03-31", productName: "Pizza Margherita", category: "Pizze", quantity: 20, price: 8.50, total: 170.00 },
  { id: 13, date: "2025-03-31", productName: "Pizza Napoli", category: "Pizze", quantity: 5, price: 9.50, total: 47.50 },
  { id: 14, date: "2025-03-31", productName: "Acqua 50cl", category: "Bibite", quantity: 10, price: 2.00, total: 20.00 },
  { id: 15, date: "2025-03-30", productName: "Tiramisù", category: "Dolci", quantity: 10, price: 5.00, total: 50.00 },
];

const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  
  // Columns for the sales data table
  const columns = [
    { header: "Data", accessorKey: "date", cell: (row: any) => format(new Date(row.date), 'dd/MM/yyyy') },
    { header: "Prodotto", accessorKey: "productName" },
    { header: "Categoria", accessorKey: "category" },
    { header: "Quantità", accessorKey: "quantity" },
    { header: "Prezzo", accessorKey: "price", cell: (row: any) => `€${row.price.toFixed(2)}` },
    { header: "Totale", accessorKey: "total", cell: (row: any) => `€${row.total.toFixed(2)}` },
  ];

  // Get unique categories from data
  const categories = ["all", ...Array.from(new Set(mockSalesHistory.map(item => item.category)))];
  
  // Filter data based on category and date
  const filteredData = mockSalesHistory.filter(item => {
    const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchDate = !dateFilter || item.date.includes(dateFilter);
    return matchCategory && matchDate;
  });
  
  // Calculate total sales amount
  const totalSales = filteredData.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate total quantity sold
  const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);

  // Simulate export functionality
  const handleExport = () => {
    console.log("Exporting sales data...");
    alert("Il file di esportazione è stato scaricato.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/sales")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Indietro
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Storico Vendite</h1>
            <p className="text-gray-500">Visualizza e analizza lo storico completo delle vendite</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Esporta CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Vendite Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{totalSales.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">
              {filteredData.length} record di vendita
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quantità Totale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuantity}</div>
            <div className="text-sm text-muted-foreground">
              prodotti venduti
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Vendita Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              €{filteredData.length > 0 
                  ? (totalSales / filteredData.length).toFixed(2) 
                  : "0.00"}
            </div>
            <div className="text-sm text-muted-foreground">
              per record di vendita
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtra per categoria
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Tutte le categorie" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtra per data (YYYY-MM-DD)
              </label>
              <Input
                placeholder="es. 2025-04"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      <DataTable 
        columns={columns} 
        data={filteredData} 
        searchKey="productName" 
      />
    </div>
  );
};

export default SalesHistoryPage;

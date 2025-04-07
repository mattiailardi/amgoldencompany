
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

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

interface SalesTransactionsProps {
  date: string; // format: 'yyyy-MM-dd'
}

export const SalesTransactions: React.FC<SalesTransactionsProps> = ({ date }) => {
  const [filteredSales, setFilteredSales] = useState<any[]>([]);

  useEffect(() => {
    // Filter sales for the selected date
    const salesForDate = mockSalesData.filter(sale => sale.date === date);
    setFilteredSales(salesForDate);
  }, [date]);

  const columns = [
    { header: "Prodotto", accessorKey: "productName" },
    { 
      header: "Categoria", 
      accessorKey: "category",
      cell: (row: any) => (
        <Badge variant="outline" className="font-normal">
          {row.category}
        </Badge>
      )
    },
    { header: "Quantità", accessorKey: "quantity" },
    { 
      header: "Prezzo", 
      accessorKey: "price",
      cell: (row: any) => `€${row.price.toFixed(2)}`
    },
    { 
      header: "Totale", 
      accessorKey: "total",
      cell: (row: any) => `€${row.total.toFixed(2)}`
    },
  ];

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

  if (filteredSales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Vendite del Giorno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nessuna vendita registrata per questa data.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Vendite del Giorno
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 p-3 rounded-md">
            <p className="text-2xl font-bold text-green-600">€{totalSales.toFixed(2)}</p>
            <p className="text-xs text-slate-500">Totale vendite</p>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-md">
            <p className="text-2xl font-bold">{totalItems}</p>
            <p className="text-xs text-slate-500">Prodotti venduti</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredSales}
          searchKey="productName"
        />
      </CardContent>
    </Card>
  );
};

export default SalesTransactions;

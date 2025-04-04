
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AddProductForm from "@/components/haccp/add-product-form";

// Mock data for product expiration dates
const mockProducts = [
  { id: 1, name: "Pomodoro San Marzano", lot: "L123456", expiryDate: "2025-06-15", supplier: "Agricola Sud", hasImage: true },
  { id: 2, name: "Mozzarella di Bufala", lot: "M789012", expiryDate: "2025-04-20", supplier: "Caseificio Campano", hasImage: true },
  { id: 3, name: "Olio Extravergine", lot: "O345678", expiryDate: "2026-01-10", supplier: "Frantoi Riuniti", hasImage: false },
  { id: 4, name: "Farina tipo 00", lot: "F901234", expiryDate: "2025-11-30", supplier: "Mulino Rossi", hasImage: true },
  { id: 5, name: "Basilico fresco", lot: "B567890", expiryDate: "2025-04-08", supplier: "Azienda Agricola Verdi", hasImage: false },
];

const HACCPInventoryPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const columns = [
    {
      header: "Prodotto",
      accessorKey: "name",
    },
    {
      header: "Lotto",
      accessorKey: "lot",
    },
    {
      header: "Scadenza",
      accessorKey: "expiryDate",
      cell: (row: any) => {
        const date = new Date(row.expiryDate);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <div className={`font-medium ${diffDays < 7 ? 'text-red-500' : diffDays < 30 ? 'text-amber-500' : 'text-green-600'}`}>
            {new Date(row.expiryDate).toLocaleDateString('it-IT')} 
            {diffDays < 30 && (
              <span className="ml-2">
                ({diffDays} giorni)
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: "Fornitore",
      accessorKey: "supplier",
    },
    {
      header: "Immagine",
      accessorKey: "hasImage",
      cell: (row: any) => row.hasImage ? 
        <Button variant="outline" size="sm">Vedi Foto</Button> : 
        <span className="text-gray-400">Nessuna foto</span>
    },
    {
      header: "Azioni",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Modifica</Button>
          <Button variant="destructive" size="sm">Elimina</Button>
        </div>
      ),
    },
  ];

  const addProduct = (product: any) => {
    setProducts([...products, { id: products.length + 1, ...product, hasImage: true }]);
    setIsAddingProduct(false);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestione Scadenze Prodotti</h1>
        <Sheet open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Aggiungi Prodotto
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Aggiungi Nuovo Prodotto</SheetTitle>
              <SheetDescription>
                Inserisci le informazioni del prodotto e carica una foto della confezione o dell'etichetta.
              </SheetDescription>
            </SheetHeader>
            <AddProductForm onSubmit={addProduct} onCancel={() => setIsAddingProduct(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prodotti con Scadenza</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={products} 
            columns={columns} 
            searchKey="name" 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HACCPInventoryPage;

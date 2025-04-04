
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Printer, Check } from "lucide-react";

const HACCPLabelsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  // Mock product list from inventory
  const inventoryProducts = [
    { id: "1", name: "Pomodoro San Marzano" },
    { id: "2", name: "Mozzarella di Bufala" },
    { id: "3", name: "Olio Extravergine" },
    { id: "4", name: "Farina tipo 00" },
    { id: "5", name: "Basilico fresco" },
  ];

  const handlePrint = () => {
    if (!selectedProduct) {
      toast.error("Seleziona un prodotto prima di stampare");
      return;
    }

    setIsPrinting(true);

    // Simulate printing
    setTimeout(() => {
      setIsPrinting(false);
      const productName = inventoryProducts.find(p => p.id === selectedProduct)?.name;
      toast.success(`Etichette per ${productName} (${quantity}) inviate alla stampante!`);
    }, 1500);
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Stampa Etichette</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Crea Etichette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Prodotto</Label>
              <Select 
                value={selectedProduct} 
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Seleziona prodotto" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantità Etichette</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handlePrint} 
                className="w-full" 
                disabled={!selectedProduct || isPrinting}
              >
                {isPrinting ? (
                  <>
                    <span className="animate-pulse mr-2">Stampa in corso...</span>
                  </>
                ) : (
                  <>
                    <Printer className="mr-2 h-4 w-4" />
                    Stampa Etichette
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Anteprima Etichetta</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProduct ? (
              <div className="border border-dashed border-gray-300 p-4 rounded-md">
                <div className="bg-white p-4 rounded shadow-sm max-w-xs mx-auto">
                  <h3 className="text-center font-bold">
                    {inventoryProducts.find(p => p.id === selectedProduct)?.name}
                  </h3>
                  <div className="text-center mt-2 text-sm">
                    <p>Data preparazione:</p>
                    <p className="font-semibold">{new Date().toLocaleDateString('it-IT')}</p>
                  </div>
                  <div className="text-center mt-2 text-sm">
                    <p>Da consumarsi entro:</p>
                    <p className="font-semibold">
                      {new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <div className="text-center mt-2 text-xs text-gray-500">
                    <p>Pizza Pro</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <p>Seleziona un prodotto per vedere l'anteprima</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HACCPLabelsPage;

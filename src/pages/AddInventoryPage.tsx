
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Product, ProductCategory, generateMockCategories, generateMockProducts } from "@/types";

export function AddInventoryPage() {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(generateMockProducts());
  const [categories] = useState<ProductCategory[]>(generateMockCategories());
  
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error("Seleziona un prodotto");
      return;
    }
    
    const product = products.find(p => p.id === selectedProduct);
    
    if (!product) {
      toast.error("Prodotto non trovato");
      return;
    }
    
    // In a real app, we would update the database
    toast.success(`Aggiunto ${quantity} ${product.unit} di ${product.name} al magazzino`);
    navigate("/inventory");
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Aggiungi al Magazzino</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rifornimento Prodotto</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Prodotto</Label>
              <Select 
                value={selectedProduct?.toString() || ""} 
                onValueChange={(value) => setSelectedProduct(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona prodotto" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <React.Fragment key={`category-${category.id}`}>
                      <SelectItem value={`category-${category.id}`} disabled className="font-bold">
                        {category.name}
                      </SelectItem>
                      {products
                        .filter(p => p.categoryId === category.id)
                        .map(product => (
                          <SelectItem key={product.id} value={product.id.toString()} className="pl-6">
                            {product.name} ({product.currentQuantity} {product.unit})
                          </SelectItem>
                        ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantità</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="0.01" 
                step="0.01" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/inventory")}
            >
              Annulla
            </Button>
            <Button type="submit">
              Aggiungi
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AddInventoryPage;

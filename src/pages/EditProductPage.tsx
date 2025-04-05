
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Product, ProductCategory, generateMockCategories, generateMockProducts } from "@/types";

export function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const [products] = useState<Product[]>(generateMockProducts());
  const [categories] = useState<ProductCategory[]>(generateMockCategories());
  
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: "",
    categoryId: 1,
    unit: "pezzo",
    unitPrice: 0,
    tax: 10,
    currentQuantity: 0,
    thresholdQuantity: undefined,
    notes: "",
    categoryName: ""
  });
  
  // Load product data if editing
  useEffect(() => {
    if (isEditing && id) {
      const existingProduct = products.find(p => p.id === parseInt(id));
      if (existingProduct) {
        setProduct(existingProduct);
      } else {
        toast.error("Prodotto non trovato");
        navigate("/inventory");
      }
    }
  }, [id, isEditing, navigate, products]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'unitPrice' || name === 'tax' || name === 'currentQuantity' || name === 'thresholdQuantity' 
        ? parseFloat(value) 
        : value
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    const category = categories.find(c => c.id === categoryId);
    setProduct(prev => ({
      ...prev,
      categoryId,
      categoryName: category?.name || ""
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save to database here
    // For this mock, we'll just show a success message and navigate back
    
    toast.success(isEditing 
      ? `Prodotto "${product.name}" aggiornato con successo` 
      : `Prodotto "${product.name}" aggiunto con successo`
    );
    
    navigate("/inventory");
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Modifica Prodotto" : "Nuovo Prodotto"}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dettagli Prodotto</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Prodotto</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={product.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={product.categoryId.toString()} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unità di Misura</Label>
                <Input 
                  id="unit" 
                  name="unit" 
                  value={product.unit} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Prezzo Unitario (€)</Label>
                <Input 
                  id="unitPrice" 
                  name="unitPrice" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={product.unitPrice} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax">IVA (%)</Label>
                <Input 
                  id="tax" 
                  name="tax" 
                  type="number" 
                  step="1" 
                  min="0" 
                  max="100" 
                  value={product.tax} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentQuantity">Quantità Attuale</Label>
                <Input 
                  id="currentQuantity" 
                  name="currentQuantity" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={product.currentQuantity} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thresholdQuantity">Soglia Minima</Label>
                <Input 
                  id="thresholdQuantity" 
                  name="thresholdQuantity" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={product.thresholdQuantity || ""} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Note</Label>
                <Input 
                  id="notes" 
                  name="notes" 
                  value={product.notes || ""} 
                  onChange={handleChange} 
                />
              </div>
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
              {isEditing ? "Aggiorna" : "Salva"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditProductPage;

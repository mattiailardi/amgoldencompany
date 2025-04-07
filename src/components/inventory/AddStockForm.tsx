
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, ProductCategory } from "@/types";

interface AddStockFormProps {
  products: Product[];
  categories: ProductCategory[];
  selectedProductId: number | null;
  onSelectProduct: (id: number | null) => void;
  onSave: (productId: number, quantity: number) => void;
  onCancel: () => void;
}

export const AddStockForm: React.FC<AddStockFormProps> = ({
  products,
  categories,
  selectedProductId,
  onSelectProduct,
  onSave,
  onCancel
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleSubmit = () => {
    if (!selectedProductId) {
      toast.error("Seleziona un prodotto");
      return;
    }
    
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Inserisci una quantità valida");
      return;
    }
    
    onSave(selectedProductId, quantity);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product" className="text-sm font-medium">
          Prodotto
        </Label>
        <Select 
          value={selectedProductId?.toString() || ""} 
          onValueChange={(value) => onSelectProduct(parseInt(value))}
        >
          <SelectTrigger className="border-gold-300">
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
        <Label htmlFor="quantity" className="text-sm font-medium">
          Quantità da aggiungere
        </Label>
        <Input 
          id="quantity" 
          type="number" 
          min="0.01" 
          step="0.01" 
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          className="border-gold-300"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90"
        >
          Aggiungi
        </Button>
      </div>
    </div>
  );
};

export default AddStockForm;

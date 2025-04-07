
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Product, ProductCategory } from "@/types";

interface ProductFormProps {
  product?: Product;
  categories: ProductCategory[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSave,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      categoryId: categories[0]?.id || 1,
      unit: "kg",
      unitPrice: 0,
      tax: 10,
      currentQuantity: 0,
      thresholdQuantity: 0,
      notes: ""
    }
  );

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error for this field if exists
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim() === "") {
      errors.name = "Il nome è obbligatorio";
    }
    
    if (!formData.unit || formData.unit.trim() === "") {
      errors.unit = "L'unità di misura è obbligatoria";
    }
    
    if (formData.unitPrice === undefined || formData.unitPrice < 0) {
      errors.unitPrice = "Il prezzo deve essere maggiore o uguale a 0";
    }
    
    if (formData.currentQuantity === undefined || formData.currentQuantity < 0) {
      errors.currentQuantity = "La quantità deve essere maggiore o uguale a 0";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Correggi gli errori nel form");
      return;
    }
    
    // Find the category name
    const category = categories.find(c => c.id === formData.categoryId);
    const productToSave = {
      ...formData,
      categoryName: category?.name
    };
    
    onSave(productToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className={formErrors.name ? "text-destructive" : ""}>
            Nome Prodotto *
          </Label>
          <Input 
            id="name"
            value={formData.name} 
            onChange={(e) => handleChange("name", e.target.value)} 
            className={formErrors.name ? "border-destructive" : ""}
          />
          {formErrors.name && <p className="text-destructive text-xs">{formErrors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select 
            value={formData.categoryId?.toString()} 
            onValueChange={(value) => handleChange("categoryId", parseInt(value))}
          >
            <SelectTrigger className="border-gold-300">
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
          <Label htmlFor="unit" className={formErrors.unit ? "text-destructive" : ""}>
            Unità di Misura *
          </Label>
          <Select 
            value={formData.unit} 
            onValueChange={(value) => handleChange("unit", value)}
          >
            <SelectTrigger className={`border-gold-300 ${formErrors.unit ? "border-destructive" : ""}`}>
              <SelectValue placeholder="Seleziona unità" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kg</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="l">l</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="pz">pz</SelectItem>
              <SelectItem value="conf">conf</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.unit && <p className="text-destructive text-xs">{formErrors.unit}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unitPrice" className={formErrors.unitPrice ? "text-destructive" : ""}>
            Prezzo Unitario (€) *
          </Label>
          <Input 
            id="unitPrice" 
            type="number" 
            step="0.01" 
            min="0" 
            value={formData.unitPrice} 
            onChange={(e) => handleChange("unitPrice", parseFloat(e.target.value))} 
            className={formErrors.unitPrice ? "border-destructive" : ""}
          />
          {formErrors.unitPrice && <p className="text-destructive text-xs">{formErrors.unitPrice}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tax">IVA (%)</Label>
          <Input 
            id="tax" 
            type="number" 
            step="1" 
            min="0" 
            max="100" 
            value={formData.tax} 
            onChange={(e) => handleChange("tax", parseInt(e.target.value))} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentQuantity" className={formErrors.currentQuantity ? "text-destructive" : ""}>
            Quantità Attuale *
          </Label>
          <Input 
            id="currentQuantity" 
            type="number" 
            step="0.01" 
            min="0" 
            value={formData.currentQuantity} 
            onChange={(e) => handleChange("currentQuantity", parseFloat(e.target.value))} 
            className={formErrors.currentQuantity ? "border-destructive" : ""}
          />
          {formErrors.currentQuantity && <p className="text-destructive text-xs">{formErrors.currentQuantity}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="thresholdQuantity">Soglia Minima</Label>
          <Input 
            id="thresholdQuantity" 
            type="number" 
            step="0.01" 
            min="0"
            value={formData.thresholdQuantity || ""} 
            onChange={(e) => handleChange("thresholdQuantity", e.target.value ? parseFloat(e.target.value) : undefined)} 
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Note</Label>
          <Textarea 
            id="notes" 
            value={formData.notes || ""} 
            onChange={(e) => handleChange("notes", e.target.value)} 
            placeholder="Dettagli aggiuntivi sul prodotto"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio..." : product ? "Aggiorna" : "Salva"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;

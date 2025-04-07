
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ProductCategory } from "@/types";

interface CategoryFormProps {
  category?: ProductCategory;
  onSave: (category: Partial<ProductCategory>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSave,
  onCancel,
  isSubmitting = false
}) => {
  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Il nome della categoria è obbligatorio");
      return;
    }
    
    onSave({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className={error ? "text-destructive" : ""}>
          Nome Categoria *
        </Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }} 
          className={error ? "border-destructive" : "border-gold-300"}
          placeholder="Es. Latticini"
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio..." : category ? "Aggiorna" : "Salva"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;

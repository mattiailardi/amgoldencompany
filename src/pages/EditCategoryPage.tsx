
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { ProductCategory, generateMockCategories } from "@/types";
import { CategoryForm } from "@/components/inventory/CategoryForm";

export function EditCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const [categories] = useState<ProductCategory[]>(generateMockCategories());
  const [category, setCategory] = useState<ProductCategory | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load category data if editing
  useEffect(() => {
    if (isEditing && id) {
      const existingCategory = categories.find(c => c.id === parseInt(id));
      if (existingCategory) {
        setCategory(existingCategory);
      } else {
        toast.error("Categoria non trovata");
        navigate("/inventory");
      }
    }
  }, [id, isEditing, navigate, categories]);
  
  const handleSave = (updatedCategory: Partial<ProductCategory>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isEditing && category) {
        toast.success(`Categoria "${updatedCategory.name}" aggiornata con successo`);
      } else {
        toast.success(`Categoria "${updatedCategory.name}" creata con successo`);
      }
      
      setIsSubmitting(false);
      navigate("/inventory");
    }, 500);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Modifica Categoria" : "Nuova Categoria"}
        </h1>
      </div>
      
      <Card className="border-gold-300">
        <CardHeader>
          <CardTitle>Dettagli Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm 
            category={category}
            onSave={handleSave}
            onCancel={() => navigate("/inventory")}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default EditCategoryPage;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { ProductCategory, generateMockCategories } from "@/types";

export function EditCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const [categories] = useState<ProductCategory[]>(generateMockCategories());
  
  const [category, setCategory] = useState<ProductCategory>({
    id: 0,
    name: "",
  });
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save to database here
    // For this mock, we'll just show a success message and navigate back
    
    toast.success(isEditing 
      ? `Categoria "${category.name}" aggiornata con successo` 
      : `Categoria "${category.name}" aggiunta con successo`
    );
    
    navigate("/inventory");
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Modifica Categoria" : "Nuova Categoria"}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dettagli Categoria</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Categoria</Label>
              <Input 
                id="name" 
                name="name" 
                value={category.name} 
                onChange={handleChange} 
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
              {isEditing ? "Aggiorna" : "Salva"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditCategoryPage;

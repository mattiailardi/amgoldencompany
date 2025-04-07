
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Product, ProductCategory, generateMockCategories, generateMockProducts } from "@/types";
import { ProductForm } from "@/components/inventory/ProductForm";

export function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const [products] = useState<Product[]>(generateMockProducts());
  const [categories] = useState<ProductCategory[]>(generateMockCategories());
  const [product, setProduct] = useState<Product | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleSave = (updatedProduct: Partial<Product>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isEditing && product) {
        toast.success(`Prodotto "${updatedProduct.name}" aggiornato con successo`);
      } else {
        toast.success(`Prodotto "${updatedProduct.name}" creato con successo`);
      }
      
      setIsSubmitting(false);
      navigate("/inventory");
    }, 500);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Modifica Prodotto" : "Nuovo Prodotto"}
        </h1>
      </div>
      
      <Card className="border-gold-300">
        <CardHeader>
          <CardTitle>{isEditing ? "Modifica Dettagli Prodotto" : "Inserisci Dettagli Prodotto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm 
            product={product}
            categories={categories}
            onSave={handleSave}
            onCancel={() => navigate("/inventory")}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProductPage;


import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ProductForm } from "@/components/inventory/ProductForm";
import { Product } from "@/types";
import { useInventory } from "@/contexts/InventoryContext";

export const ProductModal: React.FC = () => {
  const { 
    isAddingProduct, 
    isEditingProduct, 
    setIsAddingProduct, 
    setIsEditingProduct, 
    productToEdit,
    categories,
    handleAddProduct, 
    handleUpdateProduct 
  } = useInventory();

  return (
    <Sheet 
      open={isAddingProduct || isEditingProduct !== null} 
      onOpenChange={(open) => {
        if (!open) {
          setIsAddingProduct(false);
          setIsEditingProduct(null);
        }
      }}
    >
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{isEditingProduct !== null ? "Modifica Ingrediente" : "Aggiungi Nuovo Ingrediente"}</SheetTitle>
          <SheetDescription>
            {isEditingProduct !== null 
              ? "Modifica i dettagli dell'ingrediente selezionato" 
              : "Inserisci i dettagli del nuovo ingrediente da aggiungere al magazzino"}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <ProductForm 
            product={productToEdit}
            categories={categories}
            onSave={isEditingProduct !== null ? handleUpdateProduct : handleAddProduct}
            onCancel={() => {
              setIsAddingProduct(false);
              setIsEditingProduct(null);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

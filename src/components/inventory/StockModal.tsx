
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AddStockForm } from "@/components/inventory/AddStockForm";
import { useInventory } from "@/contexts/InventoryContext";

export const StockModal: React.FC = () => {
  const { 
    isAddingStock, 
    setIsAddingStock,
    selectedProductForStock, 
    setSelectedProductForStock,
    products,
    categories,
    handleSaveAddedStock
  } = useInventory();

  return (
    <Sheet 
      open={isAddingStock} 
      onOpenChange={(open) => {
        if (!open) {
          setIsAddingStock(false);
          setSelectedProductForStock(null);
        }
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Aggiungi Scorte</SheetTitle>
          <SheetDescription>
            Aggiungi quantità al prodotto selezionato
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <AddStockForm 
            products={products}
            categories={categories}
            selectedProductId={selectedProductForStock}
            onSelectProduct={setSelectedProductForStock}
            onSave={handleSaveAddedStock}
            onCancel={() => setIsAddingStock(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

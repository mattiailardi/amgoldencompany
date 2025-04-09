
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { CategoryManager } from "@/components/inventory/CategoryManager";
import { useInventory } from "@/contexts/InventoryContext";

export const CategoriesModal: React.FC = () => {
  const {
    isManagingCategories,
    setIsManagingCategories,
    categoriesWithCount,
    isAddingCategory,
    setIsAddingCategory,
    handleAddCategory,
    handleDeleteCategory
  } = useInventory();

  return (
    <Drawer open={isManagingCategories} onOpenChange={setIsManagingCategories}>
      <DrawerTrigger className="hidden" />
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="text-left">
            <DrawerTitle>Gestione Categorie</DrawerTitle>
            <DrawerDescription>
              Gestisci le categorie degli ingredienti del magazzino
            </DrawerDescription>
          </DrawerHeader>
          <CategoryManager 
            categories={categoriesWithCount}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

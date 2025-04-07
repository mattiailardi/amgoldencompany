
import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ProductCategory } from "@/types";
import { CategoryForm } from "@/components/inventory/CategoryForm";
import { useNavigate } from "react-router-dom";

interface CategoryManagerProps {
  categories: ProductCategory[];
  isAddingCategory: boolean;
  setIsAddingCategory: (value: boolean) => void;
  onAddCategory: (category: Partial<ProductCategory>) => void;
  onDeleteCategory: (categoryId: number) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  isAddingCategory,
  setIsAddingCategory,
  onAddCategory,
  onDeleteCategory
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 pb-8">
      <div className="flex justify-end mb-4">
        <Sheet open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <Button size="sm" onClick={() => setIsAddingCategory(true)} className="bg-primary hover:bg-primary/90">
            Nuova Categoria
          </Button>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Aggiungi Nuova Categoria</SheetTitle>
              <SheetDescription>
                Crea una nuova categoria per organizzare gli ingredienti
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <CategoryForm 
                onSave={onAddCategory}
                onCancel={() => setIsAddingCategory(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <DataTable
        data={categories}
        columns={[
          { header: "ID", accessorKey: "id" },
          { header: "Nome", accessorKey: "name" },
          { 
            header: "Prodotti", 
            accessorKey: "productCount",
            cell: (row) => (
              <div className="bg-muted px-2 py-1 rounded text-center">
                {row.productCount} ingredienti
              </div>
            )
          },
          {
            header: "Azioni",
            accessorKey: "id",
            id: "categoryActions",
            cell: (row) => (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/inventory/category/edit/${row.id}`)}
                  className="hover:text-primary"
                >
                  Modifica
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteCategory(row.id)}
                  disabled={row.productCount > 0}
                >
                  Elimina
                </Button>
              </div>
            )
          },
        ]}
        searchKey="name"
      />
    </div>
  );
};

export default CategoryManager;


import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { Edit, Trash, Plus } from "lucide-react";
import { Product } from "@/types";

interface InventoryTableProps {
  products: Product[];
  searchQuery: string;
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
  onAdd: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  searchQuery,
  onEdit,
  onDelete,
  onAdd
}) => {
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nuovo Ingrediente
        </Button>
      </div>
      
      <DataTable
        data={filteredProducts}
        columns={[
          {
            header: "Nome Ingrediente",
            accessorKey: "name",
            cell: (row) => (
              <div className="font-medium">{row.name}</div>
            )
          },
          {
            header: "Categoria",
            accessorKey: "categoryName",
            cell: (row) => (
              <Badge variant="outline" className="font-normal border-gold-300">
                {row.categoryName}
              </Badge>
            )
          },
          {
            header: "Quantità",
            accessorKey: "currentQuantity",
            cell: (row) => (
              <div className="flex items-center gap-2">
                <span>{row.currentQuantity} {row.unit}</span>
                {row.thresholdQuantity && row.currentQuantity < row.thresholdQuantity && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    Basso
                  </Badge>
                )}
              </div>
            )
          },
          {
            header: "Prezzo",
            accessorKey: "unitPrice",
            cell: (row) => `€${row.unitPrice.toFixed(2)}/${row.unit}`
          },
          {
            header: "Soglia",
            accessorKey: "thresholdQuantity",
            cell: (row) => row.thresholdQuantity ? `${row.thresholdQuantity} ${row.unit}` : '-'
          },
          {
            header: "Azioni",
            accessorKey: "id",
            id: "actions",
            cell: (row) => (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(row.id)}
                  className="hover:text-primary"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifica
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(row.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
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

export default InventoryTable;


import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Plus } from "lucide-react";
import { Product } from "@/types";

interface LowStockTableProps {
  products: Product[];
  onAddStock: () => void;
}

export const LowStockTable: React.FC<LowStockTableProps> = ({
  products,
  onAddStock
}) => {
  const lowStockProducts = products.filter(
    (product) => product.thresholdQuantity && product.currentQuantity < product.thresholdQuantity
  );

  return (
    <div>
      <DataTable
        data={lowStockProducts}
        columns={[
          {
            header: "Nome",
            accessorKey: "name",
          },
          {
            header: "Categoria",
            accessorKey: "categoryName",
          },
          {
            header: "Quantità",
            accessorKey: "currentQuantity",
            cell: (row) => `${row.currentQuantity} ${row.unit}`
          },
          {
            header: "Soglia",
            accessorKey: "thresholdQuantity",
            cell: (row) => `${row.thresholdQuantity || 0} ${row.unit}`
          },
          {
            header: "Da Ordinare",
            accessorKey: "currentQuantity",
            id: "toOrder",
            cell: (row) => `${Math.max(0, (row.thresholdQuantity || 0) - row.currentQuantity)} ${row.unit}`
          },
          {
            header: "Azioni",
            accessorKey: "id",
            id: "lowStockActions",
            cell: (row) => (
              <Button 
                size="sm"
                onClick={onAddStock}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-1" />
                Rifornisci
              </Button>
            )
          },
        ]}
        searchKey="name"
      />
    </div>
  );
};

export default LowStockTable;

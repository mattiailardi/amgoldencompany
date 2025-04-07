
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Product } from "@/types";

interface InventoryStatsProps {
  products: Product[];
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ products }) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (product) => product.thresholdQuantity && product.currentQuantity < product.thresholdQuantity
  );
  const totalValue = products.reduce((sum, product) => sum + (product.currentQuantity * product.unitPrice), 0);
  
  // Calculate inventory changes (simulate for now - in a real app this would be from historical data)
  const inventoryTrend = totalValue > 5000 ? "increase" : "decrease";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-gold-300 border">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">Totale Prodotti</div>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                {totalProducts > 0 ? `${Math.ceil(totalProducts * 0.1)} nuovi questo mese` : "Nessun prodotto"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`border ${lowStockProducts.length > 0 ? 'border-amber-300' : 'border-gold-300'}`}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">Prodotti Sotto Scorta</div>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <div className="flex items-center text-xs mt-2">
              {lowStockProducts.length > 0 ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Richiede attenzione
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Magazzino ok
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gold-300 border">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">Valore Totale Magazzino</div>
            <div className="text-2xl font-bold">€{totalValue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              {inventoryTrend === "increase" ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% rispetto al mese scorso
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -3% rispetto al mese scorso
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStats;

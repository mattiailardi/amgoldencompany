
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { LowStockTable } from "@/components/inventory/LowStockTable";
import { useNavigate } from "react-router-dom";
import { useInventory } from "@/contexts/InventoryContext";

export const InventoryTabs: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    searchQuery,
    setIsEditingProduct,
    handleDeleteProduct,
    setIsAddingProduct
  } = useInventory();

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6 md:w-[400px] bg-cmr/10 border border-gold-300">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-gold data-[state=active]:text-cmr"
        >
          Tutti gli Ingredienti
        </TabsTrigger>
        <TabsTrigger 
          value="lowStock"
          className="data-[state=active]:bg-gold data-[state=active]:text-cmr"
        >
          Sotto Scorta
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <Card className="border-gold-300 bg-background/10">
          <CardHeader className="bg-gold/20">
            <CardTitle className="text-gold">Inventario Completo</CardTitle>
            <CardDescription className="text-white">
              Tutti gli ingredienti presenti in magazzino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable 
              products={products}
              searchQuery={searchQuery}
              onEdit={(id) => setIsEditingProduct(id)}
              onDelete={handleDeleteProduct}
              onAdd={() => setIsAddingProduct(true)}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="lowStock">
        <Card className="border-gold-300 bg-background/10">
          <CardHeader className="bg-gold/20">
            <CardTitle className="text-gold">Ingredienti Sotto Scorta</CardTitle>
            <CardDescription className="text-white">
              Ingredienti che necessitano di rifornimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockTable 
              products={products}
              onAddStock={() => navigate("/inventory/add")}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

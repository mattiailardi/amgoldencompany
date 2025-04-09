
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { SearchAndActions } from "@/components/inventory/SearchAndActions";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { ProductModal } from "@/components/inventory/ProductModal";
import { StockModal } from "@/components/inventory/StockModal";
import { CategoriesModal } from "@/components/inventory/CategoriesModal";
import { useInventory } from "@/contexts/InventoryContext";

// This component uses the inventory context
const InventoryPageContent = () => {
  const { 
    products, 
    searchQuery, 
    setSearchQuery,
    setIsAddingProduct, 
    setIsManagingCategories
  } = useInventory();
  
  return (
    <div className="p-6 space-y-6 bg-background text-background-foreground">
      {/* Header */}
      <PageHeader 
        title="Gestione Magazzino Ingredienti"
        actions={
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsManagingCategories(true)}
              className="px-4 py-2 text-sm rounded border border-gold-300 text-white hover:bg-gold hover:text-cmr"
            >
              Gestisci Categorie
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <InventoryStats products={products} />

      {/* Search and Actions */}
      <SearchAndActions 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddProduct={() => setIsAddingProduct(true)}
      />

      {/* Tabs for All Products and Low Stock */}
      <InventoryTabs />

      {/* Modals/Sheets */}
      <ProductModal />
      <StockModal />
      <CategoriesModal />
    </div>
  );
};

// The main wrapper component that provides the context
export function InventoryPage() {
  return (
    <InventoryProvider>
      <InventoryPageContent />
    </InventoryProvider>
  );
}

export default InventoryPage;

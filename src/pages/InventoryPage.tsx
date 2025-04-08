import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Product, ProductCategory, generateMockCategories, generateMockProducts } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";

// Import our components
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { ProductForm } from "@/components/inventory/ProductForm";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { LowStockTable } from "@/components/inventory/LowStockTable";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { SearchAndActions } from "@/components/inventory/SearchAndActions";
import { CategoryManager } from "@/components/inventory/CategoryManager";
import { AddStockForm } from "@/components/inventory/AddStockForm";

export function InventoryPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(generateMockProducts());
  const [categories, setCategories] = useState<ProductCategory[]>(generateMockCategories());
  const [searchQuery, setSearchQuery] = useState("");
  
  // UI control state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<number | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<number | null>(null);
  
  // Product being edited (if any)
  const productToEdit = isEditingProduct !== null 
    ? products.find(p => p.id === isEditingProduct) 
    : undefined;

  // Handler for adding a new product
  const handleAddProduct = (newProduct: Partial<Product>) => {
    const productToAdd: Product = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: newProduct.name || "",
      categoryId: newProduct.categoryId || 1,
      unit: newProduct.unit || "kg",
      unitPrice: newProduct.unitPrice || 0,
      tax: newProduct.tax || 10,
      currentQuantity: newProduct.currentQuantity || 0,
      thresholdQuantity: newProduct.thresholdQuantity,
      notes: newProduct.notes,
      categoryName: newProduct.categoryName || categories.find(c => c.id === newProduct.categoryId)?.name || ""
    };

    setProducts([...products, productToAdd]);
    setIsAddingProduct(false);
    toast.success(`Prodotto "${productToAdd.name}" aggiunto con successo`);
  };

  // Handler for updating an existing product
  const handleUpdateProduct = (updatedProduct: Partial<Product>) => {
    if (!isEditingProduct) return;
    
    setProducts(products.map(p => 
      p.id === isEditingProduct 
        ? { ...p, ...updatedProduct, categoryName: categories.find(c => c.id === updatedProduct.categoryId)?.name || p.categoryName } 
        : p
    ));
    
    setIsEditingProduct(null);
    toast.success(`Prodotto "${updatedProduct.name}" aggiornato con successo`);
  };

  // Handler for deleting a product
  const handleDeleteProduct = (productId: number) => {
    const productToDelete = products.find(p => p.id === productId);
    
    if (confirm(`Sei sicuro di voler eliminare "${productToDelete?.name}"?`)) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success(`Prodotto eliminato con successo`);
    }
  };

  // Handler for adding a new category
  const handleAddCategory = (newCategory: Partial<ProductCategory>) => {
    const categoryToAdd: ProductCategory = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: newCategory.name || ""
    };

    setCategories([...categories, categoryToAdd]);
    setIsAddingCategory(false);
    toast.success(`Categoria "${categoryToAdd.name}" aggiunta con successo`);
  };

  // Handler for deleting a category
  const handleDeleteCategory = (categoryId: number) => {
    const hasProducts = products.some(p => p.categoryId === categoryId);
    
    if (hasProducts) {
      toast.error("Impossibile eliminare una categoria che contiene prodotti");
      return;
    }
    
    const categoryToDelete = categories.find(c => c.id === categoryId);
    
    if (confirm(`Sei sicuro di voler eliminare la categoria "${categoryToDelete?.name}"?`)) {
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success(`Categoria eliminata con successo`);
    }
  };

  // Handler for adding stock to a product
  const handleAddStock = (productId: number | null = null) => {
    setSelectedProductForStock(productId);
    setIsAddingStock(true);
  };

  // Handler for saving added stock
  const handleSaveAddedStock = (productId: number, quantity: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, currentQuantity: p.currentQuantity + quantity } 
        : p
    ));
    
    const product = products.find(p => p.id === productId);
    
    setIsAddingStock(false);
    setSelectedProductForStock(null);
    toast.success(`Aggiunto ${quantity} ${product?.unit} di ${product?.name} al magazzino`);
  };

  // Prepare categories with count for display
  const categoriesWithCount = categories.map(category => {
    const count = products.filter(p => p.categoryId === category.id).length;
    return { ...category, productCount: count };
  });

  return (
    <div className="p-6 space-y-6 bg-background text-background-foreground">
      {/* Header with action buttons */}
      <InventoryHeader 
        title="Gestione Magazzino Ingredienti"
        onManageCategories={() => setIsManagingCategories(true)}
        className="text-gold-500"
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

      {/* Add/Edit Product Sheet */}
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

      {/* Manage Categories Drawer */}
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

      {/* Add Stock Sheet */}
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
    </div>
  );
}

export default InventoryPage;

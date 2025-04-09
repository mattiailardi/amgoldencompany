import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Search, Upload, ListFilter } from "lucide-react";
import { Product, ProductCategory, generateMockCategories, generateMockProducts } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";

// Import our new components
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { ProductForm } from "@/components/inventory/ProductForm";
import { CategoryForm } from "@/components/inventory/CategoryForm";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { LowStockTable } from "@/components/inventory/LowStockTable";

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

  const categoriesWithCount = categories.map(category => {
    const count = products.filter(p => p.categoryId === category.id).length;
    return { ...category, productCount: count };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestione Magazzino Ingredienti</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-2 border-gold-300"
            onClick={() => navigate("/inventory/import")}
          >
            <Upload className="h-4 w-4" />
            Importa CSV
          </Button>
          
          <Drawer open={isManagingCategories} onOpenChange={setIsManagingCategories}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="gap-2 border-gold-300">
                <ListFilter className="h-4 w-4" />
                Gestisci Categorie
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-4xl">
                <DrawerHeader className="text-left">
                  <DrawerTitle>Gestione Categorie</DrawerTitle>
                  <DrawerDescription>
                    Gestisci le categorie degli ingredienti del magazzino
                  </DrawerDescription>
                </DrawerHeader>
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
                            onSave={handleAddCategory}
                            onCancel={() => setIsAddingCategory(false)}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  <DataTable
                    data={categoriesWithCount}
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
                              onClick={() => handleDeleteCategory(row.id)}
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
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStats products={products} />

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca ingredienti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gold-300"
          />
        </div>
        <Button 
          onClick={() => setIsAddingProduct(true)}
          className="bg-primary hover:bg-primary/90"
        >
          Aggiungi Ingrediente
        </Button>
      </div>

      {/* Tabs for All Products and Low Stock */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 md:w-[400px] bg-muted/50 border border-gold-300">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Tutti gli Ingredienti
          </TabsTrigger>
          <TabsTrigger 
            value="lowStock"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Sotto Scorta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card className="border-gold-300">
            <CardHeader>
              <CardTitle>Inventario Completo</CardTitle>
              <CardDescription>
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
          <Card className="border-gold-300">
            <CardHeader>
              <CardTitle>Ingredienti Sotto Scorta</CardTitle>
              <CardDescription>
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
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="product" className="text-sm font-medium">
                Prodotto
              </label>
              <Select 
                value={selectedProductForStock?.toString() || ""} 
                onValueChange={(value) => setSelectedProductForStock(parseInt(value))}
              >
                <SelectTrigger className="border-gold-300">
                  <SelectValue placeholder="Seleziona prodotto" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <React.Fragment key={`category-${category.id}`}>
                      <SelectItem value={`category-${category.id}`} disabled className="font-bold">
                        {category.name}
                      </SelectItem>
                      {products
                        .filter(p => p.categoryId === category.id)
                        .map(product => (
                          <SelectItem key={product.id} value={product.id.toString()} className="pl-6">
                            {product.name} ({product.currentQuantity} {product.unit})
                          </SelectItem>
                        ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantità da aggiungere
              </label>
              <Input 
                id="quantity" 
                type="number" 
                min="0.01" 
                step="0.01" 
                defaultValue="1"
                className="border-gold-300"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddingStock(false)}>
                Annulla
              </Button>
              <Button 
                onClick={() => {
                  if (selectedProductForStock) {
                    const quantityEl = document.getElementById('quantity') as HTMLInputElement;
                    const quantity = parseFloat(quantityEl.value);
                    
                    if (isNaN(quantity) || quantity <= 0) {
                      toast.error("Inserisci una quantità valida");
                      return;
                    }
                    
                    handleSaveAddedStock(selectedProductForStock, quantity);
                  } else {
                    toast.error("Seleziona un prodotto");
                  }
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Aggiungi
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default InventoryPage;

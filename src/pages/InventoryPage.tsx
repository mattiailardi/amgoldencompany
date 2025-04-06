
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { Plus, Search, Upload, Edit, Trash } from "lucide-react";
import { Product, ProductCategory, generateMockCategories, generateMockProducts } from "@/types";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function InventoryPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(generateMockProducts());
  const [categories, setCategories] = useState<ProductCategory[]>(generateMockCategories());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    categoryId: 1,
    unit: "kg",
    unitPrice: 0,
    tax: 10,
    currentQuantity: 0,
    thresholdQuantity: 0,
    notes: ""
  });
  const [newCategory, setNewCategory] = useState<Partial<ProductCategory>>({
    name: ""
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockProducts = products.filter(
    (product) => product.thresholdQuantity && product.currentQuantity < product.thresholdQuantity
  );

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success(`Prodotto eliminato con successo`);
  };

  const handleDeleteCategory = (categoryId: number) => {
    const hasProducts = products.some(p => p.categoryId === categoryId);
    
    if (hasProducts) {
      toast.error("Impossibile eliminare una categoria che contiene prodotti");
    } else {
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success(`Categoria eliminata con successo`);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.unit || newProduct.unitPrice === undefined) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    const category = categories.find(c => c.id === newProduct.categoryId);
    
    const productToAdd: Product = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: newProduct.name,
      categoryId: newProduct.categoryId || 1,
      unit: newProduct.unit,
      unitPrice: newProduct.unitPrice,
      tax: newProduct.tax || 10,
      currentQuantity: newProduct.currentQuantity || 0,
      thresholdQuantity: newProduct.thresholdQuantity,
      notes: newProduct.notes,
      categoryName: category?.name
    };

    setProducts([...products, productToAdd]);
    setNewProduct({
      name: "",
      categoryId: 1,
      unit: "kg",
      unitPrice: 0,
      tax: 10,
      currentQuantity: 0,
      thresholdQuantity: 0,
      notes: ""
    });
    setIsAddingProduct(false);
    toast.success("Prodotto aggiunto con successo");
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Inserisci il nome della categoria");
      return;
    }

    const categoryToAdd: ProductCategory = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: newCategory.name
    };

    setCategories([...categories, categoryToAdd]);
    setNewCategory({ name: "" });
    setIsAddingCategory(false);
    toast.success("Categoria aggiunta con successo");
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
            className="gap-2"
            onClick={() => navigate("/inventory/import")}
          >
            <Upload className="h-4 w-4" />
            Importa CSV
          </Button>
          <Sheet open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuovo Ingrediente
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Aggiungi Nuovo Ingrediente</SheetTitle>
                <SheetDescription>
                  Inserisci i dettagli del nuovo ingrediente da aggiungere al magazzino
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Ingrediente *</Label>
                  <Input 
                    id="name" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                    placeholder="Es. Pomodori San Marzano"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <select 
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({...newProduct, categoryId: Number(e.target.value)})}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unità di Misura *</Label>
                    <select 
                      id="unit"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    >
                      <option value="kg">Kg</option>
                      <option value="g">g</option>
                      <option value="l">l</option>
                      <option value="ml">ml</option>
                      <option value="pz">pz</option>
                      <option value="conf">conf</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prezzo Unitario (€) *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={newProduct.unitPrice} 
                      onChange={(e) => setNewProduct({...newProduct, unitPrice: Number(e.target.value)})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantità Attuale</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={newProduct.currentQuantity} 
                      onChange={(e) => setNewProduct({...newProduct, currentQuantity: Number(e.target.value)})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Soglia Minima</Label>
                    <Input 
                      id="threshold" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={newProduct.thresholdQuantity} 
                      onChange={(e) => setNewProduct({...newProduct, thresholdQuantity: Number(e.target.value)})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Note</Label>
                  <Textarea 
                    id="notes" 
                    value={newProduct.notes || ''} 
                    onChange={(e) => setNewProduct({...newProduct, notes: e.target.value})} 
                    placeholder="Dettagli aggiuntivi sull'ingrediente"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingProduct(false)}>Annulla</Button>
                  <Button onClick={handleAddProduct}>Aggiungi Ingrediente</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                Attenzione
              </Badge>
              <p className="text-amber-800">
                {lowStockProducts.length} ingredienti sotto la soglia di scorta minima
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca ingredienti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 md:w-[400px]">
          <TabsTrigger value="all">Tutti gli Ingredienti</TabsTrigger>
          <TabsTrigger value="lowStock">Sotto Scorta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Inventario Completo</CardTitle>
              <CardDescription>
                Tutti gli ingredienti presenti in magazzino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredProducts}
                columns={[
                  {
                    header: "Nome Ingrediente",
                    accessorKey: "name",
                  },
                  {
                    header: "Categoria",
                    accessorKey: "categoryName",
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
                          onClick={() => navigate(`/inventory/product/edit/${row.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifica
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(row.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lowStock">
          <Card>
            <CardHeader>
              <CardTitle>Ingredienti Sotto Scorta</CardTitle>
              <CardDescription>
                Ingredienti che necessitano di rifornimento
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        onClick={() => navigate(`/inventory/add`)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Rifornisci
                      </Button>
                    )
                  },
                ]}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Categorie Ingredienti</CardTitle>
          <CardDescription>
            Gestione delle categorie di ingredienti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Sheet open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <SheetTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Nuova Categoria
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Aggiungi Nuova Categoria</SheetTitle>
                  <SheetDescription>
                    Crea una nuova categoria per organizzare gli ingredienti
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Nome Categoria *</Label>
                    <Input 
                      id="category-name" 
                      value={newCategory.name} 
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} 
                      placeholder="Es. Latticini"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingCategory(false)}>Annulla</Button>
                    <Button onClick={handleAddCategory}>Aggiungi Categoria</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <DataTable
            data={categoriesWithCount}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
              },
              {
                header: "Nome",
                accessorKey: "name",
              },
              {
                header: "Prodotti",
                accessorKey: "id",
                id: "productCount",
                cell: (row) => {
                  const count = products.filter(p => p.categoryId === row.id).length;
                  return <Badge variant="outline">{count} ingredienti</Badge>;
                }
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
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifica
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteCategory(row.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Elimina
                    </Button>
                  </div>
                )
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryPage;

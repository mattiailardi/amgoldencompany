
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

export function InventoryPage() {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(generateMockProducts());
  const [categories] = useState<ProductCategory[]>(generateMockCategories());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockProducts = products.filter(
    (product) => product.thresholdQuantity && product.currentQuantity < product.thresholdQuantity
  );

  const handleDeleteProduct = (productId: number) => {
    // In a real app, we would delete from database
    // For this mock, we'll just show a success message
    const product = products.find(p => p.id === productId);
    
    if (product) {
      toast.success(`Prodotto "${product.name}" eliminato con successo`);
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    // In a real app, we would delete from database
    // For this mock, we'll just show a success message
    const category = categories.find(c => c.id === categoryId);
    
    if (category) {
      // Check if category has products
      const hasProducts = products.some(p => p.categoryId === categoryId);
      
      if (hasProducts) {
        toast.error("Impossibile eliminare una categoria che contiene prodotti");
      } else {
        toast.success(`Categoria "${category.name}" eliminata con successo`);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestione Magazzino</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/inventory/import")}
          >
            <Upload className="h-4 w-4" />
            Importa CSV
          </Button>
          <Button 
            className="gap-2"
            onClick={() => navigate("/inventory/product/new")}
          >
            <Plus className="h-4 w-4" />
            Nuovo Prodotto
          </Button>
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
                {lowStockProducts.length} prodotti sotto la soglia di scorta minima
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca prodotti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 md:w-[400px]">
          <TabsTrigger value="all">Tutti</TabsTrigger>
          <TabsTrigger value="lowStock">Sotto Scorta</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredienti</TabsTrigger>
          <TabsTrigger value="products">Prodotti Finiti</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Inventario Completo</CardTitle>
              <CardDescription>
                Tutti i prodotti presenti in magazzino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredProducts}
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
                    cell: (row) => `€${row.unitPrice.toFixed(2)}`
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
              <CardTitle>Prodotti Sotto Scorta</CardTitle>
              <CardDescription>
                Prodotti che necessitano di rifornimento
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
        
        <TabsContent value="ingredients">
          <Card>
            <CardHeader>
              <CardTitle>Ingredienti</CardTitle>
              <CardDescription>
                Materie prime utilizzate nella preparazione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={products.filter(p => p.categoryId === 5)} // Filter for ingredients category
                columns={[
                  {
                    header: "Nome",
                    accessorKey: "name",
                  },
                  {
                    header: "Quantità",
                    accessorKey: "currentQuantity",
                    cell: (row) => `${row.currentQuantity} ${row.unit}`
                  },
                  {
                    header: "Prezzo",
                    accessorKey: "unitPrice",
                    cell: (row) => `€${row.unitPrice.toFixed(2)}`
                  },
                  {
                    header: "Azioni",
                    accessorKey: "id",
                    id: "ingredientsActions",
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
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/inventory/add`)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Aggiungi
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
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Prodotti Finiti</CardTitle>
              <CardDescription>
                Prodotti pronti per la vendita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={products.filter(p => p.categoryId !== 5)} // Exclude ingredients category
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
                    header: "Prezzo",
                    accessorKey: "unitPrice",
                    cell: (row) => `€${row.unitPrice.toFixed(2)}`
                  },
                  {
                    header: "IVA",
                    accessorKey: "tax",
                    cell: (row) => `${row.tax}%`
                  },
                  {
                    header: "Azioni",
                    accessorKey: "id",
                    id: "finishedProductsActions",
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
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Categorie Prodotti</CardTitle>
          <CardDescription>
            Gestione delle categorie di prodotti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => navigate("/inventory/category/new")}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Nuova Categoria
            </Button>
          </div>
          <DataTable
            data={categories}
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
                  return <Badge variant="outline">{count} prodotti</Badge>;
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

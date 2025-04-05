
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data for categories
const mockIncomeCategories = [
  { id: 1, name: "Vendite Pizze", count: 156 },
  { id: 2, name: "Vendite Bevande", count: 98 },
  { id: 3, name: "Vendite Dolci", count: 45 },
  { id: 4, name: "Vendite Antipasti", count: 67 },
  { id: 5, name: "Altri Ricavi", count: 12 },
];

const mockExpenseCategories = [
  { id: 1, name: "Materie Prime", count: 87 },
  { id: 2, name: "Stipendi", count: 42 },
  { id: 3, name: "Utenze", count: 23 },
  { id: 4, name: "Affitto", count: 12 },
  { id: 5, name: "Manutenzione", count: 18 },
  { id: 6, name: "Marketing", count: 9 },
  { id: 7, name: "Tasse", count: 15 },
  { id: 8, name: "Altro", count: 21 },
];

const AccountingCategoriesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("income");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategory, setEditCategory] = useState<{ id: number; name: string } | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<{ id: number; name: string } | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Inserisci un nome per la categoria");
      return;
    }

    toast.success(`Categoria "${newCategoryName}" aggiunta con successo`);
    setNewCategoryName("");
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = () => {
    if (!editCategory || !editCategory.name.trim()) {
      toast.error("Inserisci un nome valido per la categoria");
      return;
    }

    toast.success(`Categoria aggiornata con successo`);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCategory = () => {
    if (!deleteCategory) return;
    
    toast.success(`Categoria "${deleteCategory.name}" eliminata con successo`);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (category: { id: number; name: string }) => {
    setEditCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: { id: number; name: string }) => {
    setDeleteCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/accounting")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Indietro
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Gestione Categorie</h1>
          <p className="text-gray-500">Modifica le categorie di entrate e uscite</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="income">Categorie Entrate</TabsTrigger>
            <TabsTrigger value="expense">Categorie Uscite</TabsTrigger>
          </TabsList>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aggiungi Categoria</DialogTitle>
                <DialogDescription>
                  Crea una nuova categoria di {activeTab === "income" ? "entrata" : "uscita"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Categoria</Label>
                  <Input
                    id="name"
                    placeholder="Inserisci il nome della categoria"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleAddCategory}>
                  Aggiungi Categoria
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorie di Entrata</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Categoria</TableHead>
                    <TableHead>Transazioni</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockIncomeCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => openDeleteDialog(category)}
                            disabled={category.count > 0}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorie di Uscita</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Categoria</TableHead>
                    <TableHead>Transazioni</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExpenseCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => openDeleteDialog(category)}
                            disabled={category.count > 0}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Categoria</DialogTitle>
            <DialogDescription>
              Cambia il nome della categoria selezionata
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Categoria</Label>
              <Input
                id="edit-name"
                placeholder="Inserisci il nuovo nome"
                value={editCategory?.name || ""}
                onChange={(e) => setEditCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleEditCategory}>
              Salva Modifiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elimina Categoria</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare questa categoria? L'operazione è irreversibile.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Stai per eliminare la categoria: <strong>{deleteCategory?.name}</strong></p>
            <p className="text-sm text-muted-foreground mt-2">
              Nota: Puoi eliminare solo categorie che non contengono transazioni.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Note sull'utilizzo</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="list-disc pl-5 space-y-2">
              <li>Le categorie con transazioni associate non possono essere eliminate</li>
              <li>Puoi modificare il nome di una categoria in qualsiasi momento</li>
              <li>Le modifiche alle categorie verranno applicate a tutte le transazioni esistenti</li>
              <li>È consigliabile utilizzare nomi descrittivi per le categorie</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingCategoriesPage;

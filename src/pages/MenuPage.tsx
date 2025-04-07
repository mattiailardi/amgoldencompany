
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Search, X, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateMockProducts, Product } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  category: string;
  price: number;
}

const MenuPage = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Margherita",
      description: "Pizza classica con pomodoro e mozzarella",
      ingredients: ["Pomodoro", "Mozzarella", "Basilico", "Olio d'oliva"],
      category: "Pizza",
      price: 7.5,
    },
    {
      id: "2",
      name: "Carbonara",
      description: "Pasta con uova, guanciale e pecorino",
      ingredients: ["Pasta", "Uova", "Guanciale", "Pecorino", "Pepe nero"],
      category: "Primi",
      price: 10,
    },
    {
      id: "3",
      name: "Diavola",
      description: "Pizza piccante con salame piccante",
      ingredients: ["Pomodoro", "Mozzarella", "Salame piccante", "Olio d'oliva"],
      category: "Pizza",
      price: 9,
    },
    {
      id: "4",
      name: "Insalata Mista",
      description: "Insalata mista con verdure di stagione",
      ingredients: ["Lattuga", "Pomodoro", "Carote", "Cetrioli", "Olio d'oliva"],
      category: "Contorni",
      price: 5,
    },
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    ingredients: [],
    category: "",
    price: 0,
  });
  
  const [searchIngredient, setSearchIngredient] = useState("");
  const [isIngredientPopoverOpen, setIsIngredientPopoverOpen] = useState(false);
  const [inventoryIngredients] = useState<Product[]>(generateMockProducts());
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Get all unique categories from menu items
  const categories = [...new Set(menuItems.map(item => item.category))];

  const resetForm = () => {
    setIsEditing(false);
    setIsFormVisible(false);
    setCurrentItem({
      id: "",
      name: "",
      description: "",
      ingredients: [],
      category: "",
      price: 0,
    });
    setSearchIngredient("");
  };

  const handleEditItem = (item: MenuItem) => {
    setIsEditing(true);
    setIsFormVisible(true);
    setCurrentItem({...item});
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({
      title: "Piatto rimosso",
      description: "Il piatto è stato rimosso dal menu",
    });
  };

  const handleAddIngredient = (ingredient: string) => {
    if (!ingredient.trim()) return;
    
    if (!currentItem.ingredients.includes(ingredient.trim())) {
      setCurrentItem({
        ...currentItem,
        ingredients: [...currentItem.ingredients, ingredient.trim()]
      });
    }
    
    setSearchIngredient("");
    setIsIngredientPopoverOpen(false);
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...currentItem.ingredients];
    updatedIngredients.splice(index, 1);
    setCurrentItem({
      ...currentItem,
      ingredients: updatedIngredients
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      setMenuItems(menuItems.map(item => 
        item.id === currentItem.id ? currentItem : item
      ));
      toast({
        title: "Piatto aggiornato",
        description: "Il piatto è stato aggiornato nel menu",
      });
    } else {
      const newItem = {
        ...currentItem,
        id: Date.now().toString()
      };
      setMenuItems([...menuItems, newItem]);
      toast({
        title: "Piatto aggiunto",
        description: "Il nuovo piatto è stato aggiunto al menu",
      });
    }
    
    resetForm();
  };

  // Filter ingredients from inventory based on search
  const filteredIngredients = inventoryIngredients
    .filter(ing => 
      ing.name.toLowerCase().includes(searchIngredient.toLowerCase()) &&
      !currentItem.ingredients.includes(ing.name)
    )
    .slice(0, 5); // Limit to 5 results for better UX

  // Filter menu items by category if a filter is selected
  const filteredMenuItems = filterCategory 
    ? menuItems.filter(item => item.category === filterCategory)
    : menuItems;

  const handleCategoryFilter = (category: string | null) => {
    setFilterCategory(category);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menu</h1>
          <p className="text-gray-500">Gestisci il menu del tuo ristorante</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {filterCategory ? `Categoria: ${filterCategory}` : "Tutte le categorie"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="space-y-1">
                <Button 
                  variant={filterCategory === null ? "default" : "ghost"} 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => handleCategoryFilter(null)}
                >
                  Tutte le categorie
                </Button>
                {categories.map(category => (
                  <Button 
                    key={category} 
                    variant={filterCategory === category ? "default" : "ghost"} 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Sheet open={isFormVisible} onOpenChange={setIsFormVisible}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Piatto
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>{isEditing ? "Modifica Piatto" : "Aggiungi Piatto"}</SheetTitle>
                <SheetDescription>
                  {isEditing ? "Modifica i dettagli del piatto selezionato." : "Inserisci i dettagli del nuovo piatto da aggiungere al menu."}
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="dish-name" className="block text-sm font-medium mb-1">Nome</label>
                    <Input 
                      id="dish-name"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dish-description" className="block text-sm font-medium mb-1">Descrizione</label>
                    <Textarea 
                      id="dish-description"
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dish-category" className="block text-sm font-medium mb-1">Categoria</label>
                    <Input 
                      id="dish-category"
                      value={currentItem.category}
                      onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dish-price" className="block text-sm font-medium mb-1">Prezzo (€)</label>
                    <Input 
                      id="dish-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentItem.price}
                      onChange={(e) => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dish-ingredient" className="block text-sm font-medium mb-1">Ingredienti</label>
                    <div className="flex space-x-2 mb-2">
                      <Popover open={isIngredientPopoverOpen} onOpenChange={setIsIngredientPopoverOpen}>
                        <PopoverTrigger asChild>
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Cerca ingredienti..."
                              value={searchIngredient}
                              onChange={(e) => {
                                setSearchIngredient(e.target.value);
                                setIsIngredientPopoverOpen(true);
                              }}
                              className="pl-10"
                              onFocus={() => setIsIngredientPopoverOpen(true)}
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          {filteredIngredients.length > 0 ? (
                            <div className="py-2">
                              {filteredIngredients.map((ing) => (
                                <button
                                  key={ing.id}
                                  type="button"
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                  onClick={() => handleAddIngredient(ing.name)}
                                >
                                  {ing.name} ({ing.unit})
                                </button>
                              ))}
                            </div>
                          ) : searchIngredient ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              Nessun ingrediente trovato
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              Inizia a digitare per cercare
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => handleAddIngredient(searchIngredient)}
                        aria-label="Aggiungi ingrediente"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-1 mt-2">
                      {currentItem.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="text-sm">{ingredient}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveIngredient(index)}
                            aria-label={`Rimuovi ingrediente ${ingredient}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={resetForm}
                    >
                      Annulla
                    </Button>
                    <Button type="submit">
                      {isEditing ? "Aggiorna" : "Aggiungi"}
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{item.name}</CardTitle>
                  <div className="text-xl font-bold">€{item.price.toFixed(2)}</div>
                </div>
                <CardDescription className="text-sm">{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{item.description}</p>
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Ingredienti:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.map((ingredient, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded-md">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditItem(item)}
                    aria-label="Modifica piatto"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Modifica
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label="Elimina piatto"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Elimina
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">Nessun piatto trovato. Aggiungi un nuovo piatto al menu.</p>
            <Button onClick={() => setIsFormVisible(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Piatto
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;

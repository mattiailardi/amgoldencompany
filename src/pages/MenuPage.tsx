
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateMockProducts, Product } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
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

  const resetForm = () => {
    setIsEditing(false);
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

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="text-sm font-normal">€{item.price.toFixed(2)}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{item.description}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Ingredienti:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {item.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditItem(item)}
                      aria-label="Modifica piatto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label="Elimina piatto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Modifica Piatto" : "Aggiungi Piatto"}</CardTitle>
            </CardHeader>
            <CardContent>
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
                
                <div className="flex justify-between pt-2">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;

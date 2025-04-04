
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  ingredients: string[];
  price: number;
}

interface Ingredient {
  name: string;
  cost: number;
  quantity: number;
}

interface CustomDish {
  name: string;
  ingredients: Ingredient[];
}

const FoodCostPage = () => {
  const { toast } = useToast();
  
  // Sample menu items from the menu page
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Margherita",
      ingredients: ["Pomodoro", "Mozzarella", "Basilico", "Olio d'oliva"],
      price: 7.5,
    },
    {
      id: "2",
      name: "Carbonara",
      ingredients: ["Pasta", "Uova", "Guanciale", "Pecorino", "Pepe nero"],
      price: 10,
    },
  ]);

  // Cost data for ingredients
  const [ingredientCosts, setIngredientCosts] = useState<Record<string, number>>({
    "Pomodoro": 1.2,
    "Mozzarella": 2.5,
    "Basilico": 0.5,
    "Olio d'oliva": 0.8,
    "Pasta": 1.0,
    "Uova": 1.5,
    "Guanciale": 3.0,
    "Pecorino": 2.0,
    "Pepe nero": 0.2,
  });
  
  const [customDish, setCustomDish] = useState<CustomDish>({
    name: "",
    ingredients: [],
  });
  
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    cost: 0,
    quantity: 1,
  });

  const calculateMenuItemCost = (item: MenuItem) => {
    return item.ingredients.reduce((total, ing) => {
      return total + (ingredientCosts[ing] || 0);
    }, 0);
  };
  
  const calculateProfitMargin = (item: MenuItem) => {
    const cost = calculateMenuItemCost(item);
    return ((item.price - cost) / item.price) * 100;
  };
  
  const calculateCustomDishCost = () => {
    return customDish.ingredients.reduce((total, ing) => {
      return total + (ing.cost * ing.quantity);
    }, 0);
  };
  
  const handleAddIngredient = () => {
    if (newIngredient.name.trim() === "") return;
    
    setCustomDish({
      ...customDish,
      ingredients: [...customDish.ingredients, { ...newIngredient }]
    });
    
    setNewIngredient({
      name: "",
      cost: 0,
      quantity: 1
    });
  };
  
  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...customDish.ingredients];
    updatedIngredients.splice(index, 1);
    setCustomDish({
      ...customDish,
      ingredients: updatedIngredients
    });
  };
  
  const handleSaveCustomDish = () => {
    if (customDish.name.trim() === "") {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il piatto",
        variant: "destructive"
      });
      return;
    }
    
    if (customDish.ingredients.length === 0) {
      toast({
        title: "Errore",
        description: "Aggiungi almeno un ingrediente",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would save the custom dish
    toast({
      title: "Piatto salvato",
      description: `Il piatto ${customDish.name} è stato salvato con successo`,
    });
    
    // Reset the form
    setCustomDish({
      name: "",
      ingredients: []
    });
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Food Cost</h1>
      
      <Tabs defaultValue="menu">
        <TabsList className="mb-6">
          <TabsTrigger value="menu">Piatti da Menu</TabsTrigger>
          <TabsTrigger value="custom">Calcolo Personalizzato</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Analisi Food Cost Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Piatto</TableHead>
                    <TableHead>Ingredienti</TableHead>
                    <TableHead className="text-right">Prezzo Vendita (€)</TableHead>
                    <TableHead className="text-right">Food Cost (€)</TableHead>
                    <TableHead className="text-right">Margine (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => {
                    const cost = calculateMenuItemCost(item);
                    const margin = calculateProfitMargin(item);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.ingredients.join(", ")}</TableCell>
                        <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{cost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{margin.toFixed(2)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calcolo Food Cost Personalizzato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome del Piatto</label>
                    <Input 
                      value={customDish.name}
                      onChange={(e) => setCustomDish({...customDish, name: e.target.value})}
                      placeholder="Nome del piatto"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Aggiungi Ingrediente</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Input 
                        placeholder="Ingrediente"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                      />
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Costo (€)"
                        value={newIngredient.cost === 0 ? "" : newIngredient.cost}
                        onChange={(e) => setNewIngredient({...newIngredient, cost: parseFloat(e.target.value) || 0})}
                      />
                      <div className="flex space-x-2">
                        <Input 
                          type="number" 
                          placeholder="Quantità"
                          value={newIngredient.quantity}
                          onChange={(e) => setNewIngredient({...newIngredient, quantity: parseInt(e.target.value) || 1})}
                        />
                        <Button type="button" size="icon" onClick={handleAddIngredient}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Ingredienti Aggiunti</label>
                    {customDish.ingredients.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nessun ingrediente aggiunto</p>
                    ) : (
                      <div className="space-y-2">
                        {customDish.ingredients.map((ing, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span className="text-sm">{ing.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">€{ing.cost.toFixed(2)} x {ing.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveIngredient(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleSaveCustomDish}
                    disabled={customDish.name === "" || customDish.ingredients.length === 0}
                  >
                    Salva Piatto
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo Food Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{customDish.name || "Nuovo Piatto"}</h3>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingrediente</TableHead>
                          <TableHead className="text-right">Costo Unitario (€)</TableHead>
                          <TableHead className="text-right">Quantità</TableHead>
                          <TableHead className="text-right">Totale (€)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customDish.ingredients.map((ing, index) => (
                          <TableRow key={index}>
                            <TableCell>{ing.name}</TableCell>
                            <TableCell className="text-right">{ing.cost.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{ing.quantity}</TableCell>
                            <TableCell className="text-right">{(ing.cost * ing.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Costo Totale:</span>
                        <span className="text-xl font-bold">€{calculateCustomDishCost().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodCostPage;

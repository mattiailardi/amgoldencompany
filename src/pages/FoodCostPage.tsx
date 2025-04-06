import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ArrowLeft, Calculator, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  ingredients: string[];
  price: number;
  costPercentage?: number;
  foodCost?: number;
}

interface CustomDish {
  id: string;
  name: string;
  ingredients: Array<{name: string; cost: number; quantity: string}>;
  totalCost: number;
  suggestedPrice: number;
}

const FoodCostPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sample menu items data from MenuPage
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Margherita",
      ingredients: ["Pomodoro", "Mozzarella", "Basilico", "Olio d'oliva"],
      price: 7.5,
      foodCost: 2.25,
      costPercentage: 30
    },
    {
      id: "2",
      name: "Carbonara",
      ingredients: ["Pasta", "Uova", "Guanciale", "Pecorino", "Pepe nero"],
      price: 10,
      foodCost: 3.5,
      costPercentage: 35
    },
  ]);

  // Custom dishes for manual calculations
  const [customDishes, setCustomDishes] = useState<CustomDish[]>([
    {
      id: "c1",
      name: "Pizza Speciale",
      ingredients: [
        {name: "Impasto", cost: 0.80, quantity: "250g"},
        {name: "Mozzarella", cost: 1.20, quantity: "150g"},
        {name: "Funghi porcini", cost: 2.50, quantity: "100g"},
        {name: "Tartufo", cost: 3.00, quantity: "10g"},
      ],
      totalCost: 7.50,
      suggestedPrice: 25.00
    }
  ]);

  // New custom dish form
  const [newDish, setNewDish] = useState<CustomDish>({
    id: "",
    name: "",
    ingredients: [],
    totalCost: 0,
    suggestedPrice: 0
  });

  // New ingredient for custom dish
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    cost: 0,
    quantity: ""
  });

  // Calculate food cost data for menu items
  useEffect(() => {
    // In a real app, you would fetch this data from the API
    // Here we're just generating sample data
    const updatedMenuItems = menuItems.map(item => {
      // If foodCost is already set, use that value
      if (item.foodCost && item.costPercentage) {
        return item;
      }
      
      // Otherwise, calculate random values
      const foodCost = parseFloat((item.price * 0.3).toFixed(2));
      const costPercentage = parseFloat((foodCost / item.price * 100).toFixed(0));
      
      return {
        ...item,
        foodCost,
        costPercentage
      };
    });
    
    setMenuItems(updatedMenuItems);
  }, []);

  const handleAddIngredientToNewDish = () => {
    if (!newIngredient.name || newIngredient.cost <= 0) {
      toast({
        title: "Errore",
        description: "Inserisci nome e costo dell'ingrediente",
        variant: "destructive"
      });
      return;
    }

    const updatedDish = {
      ...newDish,
      ingredients: [...newDish.ingredients, {...newIngredient}]
    };

    // Calculate the new total cost
    const totalCost = updatedDish.ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    updatedDish.totalCost = parseFloat(totalCost.toFixed(2));
    
    // Suggest a price with 30% food cost
    updatedDish.suggestedPrice = parseFloat((totalCost / 0.3).toFixed(2));

    setNewDish(updatedDish);
    setNewIngredient({name: "", cost: 0, quantity: ""});
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...newDish.ingredients];
    updatedIngredients.splice(index, 1);
    
    // Recalculate costs
    const totalCost = updatedIngredients.reduce((sum, ing) => sum + ing.cost, 0);
    const suggestedPrice = totalCost > 0 ? parseFloat((totalCost / 0.3).toFixed(2)) : 0;
    
    setNewDish({
      ...newDish,
      ingredients: updatedIngredients,
      totalCost: parseFloat(totalCost.toFixed(2)),
      suggestedPrice
    });
  };

  const handleSaveNewDish = () => {
    if (!newDish.name || newDish.ingredients.length === 0) {
      toast({
        title: "Errore",
        description: "Inserisci nome e almeno un ingrediente",
        variant: "destructive"
      });
      return;
    }

    const dishToSave = {
      ...newDish,
      id: `c${Date.now()}`
    };

    setCustomDishes([...customDishes, dishToSave]);
    
    // Reset form
    setNewDish({
      id: "",
      name: "",
      ingredients: [],
      totalCost: 0,
      suggestedPrice: 0
    });

    toast({
      title: "Successo",
      description: "Piatto personalizzato salvato correttamente"
    });
  };

  return (
    <div className="container py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/menu")}
          aria-label="Torna al menu"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Food Cost</h1>
      </div>

      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="menu">Piatti Menu</TabsTrigger>
          <TabsTrigger value="custom">Calcoli Personalizzati</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Food Cost Piatti Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ingredienti</TableHead>
                    <TableHead className="text-right">Prezzo (€)</TableHead>
                    <TableHead className="text-right">Food Cost (€)</TableHead>
                    <TableHead className="text-right">Food Cost (%)</TableHead>
                    <TableHead className="text-right">Margine (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {item.ingredients.join(", ")}
                      </TableCell>
                      <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.foodCost?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.costPercentage}%</TableCell>
                      <TableCell className="text-right">
                        {item.foodCost ? (item.price - item.foodCost).toFixed(2) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => navigate("/menu")}>
                  Gestisci Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Calcoli Personalizzati</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Numero Ingredienti</TableHead>
                        <TableHead className="text-right">Costo Totale (€)</TableHead>
                        <TableHead className="text-right">Prezzo Suggerito (€)</TableHead>
                        <TableHead className="text-right">Food Cost (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customDishes.map((dish) => (
                        <TableRow key={dish.id}>
                          <TableCell className="font-medium">{dish.name}</TableCell>
                          <TableCell>{dish.ingredients.length}</TableCell>
                          <TableCell className="text-right">{dish.totalCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{dish.suggestedPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            {dish.suggestedPrice > 0 
                              ? (dish.totalCost / dish.suggestedPrice * 100).toFixed(0) 
                              : "0"}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Nuovo Calcolo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="dish-name" className="block text-sm font-medium mb-1">Nome Piatto</label>
                      <Input 
                        id="dish-name"
                        value={newDish.name}
                        onChange={(e) => setNewDish({...newDish, name: e.target.value})}
                        placeholder="Nome del piatto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium">Aggiungi Ingrediente</label>
                        <div className="grid grid-cols-5 gap-2">
                          <div className="col-span-2">
                            <Input 
                              placeholder="Nome"
                              value={newIngredient.name}
                              onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder="Costo €"
                              value={newIngredient.cost || ""}
                              onChange={(e) => setNewIngredient({...newIngredient, cost: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div>
                            <Input 
                              placeholder="Quantità"
                              value={newIngredient.quantity}
                              onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
                            />
                          </div>
                          <div>
                            <Button 
                              type="button" 
                              size="icon" 
                              onClick={handleAddIngredientToNewDish}
                              aria-label="Aggiungi ingrediente"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {newDish.ingredients.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Ingredienti aggiunti:</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Quantità</TableHead>
                                <TableHead className="text-right">Costo (€)</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {newDish.ingredients.map((ing, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{ing.name}</TableCell>
                                  <TableCell>{ing.quantity}</TableCell>
                                  <TableCell className="text-right">{ing.cost.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleRemoveIngredient(idx)}
                                      aria-label={`Rimuovi ${ing.name}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={2} className="font-bold">Totale</TableCell>
                                <TableCell className="text-right font-bold">{newDish.totalCost.toFixed(2)}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                    
                    {newDish.ingredients.length > 0 && (
                      <div className="pt-4 space-y-4 border-t">
                        <div>
                          <div className="flex justify-between mb-1">
                            <label htmlFor="suggested-price" className="block text-sm font-medium">Prezzo Suggerito (30% food cost)</label>
                            <span className="text-sm text-muted-foreground">€{newDish.suggestedPrice.toFixed(2)}</span>
                          </div>
                          <Input 
                            id="suggested-price"
                            type="range"
                            min={newDish.totalCost}
                            max={newDish.totalCost * 5}
                            step="0.5"
                            value={newDish.suggestedPrice}
                            onChange={(e) => setNewDish({...newDish, suggestedPrice: parseFloat(e.target.value)})}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Min (100%): €{newDish.totalCost.toFixed(2)}</span>
                            <span>Food Cost: {newDish.suggestedPrice > 0 
                              ? (newDish.totalCost / newDish.suggestedPrice * 100).toFixed(0) 
                              : "0"}%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setNewDish({
                              id: "",
                              name: "",
                              ingredients: [],
                              totalCost: 0,
                              suggestedPrice: 0
                            })}
                          >
                            Cancella
                          </Button>
                          <Button 
                            onClick={handleSaveNewDish}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salva
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodCostPage;

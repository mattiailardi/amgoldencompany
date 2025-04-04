
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CalendarIcon, Plus, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// Mock data for products
const mockProducts = [
  { id: 1, name: "Pizza Margherita", category: "Pizze", price: 8.50 },
  { id: 2, name: "Pizza Diavola", category: "Pizze", price: 10.00 },
  { id: 3, name: "Pizza Napoli", category: "Pizze", price: 9.50 },
  { id: 4, name: "Coca Cola 33cl", category: "Bibite", price: 3.00 },
  { id: 5, name: "Acqua 50cl", category: "Bibite", price: 2.00 },
  { id: 6, name: "Birra Moretti", category: "Bibite", price: 4.00 },
  { id: 7, name: "Tiramisù", category: "Dolci", price: 5.00 },
  { id: 8, name: "Panna Cotta", category: "Dolci", price: 4.50 },
];

// Schema per la validazione del form
const saleSchema = z.object({
  date: z.date({ required_error: "La data è obbligatoria" }),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number({ required_error: "Seleziona un prodotto" }),
      quantity: z.number().min(1, { message: "La quantità deve essere almeno 1" }),
      discount: z.number().min(0).max(100).optional().default(0),
    })
  ).min(1, { message: "Aggiungi almeno un prodotto" }),
});

type SaleFormValues = z.infer<typeof saleSchema>;

const NewSalePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Inizializzazione del form
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      date: new Date(),
      items: [{ productId: 0, quantity: 1, discount: 0 }],
    },
  });
  
  // Gestione degli item nel form (prodotti venduti)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Calcola il totale della vendita
  const calculateTotal = (items: SaleFormValues["items"]) => {
    return items.reduce((total, item) => {
      const product = mockProducts.find(p => p.id === item.productId);
      if (!product) return total;
      
      const itemPrice = product.price * item.quantity;
      const discountAmount = itemPrice * (item.discount || 0) / 100;
      
      return total + (itemPrice - discountAmount);
    }, 0);
  };
  
  // Handler del submit
  const onSubmit = (values: SaleFormValues) => {
    setIsSubmitting(true);
    
    // Simulazione dell'invio dei dati
    setTimeout(() => {
      console.log("Dati vendita inviati:", values);
      toast.success("Vendita registrata con successo!");
      setIsSubmitting(false);
      navigate("/sales");
    }, 800);
  };
  
  const watchItems = form.watch("items");
  const totalAmount = calculateTotal(watchItems);
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/sales")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Indietro
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuova Vendita</h1>
          <p className="text-gray-500">Registra una nuova vendita</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dettagli Vendita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={
                                "w-full pl-3 text-left font-normal flex justify-between"
                              }
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Seleziona una data</span>
                              )}
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2000-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data in cui è avvenuta la vendita
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Note aggiuntive sulla vendita..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Eventuali note o dettagli aggiuntivi
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riepilogo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prodotti:</span>
                    <span>{watchItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipi di prodotto:</span>
                    <span>{watchItems.filter(item => item.productId > 0).length}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-medium">Totale:</span>
                    <span className="font-bold text-xl">€{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Salvataggio..." : "Salva Vendita"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Prodotti Venduti</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: 0, quantity: 1, discount: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Prodotto
              </Button>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Nessun prodotto aggiunto</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => append({ productId: 0, quantity: 1, discount: 0 })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Aggiungi il primo prodotto
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => {
                    const productId = form.watch(`items.${index}.productId`);
                    const product = mockProducts.find(p => p.id === productId);
                    const quantity = form.watch(`items.${index}.quantity`) || 0;
                    const discount = form.watch(`items.${index}.discount`) || 0;
                    const itemTotal = product 
                      ? product.price * quantity * (1 - discount / 100)
                      : 0;
                      
                    return (
                      <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-5">
                          <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prodotto {index + 1}</FormLabel>
                                <Select
                                  value={field.value.toString()}
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleziona un prodotto" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {mockProducts.map((product) => (
                                      <SelectItem
                                        key={product.id}
                                        value={product.id.toString()}
                                      >
                                        {product.name} - €{product.price.toFixed(2)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantità</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value) || 0)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.discount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sconto %</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value) || 0)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <div className="text-right">
                            <p className="font-medium text-sm">Totale</p>
                            <p className="text-lg font-bold">
                              €{itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/sales")}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Registra Vendita"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewSalePage;

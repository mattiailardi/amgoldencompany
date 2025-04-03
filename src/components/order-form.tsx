
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Customer, Order, OrderItem, OrderStatus, Product, generateMockCustomers, generateMockProducts } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const orderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(0.25, { message: "La quantità deve essere almeno 0.25" }),
  notes: z.string().optional(),
  priceAtOrder: z.number(),
  productName: z.string(),
});

const orderFormSchema = z.object({
  customerId: z.number(),
  requestedDeliveryTime: z.string(),
  deliveryNotes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, { message: "Aggiungi almeno un prodotto" }),
});

type FormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  onSubmit: (data: Order) => void;
  onCancel: () => void;
}

export function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const [customers] = useState<Customer[]>(generateMockCustomers());
  const [products] = useState<Product[]>(generateMockProducts());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      items: [],
      requestedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    },
  });

  const { fields, append, remove } = form.useFieldArray({
    name: "items",
  });

  const handleSelectCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === parseInt(customerId));
    setSelectedCustomer(customer || null);
  };

  const handleSelectProduct = (productId: string, index: number) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      const currentItems = form.getValues("items");
      currentItems[index].productId = product.id;
      currentItems[index].productName = product.name;
      currentItems[index].priceAtOrder = product.unitPrice;
      form.setValue("items", currentItems);
    }
  };

  const onFormSubmit = (values: FormValues) => {
    if (!selectedCustomer) return;

    const now = new Date();
    const order: Order = {
      id: 0, // Will be assigned by parent component
      creationDate: now.toISOString(),
      customerId: values.customerId,
      customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      customerAddress: `${selectedCustomer.address}, ${selectedCustomer.houseNumber}`,
      requestedDeliveryTime: values.requestedDeliveryTime,
      deliveryNotes: values.deliveryNotes,
      status: OrderStatus.New,
      items: values.items.map(item => ({
        ...item,
        id: 0, // Would be assigned by database
        orderId: 0, // Will be linked to the order ID
      })),
      total: values.items.reduce((sum, item) => sum + (item.quantity * item.priceAtOrder), 0)
    };

    onSubmit(order);
  };

  const calculateTotal = () => {
    const items = form.getValues("items") || [];
    return items.reduce((sum, item) => sum + (item.quantity * (item.priceAtOrder || 0)), 0);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onFormSubmit)}>
        <div className="space-y-4">
          <h3 className="font-medium">Dettagli cliente e consegna</h3>
          
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                    handleSelectCustomer(value);
                  }}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.firstName} {customer.lastName} - {customer.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCustomer && (
            <div className="rounded-md border p-3 bg-muted/10">
              <div className="grid gap-y-2 gap-x-6 grid-cols-1 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Indirizzo</p>
                  <p className="font-medium">{selectedCustomer.address}, {selectedCustomer.houseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefono</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="requestedDeliveryTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orario di consegna richiesto</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="deliveryNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note di consegna</FormLabel>
                <FormControl>
                  <Textarea placeholder="Eventuali istruzioni per la consegna..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Prodotti ordinati</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  productId: 0,
                  quantity: 1,
                  notes: "",
                  priceAtOrder: 0,
                  productName: ""
                })
              }
            >
              <PlusCircle className="mr-1 h-4 w-4" /> Aggiungi Prodotto
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-4 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">Nessun prodotto aggiunto</p>
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  append({
                    productId: 0,
                    quantity: 1,
                    notes: "",
                    priceAtOrder: 0,
                    productName: ""
                  })
                }
              >
                Aggiungi il primo prodotto
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap gap-4 items-end border-b pb-4">
                <div className="flex-1 min-w-[200px]">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prodotto</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(parseInt(value));
                            handleSelectProduct(value, index);
                          }}
                          defaultValue={field.value.toString() || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona un prodotto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - €{product.unitPrice.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantità</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.25"
                          min="0.25"
                          className="w-[100px]"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.notes`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Input placeholder="Note speciali..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-1"
                  onClick={() => remove(index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {fields.length > 0 && (
            <div className="flex justify-end text-lg font-medium pt-4">
              <span>Totale: €{calculateTotal().toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit">Crea Ordine</Button>
        </div>
      </form>
    </Form>
  );
}

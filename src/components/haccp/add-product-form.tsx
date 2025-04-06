
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Camera, Upload } from "lucide-react";
import { Product } from "@/types";

interface AddProductFormProps {
  onSubmit: (product: any) => void;
  onCancel: () => void;
  inventoryIngredients?: Product[];
}

const AddProductForm = ({ onSubmit, onCancel, inventoryIngredients = [] }: AddProductFormProps) => {
  const [product, setProduct] = useState({
    name: "",
    lot: "",
    expiryDate: "",
    supplier: "",
    imageFile: null as File | null,
    notes: ""
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct({ ...product, imageFile: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!product.name) {
      toast.error("Il nome del prodotto è obbligatorio");
      return;
    }

    if (!product.lot) {
      toast.error("Il numero di lotto è obbligatorio");
      return;
    }

    if (!product.expiryDate) {
      toast.error("La data di scadenza è obbligatoria");
      return;
    }

    if (!product.imageFile) {
      toast.error("L'immagine del prodotto è obbligatoria");
      return;
    }

    setLoading(true);

    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you'd upload the image to a server here
      onSubmit({
        name: product.name,
        lot: product.lot,
        expiryDate: product.expiryDate,
        supplier: product.supplier,
        notes: product.notes,
        // In a real app, this would be the URL of the uploaded image
      });
      setLoading(false);
      toast.success("Prodotto aggiunto con successo");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Prodotto *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Es. Pomodoro San Marzano"
          value={product.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lot">Numero di Lotto *</Label>
        <Input
          id="lot"
          name="lot"
          placeholder="Es. L12345"
          value={product.lot}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiryDate">Data di Scadenza *</Label>
        <Input
          id="expiryDate"
          name="expiryDate"
          type="date"
          value={product.expiryDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Fornitore</Label>
        <Input
          id="supplier"
          name="supplier"
          placeholder="Es. Agricola Sud"
          value={product.supplier}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Foto Prodotto *</Label>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 h-44">
          {imagePreview ? (
            <div className="relative w-full h-full">
              <img 
                src={imagePreview} 
                alt="Anteprima prodotto" 
                className="object-contain w-full h-full"
              />
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                className="absolute top-0 right-0"
                onClick={() => {
                  setImagePreview(null);
                  setProduct({ ...product, imageFile: null });
                }}
              >
                Cambia
              </Button>
            </div>
          ) : (
            <label 
              htmlFor="image-upload" 
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <Camera className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Carica foto dell'etichetta</p>
              <p className="text-xs text-gray-400">Clicca o trascina qui</p>
              <input 
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Note Aggiuntive</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Aggiungi eventuali note..."
          value={product.notes}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="mr-2">Salvataggio...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Salva Prodotto
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;

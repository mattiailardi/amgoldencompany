
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, File, Check, X } from "lucide-react";

export function ImportCSVPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string[][]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Read file preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const csv = event.target.result as string;
          const lines = csv.split('\n');
          const result: string[][] = [];
          
          lines.forEach(line => {
            // Simple CSV parsing (doesn't handle quoted values with commas)
            const values = line.split(',');
            if (values.length > 1) { // Skip empty lines
              result.push(values);
            }
          });
          
          setPreview(result.slice(0, 5)); // Show only first 5 rows
        }
      };
      
      reader.readAsText(selectedFile);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Seleziona un file CSV");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, we would upload and process the CSV
      // For this mock, we'll simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`File ${file.name} importato con successo`);
      navigate("/inventory");
    } catch (error) {
      toast.error("Errore durante l'importazione");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Importa CSV</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Importa Dati Magazzino</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              {!file ? (
                <label 
                  htmlFor="csv-upload" 
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-lg font-medium">Trascina qui il file CSV o clicca per selezionarlo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supporta file CSV con formato: Prodotto, Quantità, Prezzo, etc.
                  </p>
                </label>
              ) : (
                <div className="flex flex-col items-center">
                  <File className="h-10 w-10 text-teal-500 mb-2" />
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setFile(null);
                      setPreview([]);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rimuovi
                  </Button>
                </div>
              )}
            </div>
            
            {preview.length > 0 && (
              <div className="border rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {preview[0].map((header, i) => (
                        <th 
                          key={i} 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td 
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-2 bg-gray-50 text-center text-sm text-gray-500">
                  Anteprima delle prime {preview.length - 1} righe
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/inventory")}
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>Importazione in corso...</>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Importa
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default ImportCSVPage;

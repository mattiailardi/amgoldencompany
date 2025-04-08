
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, ListFilter } from "lucide-react";

interface InventoryHeaderProps {
  title: string;
  onManageCategories: () => void;
  className?: string; // Added className as an optional prop
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  title,
  onManageCategories,
  className = "" // Default empty string for className
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="gap-2 border-gold-300"
          onClick={() => navigate("/inventory/import")}
        >
          <Upload className="h-4 w-4" />
          Importa CSV
        </Button>
        
        <Button 
          variant="outline" 
          className="gap-2 border-gold-300"
          onClick={onManageCategories}
        >
          <ListFilter className="h-4 w-4" />
          Gestisci Categorie
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;

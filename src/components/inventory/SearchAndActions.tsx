
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchAndActionsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
}

export const SearchAndActions: React.FC<SearchAndActionsProps> = ({
  searchQuery,
  onSearchChange,
  onAddProduct
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca ingredienti..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gold-300"
        />
      </div>
      <Button 
        onClick={onAddProduct}
        className="bg-primary hover:bg-primary/90"
      >
        Aggiungi Ingrediente
      </Button>
    </div>
  );
};

export default SearchAndActions;

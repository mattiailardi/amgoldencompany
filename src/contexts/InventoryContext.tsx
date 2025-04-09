
import React, { createContext, useState, useContext } from "react";
import { Product, ProductCategory, generateMockCategories, generateMockProducts } from "@/types";
import { toast } from "sonner";

interface InventoryContextType {
  products: Product[];
  categories: ProductCategory[];
  searchQuery: string;
  isAddingProduct: boolean;
  isEditingProduct: number | null;
  isAddingCategory: boolean;
  isManagingCategories: boolean;
  isAddingStock: boolean;
  selectedProductForStock: number | null;
  productToEdit: Product | undefined;
  categoriesWithCount: (ProductCategory & { productCount: number })[];
  setSearchQuery: (query: string) => void;
  setIsAddingProduct: (isAdding: boolean) => void;
  setIsEditingProduct: (productId: number | null) => void;
  setIsAddingCategory: (isAdding: boolean) => void;
  setIsManagingCategories: (isManaging: boolean) => void;
  setIsAddingStock: (isAdding: boolean) => void;
  setSelectedProductForStock: (productId: number | null) => void;
  handleAddProduct: (newProduct: Partial<Product>) => void;
  handleUpdateProduct: (updatedProduct: Partial<Product>) => void;
  handleDeleteProduct: (productId: number) => void;
  handleAddCategory: (newCategory: Partial<ProductCategory>) => void;
  handleDeleteCategory: (categoryId: number) => void;
  handleAddStock: (productId: number | null) => void;
  handleSaveAddedStock: (productId: number, quantity: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(generateMockProducts());
  const [categories, setCategories] = useState<ProductCategory[]>(generateMockCategories());
  const [searchQuery, setSearchQuery] = useState("");
  
  // UI control state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<number | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<number | null>(null);
  
  // Product being edited (if any)
  const productToEdit = isEditingProduct !== null 
    ? products.find(p => p.id === isEditingProduct) 
    : undefined;

  // Handler for adding a new product
  const handleAddProduct = (newProduct: Partial<Product>) => {
    const productToAdd: Product = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: newProduct.name || "",
      categoryId: newProduct.categoryId || 1,
      unit: newProduct.unit || "kg",
      unitPrice: newProduct.unitPrice || 0,
      tax: newProduct.tax || 10,
      currentQuantity: newProduct.currentQuantity || 0,
      thresholdQuantity: newProduct.thresholdQuantity,
      notes: newProduct.notes,
      categoryName: newProduct.categoryName || categories.find(c => c.id === newProduct.categoryId)?.name || ""
    };

    setProducts([...products, productToAdd]);
    setIsAddingProduct(false);
    toast.success(`Prodotto "${productToAdd.name}" aggiunto con successo`);
  };

  // Handler for updating an existing product
  const handleUpdateProduct = (updatedProduct: Partial<Product>) => {
    if (!isEditingProduct) return;
    
    setProducts(products.map(p => 
      p.id === isEditingProduct 
        ? { ...p, ...updatedProduct, categoryName: categories.find(c => c.id === updatedProduct.categoryId)?.name || p.categoryName } 
        : p
    ));
    
    setIsEditingProduct(null);
    toast.success(`Prodotto "${updatedProduct.name}" aggiornato con successo`);
  };

  // Handler for deleting a product
  const handleDeleteProduct = (productId: number) => {
    const productToDelete = products.find(p => p.id === productId);
    
    if (confirm(`Sei sicuro di voler eliminare "${productToDelete?.name}"?`)) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success(`Prodotto eliminato con successo`);
    }
  };

  // Handler for adding a new category
  const handleAddCategory = (newCategory: Partial<ProductCategory>) => {
    const categoryToAdd: ProductCategory = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: newCategory.name || ""
    };

    setCategories([...categories, categoryToAdd]);
    setIsAddingCategory(false);
    toast.success(`Categoria "${categoryToAdd.name}" aggiunta con successo`);
  };

  // Handler for deleting a category
  const handleDeleteCategory = (categoryId: number) => {
    const hasProducts = products.some(p => p.categoryId === categoryId);
    
    if (hasProducts) {
      toast.error("Impossibile eliminare una categoria che contiene prodotti");
      return;
    }
    
    const categoryToDelete = categories.find(c => c.id === categoryId);
    
    if (confirm(`Sei sicuro di voler eliminare la categoria "${categoryToDelete?.name}"?`)) {
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success(`Categoria eliminata con successo`);
    }
  };

  // Handler for adding stock to a product
  const handleAddStock = (productId: number | null = null) => {
    setSelectedProductForStock(productId);
    setIsAddingStock(true);
  };

  // Handler for saving added stock
  const handleSaveAddedStock = (productId: number, quantity: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, currentQuantity: p.currentQuantity + quantity } 
        : p
    ));
    
    const product = products.find(p => p.id === productId);
    
    setIsAddingStock(false);
    setSelectedProductForStock(null);
    toast.success(`Aggiunto ${quantity} ${product?.unit} di ${product?.name} al magazzino`);
  };

  // Prepare categories with count for display
  const categoriesWithCount = categories.map(category => {
    const count = products.filter(p => p.categoryId === category.id).length;
    return { ...category, productCount: count };
  });

  const value = {
    products,
    categories,
    searchQuery,
    isAddingProduct,
    isEditingProduct,
    isAddingCategory,
    isManagingCategories,
    isAddingStock,
    selectedProductForStock,
    productToEdit,
    categoriesWithCount,
    setSearchQuery,
    setIsAddingProduct,
    setIsEditingProduct,
    setIsAddingCategory,
    setIsManagingCategories,
    setIsAddingStock,
    setSelectedProductForStock,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddCategory,
    handleDeleteCategory,
    handleAddStock,
    handleSaveAddedStock
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

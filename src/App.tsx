
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";

import { Sidebar } from "@/components/sidebar";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import InventoryPage from "@/pages/InventoryPage";
import EditProductPage from "@/pages/EditProductPage";
import EditCategoryPage from "@/pages/EditCategoryPage";
import AddInventoryPage from "@/pages/AddInventoryPage";
import ImportCSVPage from "@/pages/ImportCSVPage";
import CustomersPage from "@/pages/CustomersPage";
import OrdersPage from "@/pages/OrdersPage";
import SalesPage from "@/pages/SalesPage";
import NewSalePage from "@/pages/NewSalePage";
import SalesHistoryPage from "@/pages/SalesHistoryPage";
import AccountingPage from "@/pages/AccountingPage";
import AccountingDailyPage from "@/pages/AccountingDailyPage";
import AccountingCategoriesPage from "@/pages/AccountingCategoriesPage";
import HACCPPage from "@/pages/HACCPPage";
import HACCPHygienePage from "@/pages/HACCPHygienePage";
import HACCPInventoryPage from "@/pages/HACCPInventoryPage";
import HACCPLabelsPage from "@/pages/HACCPLabelsPage";
import EmployeesPage from "@/pages/EmployeesPage";
import MenuPage from "@/pages/MenuPage";
import FoodCostPage from "@/pages/FoodCostPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Caricamento...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    
    <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
    <Route path="/inventory/product/new" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
    <Route path="/inventory/product/edit/:id" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
    <Route path="/inventory/category/new" element={<ProtectedRoute><EditCategoryPage /></ProtectedRoute>} />
    <Route path="/inventory/category/edit/:id" element={<ProtectedRoute><EditCategoryPage /></ProtectedRoute>} />
    <Route path="/inventory/add" element={<ProtectedRoute><AddInventoryPage /></ProtectedRoute>} />
    <Route path="/inventory/import" element={<ProtectedRoute><ImportCSVPage /></ProtectedRoute>} />
    <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
    <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
    <Route path="/sales/new" element={<ProtectedRoute><NewSalePage /></ProtectedRoute>} />
    <Route path="/sales/history" element={<ProtectedRoute><SalesHistoryPage /></ProtectedRoute>} />
    <Route path="/accounting" element={<ProtectedRoute><AccountingPage /></ProtectedRoute>} />
    <Route path="/accounting/daily" element={<ProtectedRoute><AccountingDailyPage /></ProtectedRoute>} />
    <Route path="/accounting/categories" element={<ProtectedRoute><AccountingCategoriesPage /></ProtectedRoute>} />
    <Route path="/haccp" element={<ProtectedRoute><HACCPPage /></ProtectedRoute>} />
    <Route path="/haccp/hygiene" element={<ProtectedRoute><HACCPHygienePage /></ProtectedRoute>} />
    <Route path="/haccp/inventory" element={<ProtectedRoute><HACCPInventoryPage /></ProtectedRoute>} />
    <Route path="/haccp/labels" element={<ProtectedRoute><HACCPLabelsPage /></ProtectedRoute>} />
    <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
    <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
    <Route path="/menu/food-cost" element={<ProtectedRoute><FoodCostPage /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

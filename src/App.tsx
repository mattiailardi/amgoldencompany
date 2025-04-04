
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Sidebar } from "@/components/sidebar";
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
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen w-full">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/product/new" element={<EditProductPage />} />
              <Route path="/inventory/product/edit/:id" element={<EditProductPage />} />
              <Route path="/inventory/category/new" element={<EditCategoryPage />} />
              <Route path="/inventory/category/edit/:id" element={<EditCategoryPage />} />
              <Route path="/inventory/add" element={<AddInventoryPage />} />
              <Route path="/inventory/import" element={<ImportCSVPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/sales/new" element={<NewSalePage />} />
              <Route path="/sales/history" element={<SalesHistoryPage />} />
              <Route path="/accounting" element={<AccountingPage />} />
              <Route path="/accounting/daily" element={<AccountingDailyPage />} />
              <Route path="/accounting/categories" element={<AccountingCategoriesPage />} />
              <Route path="/haccp" element={<HACCPPage />} />
              <Route path="/haccp/hygiene" element={<HACCPHygienePage />} />
              <Route path="/haccp/inventory" element={<HACCPInventoryPage />} />
              <Route path="/haccp/labels" element={<HACCPLabelsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

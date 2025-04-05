
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Calendar,
  ClipboardCheck,
  Database,
  Home,
  Menu,
  Pizza,
  Settings,
  ShoppingCart,
  Users,
  Utensils
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Magazzino",
      path: "/inventory",
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: "Clienti",
      path: "/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Ordini",
      path: "/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Menu",
      path: "/menu",
      icon: <Utensils className="h-5 w-5" />,
      subRoutes: [
        {
          name: "Food Cost",
          path: "/menu/food-cost",
        },
      ],
    },
    {
      name: "Vendite",
      path: "/sales",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: "Contabilità",
      path: "/accounting",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      name: "HACCP",
      path: "/haccp",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Personale",
      path: "/employees",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <Pizza className="h-6 w-6 text-teal-600" />
          {!collapsed && <span className="font-bold text-lg">Pizza Pro CRM</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {routes.map((route) => (
            <div key={route.path}>
              <Link
                to={route.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  (location.pathname === route.path || location.pathname.startsWith(route.path + "/"))
                    ? "bg-teal-50 text-teal-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-100",
                  collapsed && "justify-center px-2"
                )}
              >
                {route.icon}
                {!collapsed && <span>{route.name}</span>}
              </Link>
              
              {!collapsed && route.subRoutes && (
                <div className="ml-9 mt-1 space-y-1">
                  {route.subRoutes.map((subRoute) => (
                    <Link
                      key={subRoute.path}
                      to={subRoute.path}
                      className={cn(
                        "block text-sm py-1.5 px-3 rounded-md transition-colors",
                        location.pathname === subRoute.path
                          ? "text-teal-700 bg-teal-50 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {subRoute.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className={cn("flex items-center gap-3",
          collapsed ? "justify-center" : "px-3"
        )}>
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">A</div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-gray-500">admin@pizzapro.it</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  BarChart3, 
  Pizza, 
  Users, 
  ShoppingCart, 
  Calendar, 
  ClipboardCheck, 
  Settings
} from "lucide-react";

export function AppNavigationMenu() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <NavigationMenu className="max-w-none w-full justify-start px-4 py-2 border-b border-gold-300">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <Link to="/sales">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-white hover:text-gold group",
                isActive('/sales') && "bg-cmr/30 border-gold-400"
              )}
            >
              <BarChart3 className="h-4 w-4 mr-2 group-hover:text-gold" />
              Vendite
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              "text-white hover:text-gold group",
              isActive('/inventory') && "bg-cmr/30 border-gold-400"
            )}
          >
            <Pizza className="h-4 w-4 mr-2 group-hover:text-gold" />
            Inventario
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/inventory"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gold/20 hover:text-gold"
                  >
                    <div className="text-sm font-medium">Gestione Magazzino</div>
                    <p className="line-clamp-2 text-sm leading-snug text-white/70">
                      Gestisci tutti gli ingredienti del tuo inventario
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/inventory/add"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gold/20 hover:text-gold"
                  >
                    <div className="text-sm font-medium">Aggiungi Scorte</div>
                    <p className="line-clamp-2 text-sm leading-snug text-white/70">
                      Rifornisci gli ingredienti già presenti nel tuo inventario
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/inventory/import"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gold/20 hover:text-gold"
                  >
                    <div className="text-sm font-medium">Importa da CSV</div>
                    <p className="line-clamp-2 text-sm leading-snug text-white/70">
                      Importa il tuo inventario da un file CSV
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/customers">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-white hover:text-gold group",
                isActive('/customers') && "bg-cmr/30 border-gold-400"
              )}
            >
              <Users className="h-4 w-4 mr-2 group-hover:text-gold" />
              Clienti
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/orders">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-white hover:text-gold group",
                isActive('/orders') && "bg-cmr/30 border-gold-400"
              )}
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover:text-gold" />
              Ordini
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/accounting">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-white hover:text-gold group",
                isActive('/accounting') && "bg-cmr/30 border-gold-400"
              )}
            >
              <Calendar className="h-4 w-4 mr-2 group-hover:text-gold" />
              Contabilità
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/haccp">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-white hover:text-gold group",
                isActive('/haccp') && "bg-cmr/30 border-gold-400"
              )}
            >
              <ClipboardCheck className="h-4 w-4 mr-2 group-hover:text-gold" />
              HACCP
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/settings">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-white hover:text-gold group",
                isActive('/settings') && "bg-cmr/30 border-gold-400"
              )}
            >
              <Settings className="h-4 w-4 mr-2 group-hover:text-gold" />
              Impostazioni
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default AppNavigationMenu;


import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, AlertTriangle } from "lucide-react";

export function UserMenu() {
  const { user, signOut, isConfigured } = useAuth();
  
  if (!isConfigured) {
    return (
      <Button variant="destructive" className="flex items-center gap-2" disabled>
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">Configurazione Supabase incompleta</span>
      </Button>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="max-w-[150px] truncate text-sm">
            {user.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/settings" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Impostazioni</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className="flex cursor-pointer items-center text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

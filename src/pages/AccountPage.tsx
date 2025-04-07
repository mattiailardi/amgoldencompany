
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const AccountPage = () => {
  const { user, signOut } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profilo aggiornato con successo");
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password aggiornata con successo");
    setIsChangingPassword(false);
  };
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Il mio account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profilo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input 
                    id="name" 
                    defaultValue={user?.email?.split('@')[0] || 'Admin'} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || 'admin@pizzapro.it'} 
                    disabled 
                  />
                  <p className="text-sm text-muted-foreground">
                    L'email non può essere modificata
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="+39 123 456 7890"
                  />
                </div>
                
                <div className="pt-2">
                  <Button type="submit">Salva profilo</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sicurezza</CardTitle>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <div>
                  <p className="mb-4">Modifica la password per proteggere il tuo account</p>
                  <Button onClick={() => setIsChangingPassword(true)}>
                    Cambia password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Password attuale</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nuova password</Label>
                    <Input 
                      id="new-password" 
                      type="password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Conferma password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                      Annulla
                    </Button>
                    <Button type="submit">
                      Aggiorna password
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preferenze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Lingua</h3>
                <select className="w-full border border-input rounded-md h-10 px-3 py-2">
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Sessione</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Termina tutte le sessioni attive sul tuo account
                </p>
                <Button variant="outline" className="w-full">
                  Disconnetti tutti i dispositivi
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Account</h3>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

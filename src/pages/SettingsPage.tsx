
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Impostazioni</h1>
      
      <Tabs defaultValue="generale">
        <TabsList className="mb-6">
          <TabsTrigger value="generale">Generale</TabsTrigger>
          <TabsTrigger value="utente">Utente</TabsTrigger>
          <TabsTrigger value="notifiche">Notifiche</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generale">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Generali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Informazioni Ristorante</h3>
                <Separator />
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="restaurantName">Nome Ristorante</Label>
                    <Input id="restaurantName" defaultValue="Pizzeria Da Mario" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="address">Indirizzo</Label>
                    <Input id="address" defaultValue="Via Roma 123, Milano" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefono</Label>
                    <Input id="phone" defaultValue="+39 02 1234567" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="info@pizzeriamario.it" className="mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Orari di Apertura</h3>
                <Separator />
                <div className="space-y-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openingTime">Orario di Apertura</Label>
                    <Input id="openingTime" type="time" defaultValue="11:30" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="closingTime">Orario di Chiusura</Label>
                    <Input id="closingTime" type="time" defaultValue="23:00" className="mt-1" />
                  </div>
                </div>
              </div>
              
              <Button>Salva Impostazioni</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="utente">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Utente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profilo</h3>
                <Separator />
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="userName">Nome Utente</Label>
                    <Input id="userName" defaultValue="Admin" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input id="userEmail" defaultValue="admin@pizzapro.it" className="mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Sicurezza</h3>
                <Separator />
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="currentPassword">Password Attuale</Label>
                    <Input id="currentPassword" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nuova Password</Label>
                    <Input id="newPassword" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Conferma Password</Label>
                    <Input id="confirmPassword" type="password" className="mt-1" />
                  </div>
                </div>
              </div>
              
              <Button>Aggiorna Profilo</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifiche">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Notifiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifiche Email</h3>
                    <p className="text-sm text-muted-foreground">Ricevi aggiornamenti via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifiche Sistema</h3>
                    <p className="text-sm text-muted-foreground">Visualizza notifiche nell'applicazione</p>
                  </div>
                  <Switch id="system-notifications" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Avvisi Scorte Basse</h3>
                    <p className="text-sm text-muted-foreground">Ricevi avvisi quando le scorte sono basse</p>
                  </div>
                  <Switch id="low-stock-alerts" defaultChecked />
                </div>
              </div>
              
              <Button>Salva Preferenze</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sistema">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Backup Dati</h3>
                <Separator />
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Backup Automatico</h4>
                      <p className="text-sm text-muted-foreground">Esegui backup automatici giornalieri</p>
                    </div>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  <Button variant="outline">Esegui Backup Manuale</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Lingua e Valuta</h3>
                <Separator />
                <div className="space-y-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Lingua</Label>
                    <select id="language" className="w-full border border-input rounded-md h-10 px-3 py-2 mt-1">
                      <option value="it">Italiano</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Valuta</Label>
                    <select id="currency" className="w-full border border-input rounded-md h-10 px-3 py-2 mt-1">
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Button>Applica Impostazioni</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash } from "lucide-react";

type Role = {
  id: number;
  name: string;
  department: string;
  responsibilities: string;
};

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Cuoco",
      department: "Cucina",
      responsibilities: "Preparazione piatti caldi, Menu planning, Gestione ordini cucina"
    },
    {
      id: 2,
      name: "Cameriere",
      department: "Sala",
      responsibilities: "Servizio ai tavoli, Accoglienza clienti, Pulizia sala"
    },
    {
      id: 3,
      name: "Pizzaiolo",
      department: "Cucina",
      responsibilities: "Preparazione pizze, Gestione forno, Controllo impasti"
    },
    {
      id: 4,
      name: "Aiuto Cuoco",
      department: "Cucina",
      responsibilities: "Preparazione ingredienti, Pulizia cucina, Assistenza cuoco"
    },
    {
      id: 5,
      name: "Cassiere",
      department: "Sala",
      responsibilities: "Gestione cassa, Emissione scontrini, Chiusura serale"
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    responsibilities: "",
  });

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setCurrentRole(role);
      setFormData({
        name: role.name,
        department: role.department,
        responsibilities: role.responsibilities,
      });
    } else {
      setCurrentRole(null);
      setFormData({
        name: "",
        department: "",
        responsibilities: "",
      });
    }
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (currentRole) {
      // Edit existing role
      setRoles(
        roles.map((role) =>
          role.id === currentRole.id
            ? { ...role, ...formData }
            : role
        )
      );
    } else {
      // Add new role
      const newRole = {
        id: roles.length ? Math.max(...roles.map(role => role.id)) + 1 : 1,
        ...formData
      };
      setRoles([...roles, newRole]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: number) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Gestione Ruoli</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Ruolo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ruoli e Responsabilità</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ruolo</TableHead>
                <TableHead>Dipartimento</TableHead>
                <TableHead>Responsabilità</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.department}</TableCell>
                  <TableCell className="max-w-xs truncate">{role.responsibilities}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenDialog(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(role.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentRole ? "Modifica Ruolo" : "Crea Nuovo Ruolo"}
            </DialogTitle>
            <DialogDescription>
              Inserisci i dettagli per {currentRole ? "aggiornare" : "creare"} un ruolo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Ruolo</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Dipartimento</Label>
              <Input 
                id="department" 
                name="department" 
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responsibilities">Responsabilità</Label>
              <Textarea 
                id="responsibilities" 
                name="responsibilities" 
                rows={3}
                value={formData.responsibilities}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Annulla</Button>
            <Button onClick={handleSubmit}>{currentRole ? "Aggiorna" : "Crea"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;

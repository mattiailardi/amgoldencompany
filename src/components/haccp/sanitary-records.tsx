
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle, Plus } from "lucide-react";

type Employee = {
  id: number;
  name: string;
  role: string;
  documentType: string;
  expiryDate: Date;
  documentNumber: string;
};

const SanitaryRecords = () => {
  const employees: Employee[] = [
    { id: 1, name: "Marco Rossi", role: "Cuoco", documentType: "Libretto Sanitario", expiryDate: new Date("2025-06-15"), documentNumber: "LS12345" },
    { id: 2, name: "Giulia Bianchi", role: "Cameriere", documentType: "Attestato HACCP", expiryDate: new Date("2025-04-20"), documentNumber: "AH67890" },
    { id: 3, name: "Luca Verdi", role: "Aiuto Cuoco", documentType: "Libretto Sanitario", expiryDate: new Date("2025-03-10"), documentNumber: "LS98765" },
    { id: 4, name: "Anna Neri", role: "Pizzaiolo", documentType: "Attestato HACCP", expiryDate: new Date("2026-01-30"), documentNumber: "AH54321" },
    { id: 5, name: "Roberto Gialli", role: "Cameriere", documentType: "Libretto Sanitario", expiryDate: new Date("2025-02-28"), documentNumber: "LS13579" },
  ];

  const isExpiringSoon = (date: Date): boolean => {
    const today = new Date();
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000; // roughly 3 months in milliseconds
    return date.getTime() - today.getTime() < threeMonths;
  };

  const isExpired = (date: Date): boolean => {
    return new Date() > date;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Documentazione Sanitaria Personale</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Dipendente
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Dipendente</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Numero</TableHead>
              <TableHead>Scadenza</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.documentType}</TableCell>
                <TableCell>{employee.documentNumber}</TableCell>
                <TableCell>
                  {employee.expiryDate.toLocaleDateString('it-IT')}
                </TableCell>
                <TableCell>
                  {isExpired(employee.expiryDate) ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Scaduto
                    </Badge>
                  ) : isExpiringSoon(employee.expiryDate) ? (
                    <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-600">
                      <AlertCircle className="h-3 w-3" />
                      In Scadenza
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Valido
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">Visualizza documento</span>
                    </Button>
                    <Button size="sm" className="h-8">
                      Aggiorna
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SanitaryRecords;


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, Clock } from "lucide-react";

type Employee = {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
};

type Shift = {
  id: number;
  employeeId: number;
  date: Date;
  startTime: string;
  endTime: string;
  role: string;
};

const employees: Employee[] = [
  { id: 1, name: "Marco Rossi", role: "Cuoco", photoUrl: "/placeholder.svg" },
  { id: 2, name: "Giulia Bianchi", role: "Cameriere", photoUrl: "/placeholder.svg" },
  { id: 3, name: "Luca Verdi", role: "Aiuto Cuoco", photoUrl: "/placeholder.svg" },
  { id: 4, name: "Anna Neri", role: "Pizzaiolo", photoUrl: "/placeholder.svg" },
  { id: 5, name: "Roberto Gialli", role: "Cameriere", photoUrl: "/placeholder.svg" },
];

const initialShifts: Shift[] = [
  { id: 1, employeeId: 1, date: new Date(), startTime: "10:00", endTime: "18:00", role: "Cuoco" },
  { id: 2, employeeId: 2, date: new Date(), startTime: "16:00", endTime: "23:00", role: "Cameriere" },
  { id: 3, employeeId: 4, date: new Date(), startTime: "16:00", endTime: "23:00", role: "Pizzaiolo" },
];

const ScheduleManagement = () => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    startTime: "",
    endTime: "",
  });

  const handleAddShift = () => {
    if (formData.employeeId && formData.startTime && formData.endTime) {
      const employee = employees.find(e => e.id === Number(formData.employeeId));
      const newShift: Shift = {
        id: shifts.length ? Math.max(...shifts.map(s => s.id)) + 1 : 1,
        employeeId: Number(formData.employeeId),
        date: selectedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        role: employee?.role || ""
      };
      
      setShifts([...shifts, newShift]);
      setIsDialogOpen(false);
      setFormData({
        employeeId: "",
        startTime: "",
        endTime: "",
      });
    }
  };

  const handleDeleteShift = (shiftId: number) => {
    setShifts(shifts.filter(shift => shift.id !== shiftId));
  };

  const filteredShifts = shifts.filter(shift => 
    shift.date.toDateString() === selectedDate.toDateString()
  );

  const getEmployeeById = (id: number) => {
    return employees.find(e => e.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendario Turni</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Turni del {selectedDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Aggiungi Turno
            </Button>
          </CardHeader>
          <CardContent>
            {filteredShifts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dipendente</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Orario</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShifts.map((shift) => {
                    const employee = getEmployeeById(shift.employeeId);
                    return (
                      <TableRow key={shift.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee?.photoUrl} />
                              <AvatarFallback>{employee?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{employee?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{shift.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{shift.startTime} - {shift.endTime}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteShift(shift.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Rimuovi
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Nessun turno programmato per questa giornata
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Aggiungi il primo turno
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Turno</DialogTitle>
            <DialogDescription>
              Programma un turno per il {selectedDate.toLocaleDateString('it-IT')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Dipendente</Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, employeeId: value})}
                value={formData.employeeId}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Seleziona un dipendente" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name} ({employee.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Inizio Turno</Label>
                <Select 
                  onValueChange={(value) => setFormData({...formData, startTime: value})}
                  value={formData.startTime}
                >
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Ora inizio" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}).map((_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Fine Turno</Label>
                <Select 
                  onValueChange={(value) => setFormData({...formData, endTime: value})}
                  value={formData.endTime}
                >
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="Ora fine" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}).map((_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annulla</Button>
            <Button onClick={handleAddShift}>Salva Turno</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManagement;

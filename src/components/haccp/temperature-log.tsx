
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Thermometer, PlusCircle } from "lucide-react";

type TemperatureRecord = {
  id: number;
  location: string;
  temperature: number;
  timestamp: Date;
  inRange: boolean;
  minTemp: number;
  maxTemp: number;
};

const TemperatureLog = () => {
  const [records, setRecords] = useState<TemperatureRecord[]>([
    { id: 1, location: "Frigo Principale", temperature: 3.2, timestamp: new Date(Date.now() - 3600000), inRange: true, minTemp: 1, maxTemp: 4 },
    { id: 2, location: "Frigo Verdure", temperature: 4.5, timestamp: new Date(Date.now() - 7200000), inRange: false, minTemp: 1, maxTemp: 4 },
    { id: 3, location: "Freezer", temperature: -18.1, timestamp: new Date(Date.now() - 10800000), inRange: true, minTemp: -22, maxTemp: -18 },
    { id: 4, location: "Frigo Bevande", temperature: 5.0, timestamp: new Date(Date.now() - 14400000), inRange: true, minTemp: 3, maxTemp: 6 },
  ]);

  const [newRecord, setNewRecord] = useState({
    location: "Frigo Principale",
    temperature: "",
  });

  const locations = [
    { name: "Frigo Principale", minTemp: 1, maxTemp: 4 },
    { name: "Frigo Verdure", minTemp: 1, maxTemp: 4 },
    { name: "Freezer", minTemp: -22, maxTemp: -18 },
    { name: "Frigo Bevande", minTemp: 3, maxTemp: 6 },
  ];

  const handleAddRecord = () => {
    if (!newRecord.location || !newRecord.temperature) {
      toast.error("Inserisci tutti i dati richiesti");
      return;
    }

    const temperature = parseFloat(newRecord.temperature);
    if (isNaN(temperature)) {
      toast.error("La temperatura deve essere un numero");
      return;
    }

    const locationInfo = locations.find(l => l.name === newRecord.location);
    if (!locationInfo) return;

    const inRange = temperature >= locationInfo.minTemp && temperature <= locationInfo.maxTemp;
    
    const record: TemperatureRecord = {
      id: records.length + 1,
      location: newRecord.location,
      temperature,
      timestamp: new Date(),
      inRange,
      minTemp: locationInfo.minTemp,
      maxTemp: locationInfo.maxTemp
    };

    setRecords([record, ...records]);
    setNewRecord({ location: "Frigo Principale", temperature: "" });
    
    if (!inRange) {
      toast.warning(`Temperatura fuori range per ${newRecord.location}! Intervallo corretto: ${locationInfo.minTemp}°C - ${locationInfo.maxTemp}°C`);
    } else {
      toast.success("Temperatura registrata correttamente");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Nuova Registrazione</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Posizione</Label>
            <select 
              id="location"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={newRecord.location}
              onChange={e => setNewRecord({...newRecord, location: e.target.value})}
            >
              {locations.map(loc => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperatura (°C)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={newRecord.temperature}
              onChange={e => setNewRecord({...newRecord, temperature: e.target.value})}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleAddRecord}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registra Temperatura
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Storico Temperature</h3>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Ora</TableHead>
                <TableHead>Posizione</TableHead>
                <TableHead>Temperatura</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {record.timestamp.toLocaleString('it-IT')}
                  </TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>{record.temperature}°C</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      record.inRange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <Thermometer className="mr-1 h-3 w-3" />
                      {record.inRange ? 'Conforme' : 'Non Conforme'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TemperatureLog;


import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ChecklistItem = {
  id: number;
  task: string;
  frequency: string;
  completed: boolean;
};

const HygieneChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 1, task: "Pulizia pavimenti sala", frequency: "Giornaliera", completed: false },
    { id: 2, task: "Pulizia e sanificazione cucina", frequency: "Giornaliera", completed: false },
    { id: 3, task: "Pulizia frigoriferi", frequency: "Settimanale", completed: false },
    { id: 4, task: "Pulizia filtri cappe", frequency: "Settimanale", completed: false },
    { id: 5, task: "Sanificazione bagni", frequency: "Giornaliera", completed: false },
    { id: 6, task: "Pulizia zona rifiuti", frequency: "Giornaliera", completed: false },
    { id: 7, task: "Pulizia attrezzature da preparazione", frequency: "Giornaliera", completed: false },
    { id: 8, task: "Controllo prodotti pulizia", frequency: "Settimanale", completed: false },
    { id: 9, task: "Pulizia forno", frequency: "Bisettimanale", completed: false },
  ]);

  const toggleCompletion = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const saveChecklist = () => {
    // Here you would typically save this to your backend
    toast.success("Checklist salvata correttamente");
  };

  const resetChecklist = () => {
    setItems(items.map(item => ({ ...item, completed: false })));
    toast.info("Checklist resettata");
  };

  const dailyItems = items.filter(item => item.frequency === "Giornaliera");
  const weeklyItems = items.filter(item => item.frequency === "Settimanale" || item.frequency === "Bisettimanale");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Attività Giornaliere</h3>
        <div className="space-y-3">
          {dailyItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <Checkbox 
                id={`task-${item.id}`} 
                checked={item.completed}
                onCheckedChange={() => toggleCompletion(item.id)}
              />
              <Label htmlFor={`task-${item.id}`} className="flex-1 cursor-pointer">
                {item.task}
              </Label>
              <span className="text-sm text-gray-500">{item.frequency}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Attività Settimanali</h3>
        <div className="space-y-3">
          {weeklyItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <Checkbox 
                id={`task-${item.id}`} 
                checked={item.completed}
                onCheckedChange={() => toggleCompletion(item.id)}
              />
              <Label htmlFor={`task-${item.id}`} className="flex-1 cursor-pointer">
                {item.task}
              </Label>
              <span className="text-sm text-gray-500">{item.frequency}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={resetChecklist}>
          Reset
        </Button>
        <Button onClick={saveChecklist}>
          Salva Controlli
        </Button>
      </div>
    </div>
  );
};

export default HygieneChecklist;

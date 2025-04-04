
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import HACCPDashboard from "@/components/haccp/haccp-dashboard";

const HACCPPage = () => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    navigate(`/haccp/${value}`);
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">HACCP Management</h1>
      
      <Tabs defaultValue="hygiene" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="hygiene">Controlli Igienici</TabsTrigger>
          <TabsTrigger value="inventory">Scadenze Prodotti</TabsTrigger>
          <TabsTrigger value="labels">Stampa Etichette</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hygiene">
          <HACCPDashboard />
        </TabsContent>
        <TabsContent value="inventory">
          <p>Seleziona "Scadenze Prodotti" dal menu per gestire le scadenze</p>
        </TabsContent>
        <TabsContent value="labels">
          <p>Seleziona "Stampa Etichette" dal menu per gestire le etichette</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HACCPPage;

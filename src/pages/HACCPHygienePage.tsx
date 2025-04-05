
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import HygieneChecklist from "@/components/haccp/hygiene-checklist";
import TemperatureLog from "@/components/haccp/temperature-log";
import SanitaryRecords from "@/components/haccp/sanitary-records";

const HACCPHygienePage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Controlli Igienici HACCP</h1>
      
      <Tabs defaultValue="checklist">
        <TabsList className="mb-6">
          <TabsTrigger value="checklist">Checklist Pulizie</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="sanitary">Libretti Sanitari</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Piano Pulizie Settimanali</CardTitle>
            </CardHeader>
            <CardContent>
              <HygieneChecklist />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle>Registro Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureLog />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sanitary">
          <Card>
            <CardHeader>
              <CardTitle>Libretti Sanitari Dipendenti</CardTitle>
            </CardHeader>
            <CardContent>
              <SanitaryRecords />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HACCPHygienePage;


import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamOverview from "@/components/employees/team-overview";
import RoleManagement from "@/components/employees/role-management";
import ScheduleManagement from "@/components/employees/schedule-management";

const EmployeesPage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Gestione Personale</h1>
      
      <Tabs defaultValue="team">
        <TabsList className="mb-6">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="roles">Ruoli</TabsTrigger>
          <TabsTrigger value="schedule">Turni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team">
          <TeamOverview />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
        
        <TabsContent value="schedule">
          <ScheduleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesPage;

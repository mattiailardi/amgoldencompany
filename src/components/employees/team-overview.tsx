
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  photoUrl: string;
  responsibilities: string[];
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Marco Rossi",
    role: "Cuoco",
    department: "Cucina",
    photoUrl: "/placeholder.svg",
    responsibilities: ["Preparazione piatti caldi", "Gestione cucina"]
  },
  {
    id: 2,
    name: "Giulia Bianchi",
    role: "Cameriere",
    department: "Sala",
    photoUrl: "/placeholder.svg",
    responsibilities: ["Servizio ai tavoli", "Accoglienza clienti"]
  },
  {
    id: 3,
    name: "Luca Verdi",
    role: "Aiuto Cuoco",
    department: "Cucina",
    photoUrl: "/placeholder.svg",
    responsibilities: ["Preparazione ingredienti", "Pulizia cucina"]
  },
  {
    id: 4,
    name: "Anna Neri",
    role: "Pizzaiolo",
    department: "Cucina",
    photoUrl: "/placeholder.svg",
    responsibilities: ["Preparazione pizze", "Gestione forno"]
  },
  {
    id: 5,
    name: "Roberto Gialli",
    role: "Cameriere",
    department: "Sala",
    photoUrl: "/placeholder.svg",
    responsibilities: ["Servizio ai tavoli", "Gestione cassa"]
  },
];

const TeamOverview = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Il Mio Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={member.photoUrl} alt={member.name} className="object-cover" />
                    <AvatarFallback className="text-2xl h-full w-full rounded-none">{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <Badge variant="outline">{member.role}</Badge>
                    <Badge variant="secondary">{member.department}</Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Responsabilità:</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {member.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamOverview;

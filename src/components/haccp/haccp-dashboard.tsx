
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClipboardCheck, Thermometer, Users, Calendar, AlertTriangle, Frown, Smile } from "lucide-react";

const HACCPDashboard = () => {
  const currentDate = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">HACCP Dashboard</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Oggi è</p>
          <p className="font-medium">{currentDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2 text-green-600" />
              Pulizie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Stato pulizie oggi</p>
                <p className="text-xl font-bold text-green-600">Completato</p>
              </div>
              <Smile className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/haccp/hygiene">Registro Pulizie</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-yellow-600" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Ultima verifica</p>
                <p className="text-xl font-bold text-yellow-600">2 ore fa</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/haccp/hygiene?tab=temperature">Registro Temperature</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Scadenze
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Prodotti in scadenza</p>
                <p className="text-xl font-bold text-red-600">3</p>
              </div>
              <Frown className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/haccp/inventory">Verifica Scadenze</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attività pianificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded mr-4">
                    <Thermometer className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Controllo temperature frigoriferi</h3>
                    <p className="text-sm text-gray-500">Ogni 4 ore</p>
                  </div>
                </div>
                <Button size="sm">Registra</Button>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded mr-4">
                    <ClipboardCheck className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Pulizia zona preparazione</h3>
                    <p className="text-sm text-gray-500">Fine turno</p>
                  </div>
                </div>
                <Button size="sm">Registra</Button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded mr-4">
                    <Users className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Aggiornamento formazione HACCP</h3>
                    <p className="text-sm text-gray-500">Scadenza tra 14 giorni</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Dettagli</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HACCPDashboard;

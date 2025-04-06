
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/");
      } else {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Caricamento...</h1>
          <p className="text-gray-500">Inizializzazione dell'applicazione</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Gestionale Ristorante</h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema completo per la gestione dell'inventario, vendite, ordini e contabilità
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" onClick={() => navigate("/login")}>
              Accedi
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
              Registrati
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
              <CardDescription>Gestisci prodotti e categorie</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Monitora gli stock, imposta soglie di allarme, e tieni traccia di tutti i prodotti.
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/login")}>
                Scopri di più
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vendite</CardTitle>
              <CardDescription>Gestisci le vendite e gli ordini</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Registra vendite, gestisci ordini e monitora lo storico delle vendite con statistiche dettagliate.
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/login")}>
                Scopri di più
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contabilità</CardTitle>
              <CardDescription>Traccia entrate e uscite</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gestisci la contabilità giornaliera, monitora profitti e perdite, e genera report dettagliati.
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/login")}>
                Scopri di più
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

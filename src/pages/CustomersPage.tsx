
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { Download, MapPin, Plus, Search, Upload, User, ChevronRight } from "lucide-react";
import { Customer, CustomerType, generateMockCustomers } from "@/types";

export function CustomersPage() {
  const [customers] = useState<Customer[]>(generateMockCustomers());
  const [searchQuery, setSearchQuery] = useState("");

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerTypeInfo = (type: CustomerType) => {
    switch (type) {
      case CustomerType.VIP:
        return { label: "VIP", class: "bg-yellow-100 text-yellow-800 border-yellow-200" };
      case CustomerType.Business:
        return { label: "Business", class: "bg-blue-100 text-blue-800 border-blue-200" };
      case CustomerType.Regular:
      default:
        return { label: "Regular", class: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clienti</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importa
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Esporta
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuovo Cliente
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca clienti per nome, indirizzo o telefono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutti i Clienti</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredCustomers}
            columns={[
              {
                header: "Cliente",
                accessorKey: "firstName",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                      {row.firstName[0]}{row.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium">{row.firstName} {row.lastName}</div>
                      <div className="text-xs text-gray-500">{row.phone}</div>
                    </div>
                  </div>
                )
              },
              {
                header: "Indirizzo",
                accessorKey: "address",
                cell: (row) => (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div>{row.address}, {row.houseNumber}</div>
                      <div className="text-xs text-gray-500">{row.zipCode}</div>
                    </div>
                  </div>
                )
              },
              {
                header: "Tipo",
                accessorKey: "customerType",
                cell: (row) => {
                  const typeInfo = getCustomerTypeInfo(row.customerType);
                  return (
                    <Badge className={typeInfo.class}>
                      {typeInfo.label}
                    </Badge>
                  );
                }
              },
              {
                header: "Note",
                accessorKey: "notes",
                cell: (row) => (
                  <div className="max-w-[200px] truncate">
                    {row.notes || "-"}
                  </div>
                )
              },
              {
                header: "Azioni",
                accessorKey: "id",
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <Link to={`/customers/${row.id}`}>
                      <Button variant="ghost" size="sm">
                        Dettagli
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      Modifica
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Elimina
                    </Button>
                  </div>
                )
              },
            ]}
            searchKey="firstName"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistiche Clienti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Totale Clienti</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Clienti VIP</p>
                  <p className="text-2xl font-bold">{customers.filter(c => c.customerType === CustomerType.VIP).length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Clienti Business</p>
                  <p className="text-2xl font-bold">{customers.filter(c => c.customerType === CustomerType.Business).length}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Distribuzione dei Clienti</h3>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    {(() => {
                      const vipCount = customers.filter(c => c.customerType === CustomerType.VIP).length;
                      const businessCount = customers.filter(c => c.customerType === CustomerType.Business).length;
                      const regularCount = customers.filter(c => c.customerType === CustomerType.Regular).length;
                      const total = customers.length;

                      return (
                        <>
                          <div className="bg-yellow-400" style={{ width: `${(vipCount / total) * 100}%` }}></div>
                          <div className="bg-blue-400" style={{ width: `${(businessCount / total) * 100}%` }}></div>
                          <div className="bg-gray-400" style={{ width: `${(regularCount / total) * 100}%` }}></div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>VIP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Business</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Regular</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mappa Clienti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Mappa interattiva dei clienti</p>
                <p className="text-xs text-gray-400 mt-1">Integrazione con servizi di mappe da implementare</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CustomersPage;

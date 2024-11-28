"use client";

import React, { useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import { Dialog, DialogContent,
  DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Liste des clients pour l'exemple
  const clients = [
    { id: 1, name: "Client A", type: "Particulier", address: " Dakar", contact: "responsable@senelec.sn" },
    { id: 2, name: "Client B", type: "professionnel", address: "Dakar", contact: "responsable@senelec.sn" },
    { id: 3, name: "Client C", type: "Particulier", address: "Dakar", contact: "responsable@senelec.sn" },
    { id: 4, name: "Client D", type: "professionnel", address: "Dakar", contact: "responsable@senelec.sn" },
  ];

  // Filtrage des clients basé sur la recherche
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6">Gestion des Clients</h1>

      {/* Disposition avec Flex */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        
          <h2 className="text-xl font-medium mb-4">Clients</h2>

        {/* Barre de recherche au centre */}
        <div className="lg:col-span-1 flex items-center justify-center  p-4 rounded-md shadow-md">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher un client"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
        </div>

        {/* Ajouter un client à droite */}
        <div className="lg:col-span-1 flex justify-center items-center p-4 rounded-md shadow-md">
        <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all">
                Ajouter un client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un client</DialogTitle>
                <DialogDescription>
                Vous pouvez ajouter un client
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom du client
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Senelec"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    defaultValue="responsable@senelec.sn"
                    className="col-span-3"
                    placeholder="adresse email ou numéro téléphone"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Adresse
                  </Label>
                  <Input
                    id="adresse"
                    defaultValue="Yoff rue 10"
                    className="col-span-3"
                    placeholder="nom et numéro de la rue"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all">
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-medium mb-4">Liste des Clients</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Nom</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">Adresse</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b">
                  <td className="py-2 px-4">{client.name}</td>
                  <td className="py-2 px-4">{client.type}</td>
                  <td className="py-2 px-4">{client.address}</td>
                  <td className="py-2 px-4">{client.contact}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  Aucun client trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;

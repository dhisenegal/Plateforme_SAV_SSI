"use client";

import React, { useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import Link from "next/link";

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Liste des clients pour l'exemple
  const clients = [
    { id: 1, name: "Client A", type: "Particulier", address: " Dakar" },
    { id: 2, name: "Client B", type: "professionnel", address: "Dakar" },
    { id: 3, name: "Client C", type: "Particulier", address: "Dakar" },
    { id: 4, name: "Client D", type: "professionnel", address: "Dakar" },
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
          <Link href="/admin/client/ajouter">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700">
              <FaUserPlus size={20} />
              <span>Ajouter Client</span>
            </button>
          </Link>
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

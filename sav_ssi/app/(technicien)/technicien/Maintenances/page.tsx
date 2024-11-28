"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";

const MaintenanceList = () => {
  const [maintenances, setMaintenances] = useState([]);

  useEffect(() => {
    // Exemple de données statiques pour les maintenances
    const data = [
      {
        id: 1,
        date: "2024-12-14",
        client: "Sonatel",
        type: "Maintenance préventive",
        etat: "Programmé",
        systemeSecurite: "MOYENS DE SECOURS",
      },
      {
        id: 2,
        date: "2024-12-05",
        client: "DER",
        type: "Maintenance préventive",
        etat: "Programmé",
        systemeSecurite: "SYSTÈME DE DETECTION INCENDIE CONVENTIONNEL",
      },
      {
        id: 3,
        date: "2024-12-01",
        client: "Poste Sénégal",
        type: "Maintenance préventive",
        etat: "Programmé",
        systemeSecurite: "CENTRALISATEUR DE MISE EN SECURITE INCENDIE",
      },
      {
        id: 4,
        date: "2024-11-21",
        client: "Wari",
        type: "Maintenance préventive",
        etat: "Terminé",
        systemeSecurite: "INTERPHONE DE SECURITE",
      },
      {
        id: 5,
        date: "2024-11-21",
        client: "Sonatel",
        type: "Maintenance préventive",
        etat: "Terminé",
        systemeSecurite: "SYSTÈME D'EXTINCTION AUTOMATIQUE A GAZ",
      },
      {
        id: 6,
        date: "2024-11-18",
        client: "EDK",
        type: "Maintenance préventive",
        etat: "Terminé",
        systemeSecurite: "SYSTÈME DE DETECTION INCENDIE CONVENTIONNEL",
      },
    ];

    setMaintenances(data);
  }, []);

  return (
    <>
      <Head>
        <title>Liste des Maintenances</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white py-8 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold">Liste des Maintenances</h1>
            <p className="text-lg mt-2">
              Consultez les détails des maintenances
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">État</th>
                  <th className="px-4 py-2 text-left">
                    Système de Sécurité Concerné
                  </th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenances.map((maintenance) => (
                  <tr
                    key={maintenance.id}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 text-black">{maintenance.date}</td>
                    <td className="px-4 py-2 text-black">{maintenance.client}</td>
                    <td className="px-4 py-2 text-black">{maintenance.type}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          maintenance.etat === "Programmé"
                            ? "bg-yellow-100 text-yellow-800"
                            : maintenance.etat === "En cours"
                            ? "bg-yellow-300 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {maintenance.etat}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-black">{maintenance.systemeSecurite}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          // Simulation de la redirection vers les détails
                          alert(
                            `Voir les détails de la maintenance ${maintenance.id}`
                          );
                        }}
                      >
                        Voir Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>© 2024 Système de Maintenance - Tous droits réservés</p>
        </footer>
      </div>
    </>
  );
};

export default MaintenanceList;

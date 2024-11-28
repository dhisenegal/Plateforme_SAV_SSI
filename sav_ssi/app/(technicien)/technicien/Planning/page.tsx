"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const Planning = () => {
  const [interventions, setInterventions] = useState([]);

  useEffect(() => {
    const fetchInterventions = async () => {
      const data = [
        {
          id: 1,
          date: "2024-12-16",
          client: "AIR FRANCE",
          description: "Réparation d'un réseau",
          etat: "Programmé",
          type: "Intervention",
        },
        {
          id: 2,
          date: "2024-12-14",
          client: "Sonatel",
          description: "Maintenance d'Extincteur",
          etat: "Programmé",
          type: "Maintenance",
        },
        {
          id: 3,
          date: "2024-12-05",
          client: "DER",
          description: "Maintenance d'Extincteur",
          etat: "Programmé",
          type: "Maintenance",
        },
        {
          id: 5,
          date: "2024-12-01",
          client: "Poste Sénégal",
          description: "Maintenance d'Extincteur",
          etat: "Programmé",
          type: "Maintenance",
        },
        {
          id: 4,
          date: "2024-11-22",
          client: "SENELEC",
          description: "Intervention serveur",
          etat: "En cours",
          type: "Intervention",
        },
      ];
      setInterventions(data);
    };

    fetchInterventions();
  }, []);

  return (
    <>
      <Head>
        <title>Planning - Technicien</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white py-8 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold">Planning</h1>
            <p className="text-lg mt-2">Consultez votre planning</p>
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
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">État</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interventions.map((intervention) => (
                  <tr
                    key={intervention.id}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 text-black">{intervention.date}</td>
                    <td className="px-4 py-2 text-black">{intervention.client}</td>
                    <td className="px-4 py-2 text-black">{intervention.description}</td>
                    <td className="px-4 py-2 text-black">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          intervention.type === "Maintenance"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {intervention.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-black">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          intervention.etat === "Programmé"
                            ? "bg-yellow-100 text-yellow-800"
                            : intervention.etat === "En cours"
                            ? "bg-yellow-300 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {intervention.etat}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link href={"technicien/Maintenances"}>
                        <button className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors">
                          Voir Détails
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>© 2024 Système d'intervention - Tous droits réservés</p>
        </footer>
      </div>
    </>
  );
};

export default Planning;

"use client"; // Ajoute cette ligne pour indiquer que c'est un composant côté client

import { useState, useEffect } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Vérifie qu'on est en environnement client et non serveur
    setIsClient(true);
  }, []);

  return (
    <div className="h-[75vh] bg-gradient-to-r from-blue-50 to-green-50 flex flex-col">
      {/* En-tête */}
      <header className="flex-grow-0 flex-shrink-0 p-4 text-center bg-white shadow-md">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          RAPPORTS TECHNIQUES
        </h1>
        <p className="text-base text-gray-600 mt-1">Sélectionnez une option</p>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center">
        {isClient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl p-3">
            {/* Carte 1 : Intervention */}
            <a
              href="./Rapport/FicheIntervention"
              className="group flex flex-col items-center justify-center bg-white shadow-md rounded-md p-5 hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="bg-blue-500 text-white p-3 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11c0-4.418-3.582-8-8-8S3 6.582 3 11c0 2.635 1.613 5.648 2.873 8.19.686 1.368 2.208 2.534 3.82 2.534h4.614c1.612 0 3.134-1.166 3.82-2.534C17.387 16.648 19 13.635 19 11z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m3-3h.01"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                Fiche d'intervention
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Saisissez les détails pour une intervention.
              </p>
            </a>

            {/* Carte 2 : Maintenance */}
            <a
              href="./Rapport/FicheMaintenance"
              className="group flex flex-col items-center justify-center bg-white shadow-md rounded-md p-5 hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="bg-green-500 text-white p-3 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V12m-6 5v.01M3 12v2.158a2.032 2.032 0 01-.595 1.437L1 17h5l1.405-1.405A2.032 2.032 0 007 14.158V12m-4 0h16m-4 0V9.842a2.032 2.032 0 00-.595-1.437L15 7H9l-1.405 1.405A2.032 2.032 0 007 9.842V12m4-4v-.01"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                Fiche de maintenance
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Renseignez les informations pour une maintenance.
              </p>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useParams, useSearchParams, useRouter } from "next/navigation";

// Données fictives pour maintenance et intervention
const maintenances = [ 
  {
    id: "1",
    client: "AIR FRANCE",
    date: "14/12/2024",
    site: "Sacré-Coeur",                                                                                                                                                                                                                                                     
    Batiment: "A2",
    systeme: "Détection incendie",
    equipement: "Détecteur de fumée",
    description: "Équipement de détection de fumée est HS.",
    status: "En cours",
  },
];

const interventions = [
  {
    id: "1",
    client: "AIR FRANCE",
    date: "22/11/2024",
    site: "Sacré-Coeur",
    Batiment: "A2",
    systeme: "Détection incendie",
    equipement: "Détecteur de fumée",
    description: "Détecteur de fumée HS depuis coupure de courant.",
    status: "En cours",
  },
];

const DetailPage = () => {
  const params = useParams(); // Récupère l'ID dynamique
  const searchParams = useSearchParams(); // Récupère les paramètres de requête
  const router = useRouter(); // Pour redirection
  const id = params.id; // ID passé dans l'URL
  const type = searchParams.get("type"); // Récupère le type (maintenance ou intervention)
  const isMaintenance = type === "maintenance";

  const data = isMaintenance ? maintenances : interventions;
  const intervention = data.find((item) => item.id === id);

  const [isFinished, setIsFinished] = useState(intervention?.status === "Terminé");

  // Fonction pour marquer comme terminé
  const handleFinish = () => {
    setIsFinished(true);
    alert(`${isMaintenance ? "Maintenance" : "Intervention"} terminée avec succès !`);
  };

  // Fonction pour naviguer vers le rapport
  const handleFillReport = () => {
    if (!isFinished) {
      if (isMaintenance) {
        router.push(`/technicien/Rapport/FicheMaintenance/ficheDI?id=${id}`);
      } else {
        router.push(`/technicien/Rapport/FicheIntervention?id=${id}`);
      }
    }
  };

  if (!intervention) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          {isMaintenance ? "Maintenance non trouvée" : "Intervention non trouvée"}
        </h1>
        <p>Aucun élément correspondant à l'ID donné n'a été trouvé.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{isMaintenance ? `Maintenance - ${intervention.id}` : `Intervention - ${intervention.id}`}</title>
      </Head>
      <div
        className={`min-h-screen flex flex-col ${
          isFinished ? "bg-gray-300" : "bg-gray-50"
        }`}
      >
        {/* Header */}
        <header className="bg-blue-600 text-white py-6">
          <div className="container mx-auto px-6">
            <h1 className="text-2xl font-bold">
              {isMaintenance ? "Détails de la maintenance" : "Détails de l'intervention"} #{intervention.id}
            </h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto px-6 py-10">
          {/* Details Section */}
          <div
            className={`bg-white shadow-md rounded-lg p-6 mb-6 ${
              isFinished ? "opacity-50" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isMaintenance ? "Détails de la maintenance" : "Détails de l'intervention"}
            </h2>
            <div className="mb-2">
              <h3 className="text-black font-bold">Client:</h3>
              <span>{intervention.client}</span>
            </div>
            <div className="mb-2">
              <h3 className="text-black font-bold">Date:</h3>
              <span>{intervention.date}</span>
            </div>
            <div className="mb-2">
              <h3 className="text-black font-bold">Site:</h3>
              <span>{intervention.site}</span>
            </div>
            <div className="mb-2">
              <h3 className="text-black font-bold">Batiment:</h3>
              <span>{intervention.Batiment}</span>
            </div>
            <div className="mb-2">
              <h3 className="text-black font-bold">Systeme:</h3>
              <span>{intervention.systeme}</span>
            </div>
            <div className="mb-2">
              <h3 className="text-black font-bold">Description:</h3>
              <span>{intervention.description}</span>
            </div>
            <div className="mb-2">
              <h3 className="text-black font-bold">Statut:</h3>
              <span>{intervention.status}</span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex space-x-4">
            {/* Bouton Remplir le rapport */}
            <button
              className={`py-2 px-4 rounded-md text-white ${
                isFinished ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={handleFillReport}
              disabled={isFinished}
            >
              Remplir le rapport
            </button>

            {/* Bouton Terminer */}
            {intervention.status === "En cours" && !isFinished && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                onClick={handleFinish}
              >
                {isMaintenance ? "Terminer la maintenance" : "Terminer l'intervention"}
              </button>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>© 2024 Système de maintenance</p>
        </footer>
      </div>
    </>
  );
};

export default DetailPage;

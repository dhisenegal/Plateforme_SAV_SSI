"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// Données fictives des interventions et maintenances
const interventions = [
  {
    id: "1",
    client: "AIR FRANCE",
    date: "22/11/2024",
    description: "Maintenance de l'équipement de communication.",
    status: "En cours",
  },
  {
    id: "2",
    client: "SENELEC",
    date: "16/12/2024",
    description: "Inspection et calibration des générateurs électriques.",
    status: "Terminé",
  },
];

const maintenances = [
  {
    id: "1",
    client: "SENELEC",
    date: "14/12/2024",
    description: "Réparation de transformateurs électriques.",
    status: "Programmé",
  },
  {
    id: "2",
    client: "AIR FRANCE",
    date: "18/11/2024",
    description: "Maintenance du système de communication.",
    status: "Terminé",
  },
];

// Trier par date
const sortedInterventions = interventions.sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);
const sortedMaintenances = maintenances.sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);

// Prochaine intervention et maintenance
const prochaineIntervention = sortedInterventions[0];
const prochaineMaintenance = sortedMaintenances[0];

const Technicien = () => {
  return (
    <>
      <Head>
        <title>Accueil - Technicien</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Bienvenue, Abdoulaye
              </h1>
              <p className="text-sm text-gray-200">
                Voici votre tableau de bord
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Image
                src="/images/technicien.png"
                alt="Technicien au travail"
                width={80}
                height={80}
                className="rounded-full border-4 border-white"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Prochaine Maintenance */}
          {prochaineMaintenance && (
            <div
              key={`maintenance-${prochaineMaintenance.id}`}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between text-center transition-transform hover:scale-105 hover:shadow-xl h-[220px]"
            >
              <h3 className="text-lg font-semibold text-black mb-2">
                Prochaine Maintenance
              </h3>
              <p className="mb-1 text-gray-800">
                Client: {prochaineMaintenance.client}
              </p>
              <p className="mb-1 text-gray-800">
                Date: {prochaineMaintenance.date}
              </p>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  prochaineMaintenance.status === "En cours"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {prochaineMaintenance.status}
              </span>
              <Link
                href={`/technicien/${prochaineMaintenance.id}?type=maintenance`}
              >
                <button className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors">
                  Voir Détails
                </button>
              </Link>
            </div>
          )}

          {/* Prochaine Intervention */}
          {prochaineIntervention && (
            <div
              key={`intervention-${prochaineIntervention.id}`}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between text-center transition-transform hover:scale-105 hover:shadow-xl h-[220px]"
            >
              <h3 className="text-lg font-semibold text-black mb-2">
                Prochaine Intervention
              </h3>
              <p className="mb-1 text-gray-800">
                Client: {prochaineIntervention.client}
              </p>
              <p className="mb-1 text-gray-800">
                Date: {prochaineIntervention.date}
              </p>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  prochaineIntervention.status === "En cours"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {prochaineIntervention.status}
              </span>
              <Link
                href={`/technicien/${prochaineIntervention.id}?type=intervention`}
              >
                <button className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors">
                  Voir Détails
                </button>
              </Link>
            </div>
          )}

          {/* Autres sections */}
          <section className="bg-white shadow-lg rounded-lg p-4 text-center flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-xl h-[220px]">
            <h2 className="text-lg font-semibold mb-2">Planning</h2>
            <p className="text-gray-600 mb-2">
              Consultez votre planning d'interventions.
            </p>
            <Link href="/technicien/Planning">
              <button className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors">
                Voir Planning
              </button>
            </Link>
          </section>

          <section className="bg-white shadow-lg rounded-lg p-4 text-center flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-xl h-[220px]">
            <h2 className="text-lg font-semibold mb-2">Maintenances</h2>
            <p className="text-gray-600 mb-2">
              Consultez les tâches de maintenance.
            </p>
            <Link href="/technicien/Maintenances">
              <button className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors">
                Voir Maintenance
              </button>
            </Link>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-2">
          <p>© 2024 Système d'intervention - Tous droits réservés</p>
        </footer>
      </div>
    </>
  );
};

export default Technicien;

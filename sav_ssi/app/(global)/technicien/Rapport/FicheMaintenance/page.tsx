"use client";

import React from "react";
import Link from "next/link"; // Utilisation de Link pour la navigation entre pages

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white py-8 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold">
              Sélectionnez une Fiche de Maintenance
            </h1>
            <p className="text-lg mt-2">
              Choisissez le système de sécurité concerné
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Fiche 1 : Maintenance Inspecteur */}
            <Link
              href="/maintenance/inspecteur" // Utilisation de Link pour naviguer vers la page "inspecteur"
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-blue-600">
                Fiche de Maintenance extincteur
              </h3>
              <p className="mt-4 text-gray-700">
                Maintenance liée à l'extinction
              </p>
            </Link>

            {/* Fiche 2 : Maintenance Extinction Automatique */}
            <Link
              href="./FicheMaintenance/ficheEA" // Utilisation de Link pour naviguer vers la page "extinction-automatique"
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-blue-600">
                Fiche de Maintenance Extinction Automatique
              </h3>
              <p className="mt-4 text-gray-700">
                Maintenance des systèmes d'extinction automatique des incendies.
              </p>
            </Link>

            {/* Fiche 3 : Maintenance Détection Automatique */}
            <Link
              href="./FicheMaintenance/ficheDI" // Utilisation de Link pour naviguer vers la page "detection-automatique"
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-blue-600">
                Fiche de Maintenance Détection Automatique
              </h3>
              <p className="mt-4 text-gray-700">
                Maintenance des systèmes de détection automatique d'incendie.
              </p>
            </Link>
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

export default HomePage;

import React from "react";
import { getNextIntervention, getNextMaintenance, getTechnicienById } from "@/lib/fonction";
import Link from "next/link";

const Technicien = async () => {
  try {
    // Exemple d'ID du technicien (à récupérer dynamiquement ou via un contexte/authentification)
    const technicienId = 1;
    const technicienNom = await getTechnicienById(technicienId);

    const prochaineIntervention = await getNextIntervention();
    const prochaineMaintenance = await getNextMaintenance();

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4 px-6 shadow-lg flex items-center">
          <div className="flex items-center gap-4">
            <img
              src="/images/technicien.png"
              alt="Photo du technicien"
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Bienvenue, {technicienNom}
              </h1>
              <p className="text-sm">Voici votre tableau de bord</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Prochaine Intervention */}
          {prochaineIntervention ? (
            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col text-center h-[200px]">
              <h3 className="text-lg font-semibold mb-2">Prochaine Intervention</h3>
              <p>Client: {prochaineIntervention.DemandeIntervention.Client.nom}</p>
              <p>Date: {new Date(prochaineIntervention.dateIntervention).toLocaleDateString()}</p>
              <p>Statut: {prochaineIntervention.DemandeIntervention.statut}</p>
              <Link href={`/technicien/${prochaineIntervention.id}?type=intervention`}>
                <button className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700">
                  Voir Détails
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col text-center h-[200px]">
              <p>Aucune intervention prévue.</p>
            </div>
          )}

          {/* Prochaine Maintenance */}
          {prochaineMaintenance ? (
            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col text-center h-[200px]">
              <h3 className="text-lg font-semibold mb-2">Prochaine Maintenance</h3>
              <p>Client: {prochaineMaintenance.Installation.Client.nom}</p>
              <p>Date: {new Date(prochaineMaintenance.dateMaintenance).toLocaleDateString()}</p>
              <Link href={`/technicien/${prochaineMaintenance.id}?type=maintenance`}>
                <button className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700">
                  Voir Détails
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col text-center h-[200px]">
              <p>Aucune maintenance prévue.</p>
            </div>
          )}

          {/* Section Planning */}
          <section className="bg-white shadow-lg rounded-lg p-4 text-center flex flex-col justify-between h-[200px] transition-transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Planning</h2>
            <p className="text-gray-600 mb-2">Consultez votre planning d'interventions.</p>
            <Link href="/technicien/Planning">
              <button className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors">
                Voir Planning
              </button>
            </Link>
          </section>

          {/* Section Maintenances */}
          <section className="bg-white shadow-lg rounded-lg p-4 text-center flex flex-col justify-between h-[200px] transition-transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Maintenances</h2>
            <p className="text-gray-600 mb-2">Consultez les tâches de maintenance.</p>
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
    );
  } catch (error) {
    console.error('Erreur :', error);
    return <div className="text-center text-red-600">Erreur lors du chargement des données.</div>;
  }
};

export default Technicien;

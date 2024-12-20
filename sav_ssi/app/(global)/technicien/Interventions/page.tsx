import React from "react";
import Link from "next/link";
import { getPlanning, formatDate, getClientName, getDescription, getType } from "@/lib/fonction"; // Importer les fonctions nécessaires

const InterventionPage = async () => {
  try {
    // Récupérer les données de planning, triées par date
    const planning = await getPlanning();

    // Filtrer les interventions
    const interventions = planning.filter(item => getType(item) === "Intervention");

    if (interventions.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500 text-lg font-medium">
          Aucune intervention prévue.
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-xl">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 text-center tracking-wide">
          INTERVENTIONS
        </h1>
        <table className="w-full table-auto bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="px-6 py-3 text-sm font-semibold uppercase">Date</th>
              <th className="px-6 py-3 text-sm font-semibold uppercase">Client</th>
              <th className="px-6 py-3 text-sm font-semibold uppercase">Description</th>
              <th className="px-6 py-3 text-sm font-semibold uppercase">Statut</th>
              <th className="px-6 py-3 text-sm font-semibold uppercase">Voir détails</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((item, index) => (
              <tr
                key={item.id}
                className={`${index % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100 transition-all duration-200`}
              >
                <td className="px-6 py-4 text-gray-700">
                  {formatDate(item.dateIntervention)}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {getClientName(item)}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {getDescription(item)}
                </td>
                <td className={`px-6 py-4 font-bold ${item.statut === "Terminé" ? "text-green-600" : "text-yellow-600"}`}>
                  {item.statut}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/technicien/${item.id}?type=intervention`}
                    className="text-blue-700 hover:underline hover:text-blue-900 font-semibold transition-all duration-200"
                  >
                    Voir détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des interventions :", error);
    return (
      <div className="flex items-center justify-center h-full text-red-600 text-lg font-medium">
        Erreur lors de la récupération des interventions.
      </div>
    );
  }
};

export default InterventionPage;

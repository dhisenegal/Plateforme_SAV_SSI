import React from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa"; // Ajout d'une icône
import { getPlanning, formatDate, getClientName, getDescription, getType } from "@/lib/fonction";

const PlanningPage = async () => {
  try {
    const uniquePlanning = await getPlanning();

    if (uniquePlanning.length === 0) {
      return <div className="text-center text-gray-500">Aucune intervention ou maintenance prévue.</div>;
    }

    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 shadow-xl rounded-lg border border-gray-300">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg text-white text-center shadow-lg">
          <h1 className="text-4xl font-extrabold tracking-wide uppercase">Planning</h1>
        </div>
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden mt-6">
          <thead>
            <tr className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left font-bold text-sm uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left font-bold text-sm uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left font-bold text-sm uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left font-bold text-sm uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left font-bold text-sm uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-center font-bold text-sm uppercase tracking-wider">Voir détails</th>
            </tr>
          </thead>
          <tbody>
            {uniquePlanning.map((item, index) => {
              const rowClass = getType(item) === "Intervention" ? "bg-orange-50 hover:bg-orange-100" : "bg-green-50 hover:bg-green-100";
              const typeParam = getType(item).toLowerCase();

              return (
                <tr
                  key={`${item.id}-${item.dateIntervention || item.dateMaintenance}`}
                  className={`${rowClass} ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-blue-50 transition duration-300`}
                >
                  <td className="px-6 py-4 border-t text-gray-800 text-sm">
                    {formatDate(item.dateIntervention || item.dateMaintenance)}
                  </td>
                  <td className="px-6 py-4 border-t text-gray-800 text-sm">
                    {getClientName(item)}
                  </td>
                  <td className="px-6 py-4 border-t text-gray-800 text-sm">
                    {getDescription(item)}
                  </td>
                  <td className="px-6 py-4 border-t text-gray-800 text-sm">
                    {getType(item)}
                  </td>
                  <td className="px-6 py-4 border-t text-gray-800 text-sm">
                    {item.DemandeIntervention ? item.DemandeIntervention.statut : item.statut}
                  </td>
                  <td className="px-6 py-4 border-t text-center">
                    <Link
                      href={`/technicien/${item.id}?type=${typeParam}`}
                      className="text-blue-500 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition duration-200"
                    >
                      <FaEye /> Voir détails
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des interventions et des maintenances :", error);
    return <div className="text-center text-red-600">Erreur lors de la récupération des interventions et des maintenances.</div>;
  }
};

export default PlanningPage;

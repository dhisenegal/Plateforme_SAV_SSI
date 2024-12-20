"use client";

import Link from "next/link";
import React, { useState } from "react";

const InterventionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");

  // Exemple de données d'interventions
  const [interventions, setInterventions] = useState([
    { id: "1", title: "Réparation climatisation", client: "Client A", technician: "Technicien 1", status: "En cours", date: "2024-11-12" },
    { id: "2", title: "Installation WiFi", client: "Client B", technician: "Technicien 2", status: "Terminé", date: "2024-11-10" },
  ]);

  const filteredInterventions = interventions.filter((intervention) =>
    intervention.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === "" || intervention.status === statusFilter) &&
    (clientFilter === "" || intervention.client === clientFilter) &&
    (technicianFilter === "" || intervention.technician === technicianFilter)
  );


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interventions</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Rechercher une intervention"
          className="p-2 border rounded w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          <Link href="/admin/interventions/new">Créer une intervention</Link>
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <select className="p-2 border rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Filtrer par statut</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="Annulé">Annulé</option>
        </select>

        <select className="p-2 border rounded" value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
          <option value="">Filtrer par client</option>
          <option value="Client A">Client A</option>
          <option value="Client B">Client B</option>
        </select>

        <select className="p-2 border rounded" value={technicianFilter} onChange={(e) => setTechnicianFilter(e.target.value)}>
          <option value="">Filtrer par technicien</option>
          <option value="Technicien 1">Technicien 1</option>
          <option value="Technicien 2">Technicien 2</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Titre</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Technicien</th>
            <th className="p-2 border">Statut</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInterventions.map((intervention) => (
            <tr key={intervention.id}>
              <td className="p-2 border">{intervention.id}</td>
              <td className="p-2 border">{intervention.title}</td>
              <td className="p-2 border">{intervention.client}</td>
              <td className="p-2 border">{intervention.technician}</td>
              <td className="p-2 border">{intervention.status}</td>
              <td className="p-2 border">{intervention.date}</td>
              <td className="p-2 border">
                <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2">Détails</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default InterventionsPage;

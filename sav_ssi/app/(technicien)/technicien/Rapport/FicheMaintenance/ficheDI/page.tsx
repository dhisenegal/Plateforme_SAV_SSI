"use client";

import React, { useState } from "react";

const FormulaireIntervention = () => {
  const [formData, setFormData] = useState({
    client: "",
    contact: "",
    telephone: "",
    date: "",
    heureDebut: "",
    heureFin: "",
    taches: [
      { tache: "Test fonctionnalité du système*", statut: "", observation: "" },
      {
        tache: "Vérification carte électronique de la centrale",
        statut: "",
        observation: "",
      },
      {
        tache: "Test alimentation et batterie de la centrale",
        statut: "",
        observation: "",
      },
      { tache: "Dépoussiérage centrale", statut: "", observation: "" },
      { tache: "Dépoussiérage des détecteurs", statut: "", observation: "" },
      {
        tache: "Dépoussiérage déclencheurs manuel",
        statut: "",
        observation: "",
      },
      { tache: "Dépoussiérage des sirènes", statut: "", observation: "" },
      {
        tache: "Test fonctionnalité périphériques*",
        statut: "",
        observation: "",
      },
      {
        tache: "Test fonctionnalité de l'ensemble des équipements",
        statut: "",
        observation: "",
      },
    ],
  });

  const handleChange = (e, rowIndex, field) => {
    const { value } = e.target;
    const newTaches = [...formData.taches];
    newTaches[rowIndex][field] = value;
    setFormData({ ...formData, taches: newTaches });
  };

  const handleStatutChange = (rowIndex, statut) => {
    const newTaches = [...formData.taches];
    newTaches[rowIndex].statut = statut;
    setFormData({ ...formData, taches: newTaches });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          FICHE DE MAINTENANCE DETECTION INCENDIE
        </h1>

        {/* Disposition des champs client, contact, tel à gauche et date, heure début, heure fin à droite */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Colonne de gauche */}
          <div>
            <div className="form-item mb-4">
              <label htmlFor="client" className="font-semibold">
                Client :
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div className="form-item mb-4">
              <label htmlFor="contact" className="font-semibold">
                Contact :
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div className="form-item mb-4">
              <label htmlFor="telephone" className="font-semibold">
                Téléphone :
              </label>
              <input
                type="text"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>

          {/* Colonne de droite */}
          <div>
            <div className="form-item mb-4">
              <label htmlFor="date" className="font-semibold">
                Date :
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div className="form-item mb-4">
              <label htmlFor="heureDebut" className="font-semibold">
                Heure Début :
              </label>
              <input
                type="time"
                id="heureDebut"
                name="heureDebut"
                value={formData.heureDebut}
                onChange={(e) =>
                  setFormData({ ...formData, heureDebut: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <div className="form-item mb-4">
              <label htmlFor="heureFin" className="font-semibold">
                Heure Fin :
              </label>
              <input
                type="time"
                id="heureFin"
                name="heureFin"
                value={formData.heureFin}
                onChange={(e) =>
                  setFormData({ ...formData, heureFin: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
        </div>

        {/* Tableau des tâches */}
        <table className="table-auto w-full mb-6">
          <thead>
            <tr>
              <th className="p-2 text-left font-semibold">Tâche</th>
              <th className="p-2 text-left font-semibold">Statut</th>
              <th className="p-2 text-left font-semibold">Observations</th>
            </tr>
          </thead>
          <tbody>
            {formData.taches.map((tache, index) => (
              <tr key={index}>
                <td className="p-2 border">{tache.tache}</td>
                <td className="p-2 border">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded ${
                      tache.statut === "valide" ? "bg-green-500 text-white" : ""
                    }`}
                    onClick={() => handleStatutChange(index, "valide")}
                  >
                    Valide
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded ${
                      tache.statut === "nonValide"
                        ? "bg-red-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleStatutChange(index, "nonValide")}
                  >
                    Non valide
                  </button>
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={tache.observation}
                    onChange={(e) => handleChange(e, index, "observation")}
                    className="p-2 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bouton centré */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Soumettre le formulaire
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormulaireIntervention;

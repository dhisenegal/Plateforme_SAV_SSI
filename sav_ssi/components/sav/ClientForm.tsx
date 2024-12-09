"use client";

import React, { useState } from "react";

interface ClientFormProps {
  onSubmit: (nom: string, secteurDactivite: string) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, onCancel }) => {
  const [nom, setNom] = useState<string>("");
  const [secteurDactivite, setSecteurDactivite] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nom, secteurDactivite);
    setNom("");
    setSecteurDactivite("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Ajouter un Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Secteur d'activité"
              value={secteurDactivite}
              onChange={(e) => setSecteurDactivite(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Annuler
            </button>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
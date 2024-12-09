"use client";

import React, { useState } from "react";

interface SiteFormProps {
  onSubmit: (nomSite: string) => void;
  onCancel: () => void;
}

const SiteForm: React.FC<SiteFormProps> = ({ onSubmit, onCancel }) => {
  const [nomSite, setNomSite] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nomSite);
    setNomSite("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Ajouter un Site</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nom du site"
              value={nomSite}
              onChange={(e) => setNomSite(e.target.value)}
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

export default SiteForm;
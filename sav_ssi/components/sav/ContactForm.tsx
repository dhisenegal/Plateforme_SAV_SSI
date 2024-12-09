"use client";

import React, { useState } from "react";

interface ContactFormProps {
  onSubmit: (nomResponsable: string, idUtilisateur: number) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel }) => {
  const [nomResponsable, setNomResponsable] = useState<string>("");
  const [idUtilisateur, setIdUtilisateur] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nomResponsable, Number(idUtilisateur));
    setNomResponsable("");
    setIdUtilisateur("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Ajouter un Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nom du responsable"
              value={nomResponsable}
              onChange={(e) => setNomResponsable(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="ID de l'utilisateur"
              value={idUtilisateur}
              onChange={(e) => setIdUtilisateur(Number(e.target.value))}
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

export default ContactForm;
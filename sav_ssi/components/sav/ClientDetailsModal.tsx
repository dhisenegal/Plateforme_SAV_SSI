"use client";

import React from "react";

interface ClientDetailsModalProps {
  client: Client | null;
  onClose: () => void;
}

interface Client {
  id: number;
  nom: string;
  secteurDactivite: string;
  Sites?: Site[];
  Contacts?: Contact[];
  Installations?: Installation[];
}

interface Site {
  id: number;
  nom: string;
}

interface Contact {
  id: number;
  nomResponsable: string;
  Utilisateur: {
    nom: string;
    prenom: string;
    numero: string;
  };
}

interface Installation {
  id: number;
  dateInstallation: Date;
  observations: string;
  EquipementsInstallation: InstallationEquipement[];
}

interface InstallationEquipement {
  id: number;
  Equipement: {
    nom: string;
  };
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-2/3">
        <h2 className="text-xl font-semibold mb-4">Détails du Client</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Nom: {client.nom}</h3>
          <p>Secteur d'activité: {client.secteurDactivite}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Sites</h3>
          <ul>
            {client.Sites?.map((site) => (
              <li key={site.id}>{site.nom}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Contacts</h3>
          <ul>
            {client.Contacts?.map((contact) => (
              <li key={contact.id}>
                {contact.nomResponsable} - {contact.Utilisateur.nom} {contact.Utilisateur.prenom} ({contact.Utilisateur.numero})
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Installations</h3>
          <ul>
            {client.Installations?.map((installation) => (
              <li key={installation.id}>
                {installation.dateInstallation.toISOString().split('T')[0]} - {installation.observations}
                <ul>
                  {installation.EquipementsInstallation.map((equipement) => (
                    <li key={equipement.id}>{equipement.Equipement.nom}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 bg-gray-500 text-white rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
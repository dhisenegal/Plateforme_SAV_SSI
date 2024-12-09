"use client";

import React, { useState, useEffect } from "react";
import { getSitesByClientId } from "@/actions/client";

interface InstallationFormProps {
  onSubmit: (dateInstallation: string, observations: string, idSysteme: number, selectedEquipements: { id: number, quantite: number }[], siteId: number) => void;
  onCancel: () => void;
  systemes: Systeme[];
  clientId: number;
}

interface Systeme {
  id: number;
  nom: string;
  Equipements: Equipement[];
}

interface Equipement {
  id: number;
  nom: string;
}

interface Site {
  id: number;
  nom: string;
}

const InstallationForm: React.FC<InstallationFormProps> = ({ onSubmit, onCancel, systemes, clientId }) => {
  const [installationDate, setInstallationDate] = useState<string>("");
  const [installationObservations, setInstallationObservations] = useState<string>("");
  const [installationSystemId, setInstallationSystemId] = useState<number | "">("");
  const [selectedEquipements, setSelectedEquipements] = useState<{ id: number, quantite: number }[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<number | "">("");

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await getSitesByClientId(clientId);
        setSites(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sites:", error);
      }
    };
    fetchSites();
  }, [clientId]);

  const handleEquipementChange = (equipementId: number, quantite: number) => {
    setSelectedEquipements((prev) => {
      const existingEquipement = prev.find((eq) => eq.id === equipementId);
      if (existingEquipement) {
        return prev.map((eq) => eq.id === equipementId ? { ...eq, quantite } : eq);
      } else {
        return [...prev, { id: equipementId, quantite }];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(installationDate, installationObservations, Number(installationSystemId), selectedEquipements, Number(selectedSiteId));
    setInstallationDate("");
    setInstallationObservations("");
    setInstallationSystemId("");
    setSelectedEquipements([]);
    setSelectedSiteId("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Ajouter une Installation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="date"
              placeholder="Date d'installation"
              value={installationDate}
              onChange={(e) => setInstallationDate(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Observations"
              value={installationObservations}
              onChange={(e) => setInstallationObservations(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <select
              value={installationSystemId}
              onChange={(e) => setInstallationSystemId(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Sélectionner un système</option>
              {systemes.map((systeme) => (
                <option key={systeme.id} value={systeme.id}>
                  {systeme.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Sélectionner un site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.nom}
                </option>
              ))}
            </select>
          </div>
          {installationSystemId && (
            <div className="mb-4">
              <label className="block mb-2">Sélectionner les équipements</label>
              {systemes
                .find((systeme) => systeme.id === installationSystemId)
                ?.Equipements.map((equipement) => (
                  <div key={equipement.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      value={equipement.id}
                      onChange={(e) => {
                        const equipementId = Number(e.target.value);
                        if (e.target.checked) {
                          handleEquipementChange(equipementId, 1);
                        } else {
                          setSelectedEquipements((prev) => prev.filter((eq) => eq.id !== equipementId));
                        }
                      }}
                      className="mr-2"
                    />
                    <label className="mr-2">{equipement.nom}</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedEquipements.find((eq) => eq.id === equipement.id)?.quantite || 1}
                      onChange={(e) => handleEquipementChange(equipement.id, Number(e.target.value))}
                      className="p-2 border border-gray-300 rounded w-16"
                      disabled={!selectedEquipements.find((eq) => eq.id === equipement.id)}
                    />
                  </div>
                ))}
            </div>
          )}
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

export default InstallationForm;
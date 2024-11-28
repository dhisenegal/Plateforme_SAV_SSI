"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

// Données fictives
const initialClients = [
  { id: "1", name: "SDE" },
  { id: "2", name: "Sonatel" },
];

const initialSites = [
  { id: "1", name: "Site 1", clientId: "2", systems: [] },
  { id: "2", name: "Site 2", clientId: "2", systems: [] },
];

const equipmentBySystemType = {
  SDI: ["Détecteur de fumée", "Déclencheur manuel", "Alarme incendie"],
  Extincteurs: ["Mousse 9L", "Mousse 6L", "Extinction automatique"],
};

const MaintenancesPage = () => {
  const [clients] = useState(initialClients);
  const [sites, setSites] = useState(initialSites);
  const [selectedSite, setSelectedSite] = useState(null);

  const [newSite, setNewSite] = useState({ name: "", clientId: "" });
  const [newSystem, setNewSystem] = useState({
    type: "",
    equipment: [],
    quantities: {},
  });

  // Ajouter un nouveau site
  const handleAddSite = () => {
    const newId = (sites.length + 1).toString();
    setSites([...sites, { ...newSite, id: newId, systems: [] }]);
    setNewSite({ name: "", clientId: "" });
  };

  // Ajouter un nouveau système
  const handleAddSystem = () => {
    const updatedSites = sites.map((site) => {
      if (site.id === selectedSite.id) {
        return {
          ...site,
          systems: [...site.systems, { ...newSystem, id: Date.now().toString() }],
        };
      }
      return site;
    });
    setSites(updatedSites);
    setNewSystem({ type: "", equipment: [], quantities: {} });
  };

  // Gestion des équipements et quantités
  const handleEquipmentChange = (equipmentName, quantity) => {
    setNewSystem({
      ...newSystem,
      quantities: { ...newSystem.quantities, [equipmentName]: quantity },
    });
  };

  return (
    <div className="p-6">
      {/* Section d'ajout de site */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Maintenances</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Ajouter un Site</Button>
          </DialogTrigger>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Site</DialogTitle>
              <DialogDescription>Sélectionnez un client et ajoutez un site.</DialogDescription>
            </DialogHeader>
            <div>
              <div className="mb-4">
                <label className="block mb-2">Client</label>
                <select
                  name="clientId"
                  onChange={(e) => setNewSite({ ...newSite, clientId: e.target.value })}
                  value={newSite.clientId}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Sélectionnez un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Nom du Site</label>
                <Input
                  name="name"
                  placeholder="Nom du site"
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  value={newSite.name}
                />
              </div>
              <Button
                onClick={handleAddSite}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Ajouter le Site
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des sites */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Sites et Systèmes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Systèmes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>
                  {clients.find((client) => client.id === site.clientId)?.name || "Inconnu"}
                </TableCell>
                <TableCell>{site.name}</TableCell>
                <TableCell>{site.systems.length} système(s)</TableCell>
                <TableCell>
                  <Button
                    onClick={() => setSelectedSite(site)}
                    className="text-blue-500 hover:underline"
                  >
                    Gérer les Systèmes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Gestion des systèmes */}
      {selectedSite && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">Ajouter un Système au Site {selectedSite.name}</Button>
          </DialogTrigger>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un Système</DialogTitle>
              <DialogDescription>Ajoutez des équipements et des quantités.</DialogDescription>
            </DialogHeader>
            <div>
              <div className="mb-4">
                <label className="block mb-2">Type de Système</label>
                <select
                  name="type"
                  onChange={(e) =>
                    setNewSystem({ ...newSystem, type: e.target.value, equipment: [] })
                  }
                  value={newSystem.type}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Sélectionnez un type</option>
                  {Object.keys(equipmentBySystemType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Équipements</label>
                {equipmentBySystemType[newSystem.type]?.map((equipment) => (
                  <div key={equipment} className="flex items-center gap-2 mb-2">
                    <label>{equipment}</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Quantité"
                      onChange={(e) => handleEquipmentChange(equipment, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={handleAddSystem}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Ajouter le Système
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MaintenancesPage;

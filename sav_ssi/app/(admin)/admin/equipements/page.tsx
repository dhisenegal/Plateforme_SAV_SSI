<<<<<<< HEAD
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Equipment = {
  id: number;
  name: string;
  description: string;
};

const EquipmentManagementPage = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);

  // Ouvrir la modal
  const openModal = (equipment?: Equipment) => {
    setCurrentEquipment(equipment || { id: 0, name: '', description: '' });
    setIsModalOpen(true);
  };

  // Fermer la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEquipment(null);
  };

  // Ajouter ou modifier un équipement
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEquipment) {
      if (currentEquipment.id === 0) {
        // Ajout d'un nouvel équipement
        setEquipments([
          ...equipments,
          { ...currentEquipment, id: equipments.length + 1 },
        ]);
      } else {
        // Modification de l'équipement existant
        setEquipments(
          equipments.map((equip) =>
            equip.id === currentEquipment.id ? currentEquipment : equip
          )
        );
      }
    }
    closeModal();
  };

  // Supprimer un équipement
  const handleDelete = (id: number) => {
    setEquipments(equipments.filter((equip) => equip.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Équipements</h1>

      <Button onClick={() => openModal()} className="mb-4">
        Ajouter un Équipement
      </Button>

      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
        <thead>
          <tr>
            <th className="px-6 py-2 border-b">Nom</th>
            <th className="px-6 py-2 border-b">Description</th>
            <th className="px-6 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((equip) => (
            <tr key={equip.id}>
              <td className="px-6 py-3 border-b">{equip.name}</td>
              <td className="px-6 py-3 border-b">{equip.description}</td>
              <td className="px-6 py-3 border-b">
                <Button
                  variant="outline"
                  onClick={() => openModal(equip)}
                  className="mr-2"
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(equip.id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentEquipment?.id === 0 ? 'Ajouter' : 'Modifier'} un Équipement
            </DialogTitle>
            <DialogDescription>
              Vous pouvez appuyer sur enregistrer si vous terminez.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom équipement
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={currentEquipment?.name || ''}
                  onChange={(e) =>
                    setCurrentEquipment((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  type="text"
                  value={currentEquipment?.description || ''}
                  onChange={(e) =>
                    setCurrentEquipment((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
=======
"use client"

import React, { useState, useEffect } from "react";
import {
  addSysteme,
  addMarque,
  addModele,
  addEquipement,
  getAllEquipements,
  getAllSystemes,
  getAllMarques,
  getAllModeles,
  updateEquipement,
  deleteEquipement,
} from "@/actions/equipement";

// Définir les types des entités
interface Systeme {
  id: number;
  nom: string;
}

interface Marque {
  id: number;
  nom: string;
}

interface Modele {
  id: number;
  nom: string;
}

interface Equipement {
  id: number;
  nom: string;
  systeme?: Systeme;
  marqueSsi?: Marque;
  modeleSsi?: Modele;
}

const GestionEquipements = () => {
  const [systemName, setSystemName] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");
  const [equipmentData, setEquipmentData] = useState<{
    nom: string;
    idSysteme: number;
    idMarqueSsi: number;
    idModeleSsi: number;
  }>({
    nom: "",
    idSysteme: 0,
    idMarqueSsi: 0,
    idModeleSsi: 0,
  });
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [systemes, setSystemes] = useState<Systeme[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [modeles, setModeles] = useState<Modele[]>([]);

  // Pour gérer l'état de la fenêtre modale
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Charger les données initiales
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setSystemes(await getAllSystemes());
      setMarques(await getAllMarques());
      setModeles(await getAllModeles());
      setEquipements(await getAllEquipements());
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  const handleAddSystem = async () => {
    await addSysteme(systemName);
    setSystemName("");
    fetchData();
    alert("Système ajouté !");
  };

  const handleAddBrand = async () => {
    await addMarque(brandName);
    setBrandName("");
    fetchData();
    alert("Marque ajoutée !");
  };

  const handleAddModel = async () => {
    await addModele(modelName);
    setModelName("");
    fetchData();
    alert("Modèle ajouté !");
  };

  const handleAddEquipment = async () => {
    await addEquipement(equipmentData);
    setEquipmentData({ nom: "", idSysteme: 0, idMarqueSsi: 0, idModeleSsi: 0 });
    fetchData();
    setIsModalOpen(false); // Fermer la modale après ajout
    alert("Équipement ajouté !");
  };

  const handleUpdateEquipment = async (id: number, updatedData: Equipement) => {
    await updateEquipement(id, updatedData);
    fetchData();
    alert("Équipement modifié !");
  };

  const handleDeleteEquipment = async (id: number) => {
    await deleteEquipement(id);
    fetchData();
    alert("Équipement supprimé !");
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Gestion des Équipements</h1>

      {/* Ajouter un système */}
      <div>
        <input
          type="text"
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          placeholder="Nom du système"
          className="border p-2 mb-2"
        />
        <button onClick={handleAddSystem} className="bg-blue-500 text-white p-2 ml-2">
          Ajouter Système
        </button>
      </div>

      {/* Ajouter une marque */}
      <div>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Nom de la marque"
          className="border p-2 mb-2"
        />
        <button onClick={handleAddBrand} className="bg-blue-500 text-white p-2 ml-2">
          Ajouter Marque
        </button>
      </div>

      {/* Ajouter un modèle */}
      <div>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Nom du modèle"
          className="border p-2 mb-2"
        />
        <button onClick={handleAddModel} className="bg-blue-500 text-white p-2 ml-2">
          Ajouter Modèle
        </button>
      </div>

      {/* Ajouter un équipement */}
      <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white p-2 mt-4">
        Ajouter Équipement
      </button>

      {/* Fenêtre Modale pour ajouter un équipement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Ajouter un Équipement</h3>
            <input
              type="text"
              value={equipmentData.nom}
              onChange={(e) => setEquipmentData({ ...equipmentData, nom: e.target.value })}
              placeholder="Nom de l'équipement"
              className="border p-2 mb-2 w-full"
            />
            <select
              value={equipmentData.idSysteme}
              onChange={(e) =>
                setEquipmentData({ ...equipmentData, idSysteme: parseInt(e.target.value) })
              }
              className="border p-2 mb-2 w-full"
            >
              <option value="">Sélectionner un système</option>
              {systemes.map((systeme) => (
                <option key={systeme.id} value={systeme.id}>
                  {systeme.nom}
                </option>
              ))}
            </select>
            <select
              value={equipmentData.idMarqueSsi}
              onChange={(e) =>
                setEquipmentData({ ...equipmentData, idMarqueSsi: parseInt(e.target.value) })
              }
              className="border p-2 mb-2 w-full"
            >
              <option value="">Sélectionner une marque</option>
              {marques.map((marque) => (
                <option key={marque.id} value={marque.id}>
                  {marque.nom}
                </option>
              ))}
            </select>
            <select
              value={equipmentData.idModeleSsi}
              onChange={(e) =>
                setEquipmentData({ ...equipmentData, idModeleSsi: parseInt(e.target.value) })
              }
              className="border p-2 mb-2 w-full"
            >
              <option value="">Sélectionner un modèle</option>
              {modeles.map((modele) => (
                <option key={modele.id} value={modele.id}>
                  {modele.nom}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleAddEquipment}
                className="bg-green-500 text-white p-2"
              >
                Ajouter
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white p-2"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des équipements */}
      <div className="mt-6">
        <h3 className="text-xl font-bold">Liste des Équipements</h3>
        {equipements.map((equipement) => (
          <div key={equipement.id} className="border p-4 mb-2">
            <p>Nom: {equipement.nom}</p>
            <p>Système: {equipement.systeme?.nom}</p>
            <p>Marque: {equipement.marqueSsi?.nom}</p>
            <p>Modèle: {equipement.modeleSsi?.nom}</p>
            <button
              onClick={() => handleDeleteEquipment(equipement.id)}
              className="bg-red-500 text-white p-2 mt-2"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
    </div>
  );
};

<<<<<<< HEAD
export default EquipmentManagementPage;
=======
export default GestionEquipements;
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9

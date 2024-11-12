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
    </div>
  );
};

export default EquipmentManagementPage;

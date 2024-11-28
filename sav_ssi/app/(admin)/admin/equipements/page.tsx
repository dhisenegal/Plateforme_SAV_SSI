"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Equipment = {
  id: number;
  name: string;
  description: string;
  system: string;
  brand: string;
  model: string;
};

const EquipmentManagementPage = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [systems, setSystems] = useState<string[]>(["SDI", "Extincteurs automatiques"]);
  const [brands, setBrands] = useState<string[]>(["Brand A", "Brand B"]);
  const [models, setModels] = useState<string[]>(["Model X", "Model Y"]);

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);

  const [entityManager, setEntityManager] = useState<{
    type: "system" | "brand" | "model";
    isOpen: boolean;
  }>({ type: "system", isOpen: false });

  const openEquipmentModal = (equipment?: Equipment) => {
    setCurrentEquipment(
      equipment || {
        id: 0,
        name: "",
        description: "",
        system: systems[0] || "",
        brand: brands[0] || "",
        model: models[0] || "",
      }
    );
    setIsEquipmentModalOpen(true);
  };

  const closeEquipmentModal = () => {
    setIsEquipmentModalOpen(false);
    setCurrentEquipment(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEquipment) {
      if (currentEquipment.id === 0) {
        setEquipments([...equipments, { ...currentEquipment, id: equipments.length + 1 }]);
      } else {
        setEquipments(
          equipments.map((equip) =>
            equip.id === currentEquipment.id ? currentEquipment : equip
          )
        );
      }
    }
    closeEquipmentModal();
  };

  const handleDelete = (id: number) => {
    setEquipments(equipments.filter((equip) => equip.id !== id));
  };

  const handleEntityChange = (type: "system" | "brand" | "model", newValue: string) => {
    switch (type) {
      case "system":
        setSystems((prev) => [...prev, newValue]);
        break;
      case "brand":
        setBrands((prev) => [...prev, newValue]);
        break;
      case "model":
        setModels((prev) => [...prev, newValue]);
        break;
    }
  };

  const handleEntityDelete = (type: "system" | "brand" | "model", value: string) => {
    switch (type) {
      case "system":
        setSystems((prev) => prev.filter((item) => item !== value));
        break;
      case "brand":
        setBrands((prev) => prev.filter((item) => item !== value));
        break;
      case "model":
        setModels((prev) => prev.filter((item) => item !== value));
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Équipements</h1>

      {/* Boutons pour gérer les entités dynamiques */}
      <div className="flex gap-4 mb-4">
        <Button onClick={() => setEntityManager({ type: "system", isOpen: true })}>
          Gérer les Systèmes
        </Button>
        <Button onClick={() => setEntityManager({ type: "brand", isOpen: true })}>
          Gérer les Marques
        </Button>
        <Button onClick={() => setEntityManager({ type: "model", isOpen: true })}>
          Gérer les Modèles
        </Button>
        <Button onClick={() => openEquipmentModal()} className="ml-auto">
          Ajouter un Équipement
        </Button>
      </div>

      {/* Liste des équipements */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-2 text-left">Nom</th>
              <th className="px-6 py-2 text-left">Description</th>
              <th className="px-6 py-2 text-left">Système</th>
              <th className="px-6 py-2 text-left">Marque</th>
              <th className="px-6 py-2 text-left">Modèle</th>
              <th className="px-6 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equip) => (
              <tr key={equip.id} className="border-b">
                <td className="px-6 py-3">{equip.name}</td>
                <td className="px-6 py-3">{equip.description}</td>
                <td className="px-6 py-3">{equip.system}</td>
                <td className="px-6 py-3">{equip.brand}</td>
                <td className="px-6 py-3">{equip.model}</td>
                <td className="px-6 py-3">
                  <Button variant="outline" onClick={() => openEquipmentModal(equip)} className="mr-2">
                    Modifier
                  </Button>
                  <Button variant="outline" onClick={() => handleDelete(equip.id)}>
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale pour ajouter/modifier un équipement */}
      <Dialog open={isEquipmentModalOpen} onOpenChange={closeEquipmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEquipment?.id ? "Modifier" : "Ajouter"} un Équipement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={currentEquipment?.name || ""}
                onChange={(e) =>
                  setCurrentEquipment({ ...currentEquipment!, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={currentEquipment?.description || ""}
                onChange={(e) =>
                  setCurrentEquipment({ ...currentEquipment!, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Système</Label>
              <Select
                onValueChange={(value) =>
                  setCurrentEquipment({ ...currentEquipment!, system: value })
                }
                defaultValue={currentEquipment?.system || systems[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un système" />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((system, index) => (
                    <SelectItem key={index} value={system}>
                      {system}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Marque</Label>
              <Select
                onValueChange={(value) =>
                  setCurrentEquipment({ ...currentEquipment!, brand: value })
                }
                defaultValue={currentEquipment?.brand || brands[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une marque" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand, index) => (
                    <SelectItem key={index} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Modèle</Label>
              <Select
                onValueChange={(value) =>
                  setCurrentEquipment({ ...currentEquipment!, model: value })
                }
                defaultValue={currentEquipment?.model || models[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model, index) => (
                    <SelectItem key={index} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">{currentEquipment?.id ? "Modifier" : "Ajouter"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentManagementPage;

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  category: string;
  stock: number;
};

const EquipmentManagementPage = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<string[]>(["Électronique", "Sport", "Cuisine"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Ouvrir la modal
  const openModal = (equipment?: Equipment) => {
    setCurrentEquipment(equipment || { id: 0, name: "", description: "", category: "", stock: 0 });
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
        setEquipments([...equipments, { ...currentEquipment, id: equipments.length + 1 }]);
      } else {
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar des Catégories */}
      <aside className="w-full lg:w-1/4 p-4 bg-gray-100 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Catégories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer p-2 rounded-md hover:bg-blue-100 ${
                selectedCategory === category ? "bg-blue-200" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
        <Button
          className="w-full mt-4"
          onClick={() => {
            const newCategory = prompt("Ajouter une nouvelle catégorie");
            if (newCategory && !categories.includes(newCategory)) {
              setCategories([...categories, newCategory]);
            }
          }}
        >
          Ajouter une catégorie
        </Button>
      </aside>

      {/* Contenu Principal */}
      <main className="w-full lg:w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">Gestion des Équipements</h1>

        <Button onClick={() => openModal()} className="mb-4">
          Ajouter un Équipement
        </Button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 md:px-6 py-2 text-left text-sm md:text-base">Nom</th>
                <th className="px-2 md:px-6 py-2 text-left text-sm md:text-base">Description</th>
                <th className="px-2 md:px-6 py-2 text-left text-sm md:text-base">Catégorie</th>
                <th className="px-2 md:px-6 py-2 text-left text-sm md:text-base">Stock</th>
                <th className="px-2 md:px-6 py-2 text-left text-sm md:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipments
                .filter((equip) => !selectedCategory || equip.category === selectedCategory)
                .map((equip) => (
                  <tr key={equip.id} className="border-b text-sm md:text-base">
                    <td className="px-2 md:px-6 py-3">{equip.name}</td>
                    <td className="px-2 md:px-6 py-3">{equip.description}</td>
                    <td className="px-2 md:px-6 py-3">{equip.category}</td>
                    <td className="px-2 md:px-6 py-3">{equip.stock}</td>
                    <td className="px-2 md:px-6 py-3">
                      <Button variant="outline" onClick={() => openModal(equip)} className="mr-2">
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
      </main>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentEquipment?.id === 0 ? "Ajouter" : "Modifier"} un Équipement
            </DialogTitle>
            <DialogDescription>
              Complétez le formulaire et cliquez sur Enregistrer.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  value={currentEquipment?.name || ""}
                  onChange={(e) =>
                    setCurrentEquipment((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={currentEquipment?.description || ""}
                  onChange={(e) =>
                    setCurrentEquipment((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select
                  onValueChange={(value) =>
                    setCurrentEquipment((prev) => (prev ? { ...prev, category: value } : prev))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={currentEquipment?.stock || ""}
                  onChange={(e) =>
                    setCurrentEquipment((prev) =>
                      prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : prev
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

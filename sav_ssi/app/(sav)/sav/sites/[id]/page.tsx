"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaCalendarAlt, FaClock, FaFileAlt, FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialEquipments = [
  { id: "1", name: "Équipement 1", system: "Système 1", installationDate: "2023-01-01" },
  { id: "2", name: "Équipement 2", system: "Système 2", installationDate: "2023-02-01" },
];

const systems = ["Système 1", "Système 2", "Système 3"];

const SiteDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [activeTab, setActiveTab] = useState("interventions");
  const [equipments, setEquipments] = useState(initialEquipments);
  const [newEquipment, setNewEquipment] = useState({ name: "", system: "", installationDate: "" });
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleBackClick = () => {
    router.push("/sav/maintenances");
  };

  const handleAddEquipment = () => {
    const newId = (equipments.length + 1).toString();
    setEquipments([...equipments, { id: newId, ...newEquipment }]);
    setNewEquipment({ name: "", system: "", installationDate: "" });
    toast.success("Équipement ajouté avec succès");
  };

  const handleEditEquipment = (id) => {
    const equipment = equipments.find(e => e.id === id);
    setSelectedEquipment(equipment);
  };

  const handleUpdateEquipment = () => {
    setEquipments(equipments.map(e => e.id === selectedEquipment.id ? selectedEquipment : e));
    setSelectedEquipment(null);
    toast.success("Équipement modifié avec succès");
  };

  const handleDeleteEquipment = (id) => {
    setIsDeleteDialogOpen(true);
    setEquipmentToDelete(id);
  };

  const confirmDeleteEquipment = () => {
    setEquipments(equipments.filter(e => e.id !== equipmentToDelete));
    setIsDeleteDialogOpen(false);
    setEquipmentToDelete(null);
    toast.success("Équipement supprimé avec succès");
  };

  const cancelDeleteEquipment = () => {
    setIsDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center mb-4 text-gray-800 hover:underline"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <button className="flex items-center mb-4 bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-lg">
            <FaPlus className="mr-2" />
            Récurrence
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
            <div className="bg-blue-500 p-3 rounded-full mb-2">
              <FaCalendarAlt className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Prochaine maintenance</h3>
            <p className="text-lg font-semibold text-center mt-2">12/12/2023</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
            <div className="bg-blue-500 p-3 rounded-full mb-2">
              <FaClock className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Dernière maintenance</h3>
            <p className="text-lg font-semibold text-center mt-2">10/10/2023</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
            <div className="bg-blue-500 p-3 rounded-full mb-2">
              <FaFileAlt className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Rapports générés</h3>
            <p className="text-lg font-semibold text-center mt-2">5 Rapports</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
          <button
            className={`py-2 px-4 ${activeTab === "interventions" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
            onClick={() => handleTabChange("interventions")}
          >
            Maintenances
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "equipments" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
            onClick={() => handleTabChange("equipments")}
          >
            Équipements
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "details" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
            onClick={() => handleTabChange("details")}
          >
            Détails
          </button>
        </div>

        {activeTab === "interventions" && (
          <div>
            {/* Contenu du tab "Interventions" */}
            <p>Aucune intervention pour l'instant</p>
          </div>
        )}

        {activeTab === "equipments" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-gray-800 font-bold">Équipements</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white flex items-center">
                    <FaPlus className="w-3 h-3 mr-2" />
                    Associer un équipement
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Ajouter un Nouvel Équipement</DialogTitle>
                    <DialogDescription>Entrez les détails du nouvel équipement.</DialogDescription>
                  </DialogHeader>
                  <div>
                    <Input
                      name="name"
                      placeholder="Nom"
                      onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                      value={newEquipment.name}
                      className="mb-4"
                    />
                    <Select
                      value={newEquipment.system}
                      onValueChange={(value) => setNewEquipment({ ...newEquipment, system: value })}
                    >
                      <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Sélectionnez un système" />
                      </SelectTrigger>
                      <SelectContent>
                        {systems.map((system) => (
                          <SelectItem key={system} value={system}>
                            {system}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      name="installationDate"
                      type="date"
                      placeholder="Date d'installation"
                      onChange={(e) => setNewEquipment({ ...newEquipment, installationDate: e.target.value })}
                      value={newEquipment.installationDate}
                      className="mb-4"
                    />
                    <Button onClick={handleAddEquipment} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de l'équipement</TableHead>
                  <TableHead>Nom du système</TableHead>
                  <TableHead>Date d'installation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.map((equipment) => (
                  <TableRow key={equipment.id} className="cursor-pointer">
                    <TableCell>{equipment.name}</TableCell>
                    <TableCell>{equipment.system}</TableCell>
                    <TableCell>{equipment.installationDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditEquipment(equipment.id)} />
                        <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteEquipment(equipment.id)} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedEquipment && (
              <Dialog open={selectedEquipment !== null} onOpenChange={() => setSelectedEquipment(null)}>
                <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Modifier l'Équipement</DialogTitle>
                    <DialogDescription>Modifiez les détails de l'équipement.</DialogDescription>
                  </DialogHeader>
                  <div>
                    <Input
                      name="name"
                      placeholder="Nom"
                      onChange={(e) => setSelectedEquipment({ ...selectedEquipment, name: e.target.value })}
                      value={selectedEquipment.name}
                      className="mb-4"
                    />
                    <Select
                      value={selectedEquipment.system}
                      onValueChange={(value) => setSelectedEquipment({ ...selectedEquipment, system: value })}
                    >
                      <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Sélectionnez un système" />
                      </SelectTrigger>
                      <SelectContent>
                        {systems.map((system) => (
                          <SelectItem key={system} value={system}>
                            {system}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      name="installationDate"
                      type="date"
                      placeholder="Date d'installation"
                      onChange={(e) => setSelectedEquipment({ ...selectedEquipment, installationDate: e.target.value })}
                      value={selectedEquipment.installationDate}
                      className="mb-4"
                    />
                    <div className="flex justify-between">
                      <Button onClick={handleUpdateEquipment} className="bg-blue-500 text-white hover:bg-blue-600">
                        Modifier
                      </Button>
                      <Button onClick={() => handleDeleteEquipment(selectedEquipment.id)} className="bg-red-500 text-white hover:bg-red-600">
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div>
            {/* Contenu du tab "Détails" */}
            <p>Contenu pour Détails</p>
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteEquipment}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirmation de Suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer cet équipement ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button onClick={confirmDeleteEquipment} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </Button>
            <Button onClick={cancelDeleteEquipment} className="bg-gray-500 text-white hover:bg-gray-600">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default SiteDetailsPage;
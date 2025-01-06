"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllEquipements, getEquipementsBySiteId, createInstallationEquipement, updateInstallationEquipement, deleteInstallationEquipement } from "@/actions/sav/equipement";
import { getAllSystemes } from "@/actions/admin/equipement"; // Assurez-vous d'avoir cette fonction pour récupérer les systèmes

const EquipementTab = ({ id }) => {
  const [equipments, setEquipments] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [systemes, setSystemes] = useState([]);
  const [selectedSysteme, setSelectedSysteme] = useState("");
  const [newEquipment, setNewEquipment] = useState({
    idEquipement: "",
    idSysteme: "",
    quantite: 1,
    dateInstallation: "",
    observations: ""
  });
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await getEquipementsBySiteId(parseInt(id));
        setEquipments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipements associés au site:", error);
        toast.error("Erreur lors de la récupération des équipements associés au site");
      }
    };

    const fetchAvailableEquipments = async () => {
      try {
        const data = await getAllEquipements();
        setAvailableEquipments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipements disponibles:", error);
        toast.error("Erreur lors de la récupération des équipements disponibles");
      }
    };

    const fetchSystemes = async () => {
      try {
        const data = await getAllSystemes();
        setSystemes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des systèmes:", error);
        toast.error("Erreur lors de la récupération des systèmes");
      }
    };

    fetchEquipments();
    fetchAvailableEquipments();
    fetchSystemes();
  }, [id]);

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };
  
  const handleAddEquipment = async () => {
    try {
      if (!newEquipment.idEquipement) {
        toast.error("Veuillez sélectionner un équipement");
        return;
      }
      
      if (!isValidDate(newEquipment.dateInstallation)) {
        toast.error("Date d'installation invalide");
        return;
      }
      
      const newEquip = await createInstallationEquipement({
        ...newEquipment,
        idSite: parseInt(id),
        idSysteme: parseInt(selectedSysteme)
      });
      
      setEquipments([...equipments, newEquip]);
      setNewEquipment({
        idEquipement: "",
        idSysteme: "",
        quantite: 1,
        dateInstallation: "",
        observations: ""
      });
      toast.success("Équipement ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement:", error);
      toast.error("Erreur lors de l'ajout de l'équipement");
    }
  };
  const handleEditEquipment = (id) => {
    const equipment = equipments.find(e => e.id === id);
    setSelectedEquipment(equipment);
  };

  const handleUpdateEquipment = async () => {
    try {
      const updatedEquip = await updateInstallationEquipement(selectedEquipment.id, {
        idEquipement: selectedEquipment.idEquipement,
        quantite: selectedEquipment.quantite,
        dateInstallation: selectedEquipment.dateInstallation,
        observations: selectedEquipment.observations,
      });
      setEquipments(equipments.map(e => e.id === selectedEquipment.id ? updatedEquip : e));
      setSelectedEquipment(null);
      toast.success("Équipement modifié avec succès");
    } catch (error) {
      console.error("Erreur lors de la modification de l'équipement:", error);
      toast.error("Erreur lors de la modification de l'équipement");
    }
  };

  const handleDeleteEquipment = (id) => {
    setIsDeleteDialogOpen(true);
    setEquipmentToDelete(id);
  };

  const confirmDeleteEquipment = async () => {
    try {
      if (!equipmentToDelete) {
        toast.error("Aucun équipement sélectionné pour la suppression");
        return;
      }
      
      await deleteInstallationEquipement(equipmentToDelete);
      setEquipments(equipments.filter(e => e.id !== equipmentToDelete));
      setIsDeleteDialogOpen(false);
      setEquipmentToDelete(null);
      toast.success("Équipement supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'équipement");
    }
  };

  const cancelDeleteEquipment = () => {
    setIsDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };

  const handleSystemeChange = (value) => {
    setSelectedSysteme(value);
    setNewEquipment({ ...newEquipment, idEquipement: "" });
  };

  const filteredEquipments = availableEquipments.filter(equip => equip.idSysteme === parseInt(selectedSysteme));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipments = equipments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
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
              <Select
                value={selectedSysteme}
                onValueChange={handleSystemeChange}
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Sélectionnez un système" />
                </SelectTrigger>
                <SelectContent>
                  {systemes.map((systeme) => (
                    <SelectItem key={systeme.id} value={systeme.id}>
                      {systeme.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newEquipment.idEquipement}
                onValueChange={(value) => setNewEquipment({ ...newEquipment, idEquipement: value })}
                disabled={!selectedSysteme}
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Sélectionnez un équipement" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEquipments.map((equip) => (
                    <SelectItem key={equip.id} value={equip.id}>
                      {equip.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="quantite"
                type="number"
                placeholder="Quantité"
                onChange={(e) => setNewEquipment({ ...newEquipment, quantite: Number(e.target.value) })} 
                value={newEquipment.quantite}
                className="mb-4"
              />
              <Input
                name="dateInstallation"
                type="date"
                placeholder="Date d'installation"
                onChange={(e) => setNewEquipment({ ...newEquipment, dateInstallation: e.target.value })}
                value={newEquipment.dateInstallation}
                className="mb-4"
              />
              <Input
                name="observations"
                placeholder="Observations"
                onChange={(e) => setNewEquipment({ ...newEquipment, observations: e.target.value })}
                value={newEquipment.observations}
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
            <TableHead>Quantité</TableHead>
            <TableHead>Date d'installation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEquipments.map((equipment) => (
            <TableRow key={equipment.id} className="cursor-pointer">
              <TableCell>{equipment.Equipement.nom}</TableCell>
              <TableCell>{equipment.quantite}</TableCell>
              <TableCell>{new Date(equipment.dateInstallation).toLocaleDateString()}</TableCell>
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
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(equipments.length / itemsPerPage) }, (_, index) => (
          <Button key={index + 1} onClick={() => paginate(index + 1)} className="mx-1 bg-blue-600">
            {index + 1}
          </Button>
        ))}
      </div>

      {selectedEquipment && (
        <Dialog open={selectedEquipment !== null} onOpenChange={() => setSelectedEquipment(null)}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Modifier l'Équipement</DialogTitle>
              <DialogDescription>Modifiez les détails de l'équipement.</DialogDescription>
            </DialogHeader>
            <div>
              <Select
                value={selectedEquipment.idEquipement}
                onValueChange={(value) => setSelectedEquipment({ ...selectedEquipment, idEquipement: value })}
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Sélectionnez un équipement" />
                </SelectTrigger>
                <SelectContent>
                  {availableEquipments.map((equip) => (
                    <SelectItem key={equip.id} value={equip.id}>
                      {equip.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="quantite"
                type="number"
                placeholder="Quantité"
                onChange={(e) => setSelectedEquipment({ ...selectedEquipment, quantite: Number(e.target.value) })} 
                value={selectedEquipment.quantite}
                className="mb-4"
              />
              <Input
                name="dateInstallation"
                type="date"
                placeholder="Date d'installation"
                onChange={(e) => setSelectedEquipment({ ...selectedEquipment, dateInstallation: e.target.value })} 
                value={selectedEquipment.dateInstallation}
                className="mb-4"
              />
              <Input
                name="observations"
                placeholder="Observations"
                onChange={(e) => setSelectedEquipment({ ...selectedEquipment, observations: e.target.value })} 
                value={selectedEquipment.observations}
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

export default EquipementTab;
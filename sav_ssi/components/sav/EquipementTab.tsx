"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllEquipements, getEquipementsBySiteId, createInstallation, updateInstallationEquipement, deleteInstallationEquipement } from "@/actions/sav/equipement";
import { getAllSystemes } from "@/actions/admin/equipement";

const EquipementTab = ({ id }) => {
  const [equipments, setEquipments] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [systemes, setSystemes] = useState([]);
  const [selectedSysteme, setSelectedSysteme] = useState("");
  const [equipmentSelections, setEquipmentSelections] = useState([]);
  const [installationDate, setInstallationDate] = useState("");
  const [observations, setObservations] = useState("");

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentsData, availableEquipmentsData, systemesData] = await Promise.all([
          getEquipementsBySiteId(parseInt(id)),
          getAllEquipements(),
          getAllSystemes()
        ]);
        setEquipments(equipmentsData);
        setAvailableEquipments(availableEquipmentsData);
        setSystemes(systemesData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, [id]);

  const handleSystemeChange = (value) => {
    setSelectedSysteme(value);
    setEquipmentSelections([]);
  };

  const addEquipmentSelection = () => {
    setEquipmentSelections([...equipmentSelections, { idEquipement: "", quantite: 1 }]);
  };

  const updateEquipmentSelection = (index, field, value) => {
    const newSelections = [...equipmentSelections];
    newSelections[index] = { ...newSelections[index], [field]: value };
    setEquipmentSelections(newSelections);
  };

  const removeEquipmentSelection = (index) => {
    setEquipmentSelections(equipmentSelections.filter((_, i) => i !== index));
  };

  const handleAddEquipments = async () => {
    try {
      // Validate required fields
      if (!selectedSysteme || !installationDate || equipmentSelections.length === 0) {
        toast.error("Veuillez remplir tous les champs requis");
        return;
      }
  
      // Validate equipment selections
      const validSelections = equipmentSelections.every(selection => 
        selection.idEquipement && selection.quantite > 0
      );
      
      if (!validSelections) {
        toast.error("Veuillez compléter tous les équipements");
        return;
      }
  
      // Create single installation with multiple equipment
      const installationData = {
        idSysteme: parseInt(selectedSysteme),
        dateInstallation: installationDate,
        observations: observations || '',
        siteId: parseInt(id),
        equipments: equipmentSelections.map(selection => ({
          idEquipement: parseInt(selection.idEquipement),
          quantite: selection.quantite
        }))
      };
  
      console.log('Installation data:', installationData);
      const result = await createInstallation(installationData);
      
      setEquipments(prev => [...prev, ...result.installationEquipments]);
      
      // Reset form
      setSelectedSysteme("");
      setEquipmentSelections([]);
      setInstallationDate("");
      setObservations("");
      toast.success("Équipements ajoutés avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout des équipements:", error);
      toast.error("Erreur lors de l'ajout des équipements");
    }
  };
  const handleDeleteEquipment = (equipmentId: number) => {
    setEquipmentToDelete(equipmentId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteEquipment = async () => {
    try {
      if (!equipmentToDelete) {
        toast.error("ID d'équipement invalide");
        return;
      }
  
      await deleteInstallationEquipement(equipmentToDelete);
      
      // Refresh equipment list
      const updatedEquipments = equipments.filter(eq => eq.id !== equipmentToDelete);
      setEquipments(updatedEquipments);
      
      toast.success("Équipement supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error.message || "Erreur lors de la suppression de l'équipement");
    }
  };

  const cancelDeleteEquipment = () => {
    setIsDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };
  const filteredEquipments = availableEquipments.filter(
    equip => equip.idSysteme === parseInt(selectedSysteme)
  );

  // Add handleEditEquipment function
const handleEditEquipment = (equipmentId: number) => {
  const equipment = equipments.find(eq => eq.id === equipmentId);
  if (equipment) {
    setSelectedEquipment({
      id: equipment.id,
      idEquipement: equipment.idEquipement,
      quantite: equipment.quantite,
      dateInstallation: new Date(equipment.dateInstallation).toISOString().split('T')[0],
      observations: equipment.Installation.observations || ''
    });
  }
};

// Add handleUpdateEquipment function
const handleUpdateEquipment = async () => {
  try {
    if (!selectedEquipment) return;

    const updatedEquipment = await updateInstallationEquipement(selectedEquipment.id, {
      idEquipement: parseInt(selectedEquipment.idEquipement),
      quantite: selectedEquipment.quantite,
      dateInstallation: selectedEquipment.dateInstallation,
      observations: selectedEquipment.observations
    });

    // Update equipment list
    setEquipments(equipments.map(eq => 
      eq.id === updatedEquipment.id ? { ...updatedEquipment, Equipement: eq.Equipement } : eq
    ));

    setSelectedEquipment(null);
    toast.success("Équipement modifié avec succès");
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    toast.error("Erreur lors de la modification de l'équipement");
  }
};
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
              Associer des équipements
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter de Nouveaux Équipements</DialogTitle>
              <DialogDescription>Sélectionnez les équipements à associer.</DialogDescription>
            </DialogHeader>
            
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

            <Input
              type="date"
              value={installationDate}
              onChange={(e) => setInstallationDate(e.target.value)}
              placeholder="Date d'installation"
              className="mb-4"
            />

            <Input
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observations"
              className="mb-4"
            />

            <div className="space-y-2">
              <Button 
                onClick={addEquipmentSelection} 
                disabled={!selectedSysteme}
                className="mb-4"
              >
                <FaPlus className="mr-2" /> Ajouter un équipement
              </Button>

              {equipmentSelections.map((selection, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Select
                    value={selection.idEquipement}
                    onValueChange={(value) => 
                      updateEquipmentSelection(index, 'idEquipement', value)
                    }
                  >
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Équipement" />
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
                    type="number"
                    value={selection.quantite}
                    onChange={(e) => 
                      updateEquipmentSelection(
                        index, 
                        'quantite', 
                        Number(e.target.value)
                      )
                    }
                    placeholder="Quantité"
                    className="w-24"
                  />
                  
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => removeEquipmentSelection(index)}
                  >
                    <FaTimes />
                  </Button>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleAddEquipments} 
              disabled={equipmentSelections.length === 0}
              className="w-full mt-4"
            >
              Ajouter les équipements
            </Button>
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
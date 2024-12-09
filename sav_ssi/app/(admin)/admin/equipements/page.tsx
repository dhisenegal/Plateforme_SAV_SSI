"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import "react-toastify/dist/ReactToastify.css";
import { getAllEquipements, addEquipement, updateEquipement, deleteEquipement, getAllSystemes, getAllMarques, getAllModeles } from "@/actions/admin/equipement";
import { Equipement, Systeme, Marque, Modele } from "@/types";
import { Label } from '@/components/ui/label';

const EquipementPage = () => {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [filteredEquipements, setFilteredEquipements] = useState<Equipement[]>([]);
  const [systemes, setSystemes] = useState<Systeme[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [newEquipement, setNewEquipement] = useState<Omit<Equipement, 'id'>>({ nom: "", idSysteme: 0, idMarqueSsi: 0, idModeleSsi: 0 });
  const [selectedEquipement, setSelectedEquipement] = useState<Equipement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [equipementToDelete, setEquipementToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSysteme, setFilterSysteme] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const equipements = await getAllEquipements();
      const systemes = await getAllSystemes();
      const marques = await getAllMarques();
      const modeles = await getAllModeles();
      setEquipements(equipements);
      setFilteredEquipements(equipements);
      setSystemes(systemes);
      setMarques(marques);
      setModeles(modeles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterEquipements();
  }, [searchTerm, filterSysteme, equipements]);

  const filterEquipements = () => {
    let filtered = equipements;

    if (searchTerm) {
      filtered = filtered.filter(equipement =>
        equipement.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSysteme) {
      filtered = filtered.filter(equipement => equipement.idSysteme === filterSysteme);
    }

    setFilteredEquipements(filtered);
  };

  const handleAddEquipement = async () => {
    if (newEquipement.nom && newEquipement.idSysteme && newEquipement.idMarqueSsi && newEquipement.idModeleSsi) {
      const createdEquipement = await addEquipement(newEquipement);
      setEquipements([...equipements, createdEquipement]);
      setFilteredEquipements([...equipements, createdEquipement]);
      setNewEquipement({ nom: "", idSysteme: 0, idMarqueSsi: 0, idModeleSsi: 0 });
      toast.success("Équipement ajouté avec succès");
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  const handleEditEquipement = (id: number) => {
    const equipement = equipements.find(e => e.id === id);
    if (equipement) {
      setSelectedEquipement(equipement);
    }
  };

  const handleUpdateEquipement = async () => {
    if (selectedEquipement && selectedEquipement.nom && selectedEquipement.idSysteme && selectedEquipement.idMarqueSsi && selectedEquipement.idModeleSsi) {
      const updatedEquipement = await updateEquipement(selectedEquipement.id, selectedEquipement);
      setEquipements(equipements.map(e => e.id === selectedEquipement.id ? updatedEquipement : e));
      setFilteredEquipements(equipements.map(e => e.id === selectedEquipement.id ? updatedEquipement : e));
      setSelectedEquipement(null);
      toast.success("Équipement modifié avec succès");
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  const handleDeleteEquipement = (id: number) => {
    setIsDeleteDialogOpen(true);
    setEquipementToDelete(id);
  };

  const confirmDeleteEquipement = async () => {
    if (equipementToDelete !== null) {
      await deleteEquipement(equipementToDelete);
      setEquipements(equipements.filter(e => e.id !== equipementToDelete));
      setFilteredEquipements(equipements.filter(e => e.id !== equipementToDelete));
      setIsDeleteDialogOpen(false);
      setEquipementToDelete(null);
      toast.success("Équipement supprimé avec succès");
    }
  };

  const cancelDeleteEquipement = () => {
    setIsDeleteDialogOpen(false);
    setEquipementToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEquipements = filteredEquipements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Gestion des équipements</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Équipement</DialogTitle>
                <DialogDescription>Entrez les détails du nouvel équipement.</DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor='nom'>Nom équipement</Label>
                <Input
                  name="nom"
                  placeholder="Nom"
                  onChange={(e) => setNewEquipement({ ...newEquipement, nom: e.target.value })}
                  value={newEquipement.nom}
                  className="mb-4"
                />
                <Label htmlFor='idSysteme'>Système</Label>
                <Select
                  value={newEquipement.idSysteme.toString()}
                  onValueChange={(value) => setNewEquipement({ ...newEquipement, idSysteme: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un système" />
                  </SelectTrigger>
                  <SelectContent>
                    {systemes.map((systeme) => (
                      <SelectItem key={systeme.id} value={systeme.id.toString()}>
                        {systeme.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor='idMarqueSsi'>Marque</Label>
                <Select
                  value={newEquipement.idMarqueSsi.toString()}
                  onValueChange={(value) => setNewEquipement({ ...newEquipement, idMarqueSsi: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {marques.map((marque) => (
                      <SelectItem key={marque.id} value={marque.id.toString()}>
                        {marque.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor='idModeleSsi'>Modèle</Label>
                <Select
                  value={newEquipement.idModeleSsi.toString()}
                  onValueChange={(value) => setNewEquipement({ ...newEquipement, idModeleSsi: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {modeles.map((modele) => (
                      <SelectItem key={modele.id} value={modele.id.toString()}>
                        {modele.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddEquipement} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select
            value={filterSysteme?.toString() || ""}
            onValueChange={(value) => setFilterSysteme(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par système" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tous les systèmes</SelectItem>
              {systemes.map((systeme) => (
                <SelectItem key={systeme.id} value={systeme.id.toString()}>
                  {systeme.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Système</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEquipements.map((equipement) => (
              <TableRow key={equipement.id}>
                <TableCell>{equipement.nom}</TableCell>
                <TableCell>{systemes.find(systeme => systeme.id === equipement.idSysteme)?.nom}</TableCell>
                <TableCell>{marques.find(marque => marque.id === equipement.idMarqueSsi)?.nom}</TableCell>
                <TableCell>{modeles.find(modele => modele.id === equipement.idModeleSsi)?.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditEquipement(equipement.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteEquipement(equipement.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredEquipements.length / itemsPerPage) }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {selectedEquipement && (
          <Dialog open={selectedEquipement !== null} onOpenChange={() => setSelectedEquipement(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier l'Équipement</DialogTitle>
                <DialogDescription>Modifiez les détails de l'équipement.</DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor='nom'>Nom équipement</Label>
                <Input
                  name="nom"
                  placeholder="Nom"
                  onChange={(e) => setSelectedEquipement({ ...selectedEquipement, nom: e.target.value })}
                  value={selectedEquipement.nom}
                  className="mb-4"
                />
                <Label htmlFor='idSysteme'>Système</Label>
                <Select
                  value={selectedEquipement.idSysteme.toString()}
                  onValueChange={(value) => setSelectedEquipement({ ...selectedEquipement, idSysteme: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un système" />
                  </SelectTrigger>
                  <SelectContent>
                    {systemes.map((systeme) => (
                      <SelectItem key={systeme.id} value={systeme.id.toString()}>
                        {systeme.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor='idMarqueSsi'>Marque</Label>
                <Select
                  value={selectedEquipement.idMarqueSsi.toString()}
                  onValueChange={(value) => setSelectedEquipement({ ...selectedEquipement, idMarqueSsi: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {marques.map((marque) => (
                      <SelectItem key={marque.id} value={marque.id.toString()}>
                        {marque.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor='idModeleSsi'>Modèle</Label>
                <Select
                  value={selectedEquipement.idModeleSsi.toString()}
                  onValueChange={(value) => setSelectedEquipement({ ...selectedEquipement, idModeleSsi: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {modeles.map((modele) => (
                      <SelectItem key={modele.id} value={modele.id.toString()}>
                        {modele.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleUpdateEquipement} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteEquipement}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer cet équipement ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteEquipement} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteEquipement} className="bg-gray-500 text-white hover:bg-gray-600">
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ToastContainer />
    </>
  );
};

export default EquipementPage;
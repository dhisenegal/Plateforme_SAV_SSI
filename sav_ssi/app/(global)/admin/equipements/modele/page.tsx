"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllModeles, addModele, updateModele, deleteModele } from "@/actions/admin/equipement";
import { Modele } from "@/types";

const ModelePage = () => {
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [filteredModeles, setFilteredModeles] = useState<Modele[]>([]);
  const [newModele, setNewModele] = useState<string>("");
  const [selectedModele, setSelectedModele] = useState<Modele | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [modeleToDelete, setModeleToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const modeles = await getAllModeles();
      setModeles(modeles);
      setFilteredModeles(modeles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterModeles();
  }, [searchTerm, modeles]);

  const filterModeles = () => {
    let filtered = modeles;

    if (searchTerm) {
      filtered = filtered.filter(modele =>
        modele.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredModeles(filtered);
  };

  const handleAddModele = async () => {
    const createdModele = await addModele(newModele);
    setModeles([...modeles, createdModele]);
    setFilteredModeles([...modeles, createdModele]);
    setNewModele("");
    toast.success("Modèle ajouté avec succès");
  };

  const handleEditModele = (id: number) => {
    const modele = modeles.find(m => m.id === id);
    if (modele) {
      setSelectedModele(modele);
    }
  };

  const handleUpdateModele = async () => {
    if (selectedModele) {
      const updatedModele = await updateModele(selectedModele.id, { nom: selectedModele.nom });
      setModeles(modeles.map(m => m.id === selectedModele.id ? updatedModele : m));
      setFilteredModeles(modeles.map(m => m.id === selectedModele.id ? updatedModele : m));
      setSelectedModele(null);
      toast.success("Modèle modifié avec succès");
    }
  };

  const handleDeleteModele = (id: number) => {
    setIsDeleteDialogOpen(true);
    setModeleToDelete(id);
  };

  const confirmDeleteModele = async () => {
    if (modeleToDelete !== null) {
      await deleteModele(modeleToDelete);
      setModeles(modeles.filter(m => m.id !== modeleToDelete));
      setFilteredModeles(modeles.filter(m => m.id !== modeleToDelete));
      setIsDeleteDialogOpen(false);
      setModeleToDelete(null);
      toast.success("Modèle supprimé avec succès");
    }
  };

  const cancelDeleteModele = () => {
    setIsDeleteDialogOpen(false);
    setModeleToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedModeles = filteredModeles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Gestion des modèles</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Modèle</DialogTitle>
                <DialogDescription>Entrez le nom du nouveau modèle.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom du modèle"
                  onChange={(e) => setNewModele(e.target.value)}
                  value={newModele}
                  className="mb-4"
                />
                <Button onClick={handleAddModele} className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedModeles.map((modele) => (
              <TableRow key={modele.id}>
                <TableCell>{modele.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditModele(modele.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteModele(modele.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredModeles.length / itemsPerPage) }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {selectedModele && (
          <Dialog open={selectedModele !== null} onOpenChange={() => setSelectedModele(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier le Modèle</DialogTitle>
                <DialogDescription>Modifiez le nom du modèle.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom du modèle"
                  onChange={(e) => setSelectedModele({ ...selectedModele, nom: e.target.value })}
                  value={selectedModele.nom}
                  className="mb-4"
                />
                <Button onClick={handleUpdateModele} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteModele}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer ce modèle ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteModele} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteModele} className="bg-gray-500 text-white hover:bg-gray-600">
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

export default ModelePage;
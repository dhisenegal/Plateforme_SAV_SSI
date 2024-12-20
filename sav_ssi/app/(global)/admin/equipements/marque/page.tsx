"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllMarques, addMarque, updateMarque, deleteMarque } from "@/actions/admin/equipement";
import { Marque } from "@/types";

const MarquePage = () => {
  const [marques, setMarques] = useState<Marque[]>([]);
  const [filteredMarques, setFilteredMarques] = useState<Marque[]>([]);
  const [newMarque, setNewMarque] = useState<string>("");
  const [selectedMarque, setSelectedMarque] = useState<Marque | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [marqueToDelete, setMarqueToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const marques = await getAllMarques();
      setMarques(marques);
      setFilteredMarques(marques);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterMarques();
  }, [searchTerm, marques]);

  const filterMarques = () => {
    let filtered = marques;

    if (searchTerm) {
      filtered = filtered.filter(marque =>
        marque.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMarques(filtered);
  };

  const handleAddMarque = async () => {
    const createdMarque = await addMarque(newMarque);
    setMarques([...marques, createdMarque]);
    setFilteredMarques([...marques, createdMarque]);
    setNewMarque("");
    toast.success("Marque ajoutée avec succès");
  };

  const handleEditMarque = (id: number) => {
    const marque = marques.find(m => m.id === id);
    if (marque) {
      setSelectedMarque(marque);
    }
  };

  const handleUpdateMarque = async () => {
    if (selectedMarque) {
      const updatedMarque = await updateMarque(selectedMarque.id, { nom: selectedMarque.nom });
      setMarques(marques.map(m => m.id === selectedMarque.id ? updatedMarque : m));
      setFilteredMarques(marques.map(m => m.id === selectedMarque.id ? updatedMarque : m));
      setSelectedMarque(null);
      toast.success("Marque modifiée avec succès");
    }
  };

  const handleDeleteMarque = (id: number) => {
    setIsDeleteDialogOpen(true);
    setMarqueToDelete(id);
  };

  const confirmDeleteMarque = async () => {
    if (marqueToDelete !== null) {
      await deleteMarque(marqueToDelete);
      setMarques(marques.filter(m => m.id !== marqueToDelete));
      setFilteredMarques(marques.filter(m => m.id !== marqueToDelete));
      setIsDeleteDialogOpen(false);
      setMarqueToDelete(null);
      toast.success("Marque supprimée avec succès");
    }
  };

  const cancelDeleteMarque = () => {
    setIsDeleteDialogOpen(false);
    setMarqueToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedMarques = filteredMarques.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Gestion des marques</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter une Nouvelle Marque</DialogTitle>
                <DialogDescription>Entrez le nom de la nouvelle marque.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom de la marque"
                  onChange={(e) => setNewMarque(e.target.value)}
                  value={newMarque}
                  className="mb-4"
                />
                <Button onClick={handleAddMarque} className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
            {paginatedMarques.map((marque) => (
              <TableRow key={marque.id}>
                <TableCell>{marque.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditMarque(marque.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteMarque(marque.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredMarques.length / itemsPerPage) }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {selectedMarque && (
          <Dialog open={selectedMarque !== null} onOpenChange={() => setSelectedMarque(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier la Marque</DialogTitle>
                <DialogDescription>Modifiez le nom de la marque.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom de la marque"
                  onChange={(e) => setSelectedMarque({ ...selectedMarque, nom: e.target.value })}
                  value={selectedMarque.nom}
                  className="mb-4"
                />
                <Button onClick={handleUpdateMarque} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteMarque}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer cette marque ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteMarque} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteMarque} className="bg-gray-500 text-white hover:bg-gray-600">
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

export default MarquePage;
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllSystemes, addSysteme, updateSysteme, deleteSysteme } from "@/actions/admin/equipement";
import { Systeme } from "@/types";

const SystemePage = () => {
  const [systemes, setSystemes] = useState<Systeme[]>([]);
  const [filteredSystemes, setFilteredSystemes] = useState<Systeme[]>([]);
  const [newSysteme, setNewSysteme] = useState<string>("");
  const [selectedSysteme, setSelectedSysteme] = useState<Systeme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [systemeToDelete, setSystemeToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const systemes = await getAllSystemes();
      setSystemes(systemes);
      setFilteredSystemes(systemes);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterSystemes();
  }, [searchTerm, systemes]);

  const filterSystemes = () => {
    let filtered = systemes;

    if (searchTerm) {
      filtered = filtered.filter(systeme =>
        systeme.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSystemes(filtered);
  };

  const handleAddSysteme = async () => {
    const createdSysteme = await addSysteme(newSysteme);
    setSystemes([...systemes, createdSysteme]);
    setFilteredSystemes([...systemes, createdSysteme]);
    setNewSysteme("");
    toast.success("Système ajouté avec succès");
  };

  const handleEditSysteme = (id: number) => {
    const systeme = systemes.find(s => s.id === id);
    if (systeme) {
      setSelectedSysteme(systeme);
    }
  };

  const handleUpdateSysteme = async () => {
    if (selectedSysteme) {
      const updatedSysteme = await updateSysteme(selectedSysteme.id, { nom: selectedSysteme.nom });
      setSystemes(systemes.map(s => s.id === selectedSysteme.id ? updatedSysteme : s));
      setFilteredSystemes(systemes.map(s => s.id === selectedSysteme.id ? updatedSysteme : s));
      setSelectedSysteme(null);
      toast.success("Système modifié avec succès");
    }
  };

  const handleDeleteSysteme = (id: number) => {
    setIsDeleteDialogOpen(true);
    setSystemeToDelete(id);
  };

  const confirmDeleteSysteme = async () => {
    if (systemeToDelete !== null) {
      await deleteSysteme(systemeToDelete);
      setSystemes(systemes.filter(s => s.id !== systemeToDelete));
      setFilteredSystemes(systemes.filter(s => s.id !== systemeToDelete));
      setIsDeleteDialogOpen(false);
      setSystemeToDelete(null);
      toast.success("Système supprimé avec succès");
    }
  };

  const cancelDeleteSysteme = () => {
    setIsDeleteDialogOpen(false);
    setSystemeToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedSystemes = filteredSystemes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Gestion des systèmes</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Système</DialogTitle>
                <DialogDescription>Entrez le nom du nouveau système.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom du système"
                  onChange={(e) => setNewSysteme(e.target.value)}
                  value={newSysteme}
                  className="mb-4"
                />
                <Button onClick={handleAddSysteme} className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
            {paginatedSystemes.map((systeme) => (
              <TableRow key={systeme.id}>
                <TableCell>{systeme.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditSysteme(systeme.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteSysteme(systeme.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredSystemes.length / itemsPerPage) }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {selectedSysteme && (
          <Dialog open={selectedSysteme !== null} onOpenChange={() => setSelectedSysteme(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier le Système</DialogTitle>
                <DialogDescription>Modifiez le nom du système.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom du système"
                  onChange={(e) => setSelectedSysteme({ ...selectedSysteme, nom: e.target.value })}
                  value={selectedSysteme.nom}
                  className="mb-4"
                />
                <Button onClick={handleUpdateSysteme} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteSysteme}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer ce système ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteSysteme} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteSysteme} className="bg-gray-500 text-white hover:bg-gray-600">
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

export default SystemePage;
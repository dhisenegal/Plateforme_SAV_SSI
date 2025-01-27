"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllTypeExtincteurs, addTypeExtincteur, updateTypeExtincteur, deleteTypeExtincteur } from "@/actions/admin/equipement";
import { Marque } from "@/types";

const TypePage = () => {
  const [types, setTypes] = useState<Marque[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<Marque[]>([]);
  const [newType, setNewType] = useState<string>("");
  const [selectedType, setSelectedType] = useState<Marque | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const types = await getAllTypeExtincteurs();
      setTypes(types);
      setFilteredTypes(types);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterTypes();
  }, [searchTerm, types]);

  const filterTypes = () => {
    let filtered = types;

    if (searchTerm) {
      filtered = filtered.filter(type =>
        type.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTypes(filtered);
  };

  const handleAddType = async () => {
    const createdType = await addTypeExtincteur(newType);
    setTypes([...types, createdType]);
    setFilteredTypes([...types, createdType]);
    setNewType("");
    toast.success("Type Extincteur ajoutée avec succès");
  };

  const handleEditType = (id: number) => {
    const type = types.find(m => m.id === id);
    if (type) {
      setSelectedType(type);
    }
  };

  const handleUpdateType = async () => {
    if (selectedType) {
      const updatedType = await updateTypeExtincteur(selectedType.id, { nom: selectedType.nom });
      setTypes(types.map(m => m.id === selectedType.id ? updatedType : m));
      setFilteredTypes(types.map(m => m.id === selectedType.id ? updatedType : m));
      setSelectedType(null);
      toast.success("Type Extinteur modifié avec succès");
    }
  };

  const handleDeleteType = (id: number) => {
    setIsDeleteDialogOpen(true);
    setTypeToDelete(id);
  };

  const confirmDeleteType = async () => {
    if (typeToDelete !== null) {
      await deleteTypeExtincteur(typeToDelete);
      setTypes(types.filter(m => m.id !== typeToDelete));
      setFilteredTypes(types.filter(m => m.id !== typeToDelete));
      setIsDeleteDialogOpen(false);
      setTypeToDelete(null);
      toast.success("Type Extincteur supprimé avec succès");
    }
  };

  const cancelDeleteType = () => {
    setIsDeleteDialogOpen(false);
    setTypeToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedTypes = filteredTypes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Gestion des types extincteurs</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter une Nouvelle Type d'Extincteurs</DialogTitle>
                <DialogDescription>Entrez le nom de la nouvelle type.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom de la type"
                  onChange={(e) => setNewType(e.target.value)}
                  value={newType}
                  className="mb-4"
                />
                <Button onClick={handleAddType} className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
            {paginatedTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditType(type.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteType(type.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredTypes.length / itemsPerPage) }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {selectedType && (
          <Dialog open={selectedType !== null} onOpenChange={() => setSelectedType(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier le type</DialogTitle>
                <DialogDescription>Modifiez le nom du type Extincteur.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom du type d'Extincteur"
                  onChange={(e) => setSelectedType({ ...selectedType, nom: e.target.value })}
                  value={selectedType.nom}
                  className="mb-4"
                />
                <Button onClick={handleUpdateType} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteType}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer ce type ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteType} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteType} className="bg-gray-500 text-white hover:bg-gray-600">
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

export default TypePage;
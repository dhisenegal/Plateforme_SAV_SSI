"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllRoles, createRole, updateRole, deleteRole } from "@/actions/admin/utilisateur";
import { Role } from "@/types";

const RolePage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const roles = await getAllRoles();
      setRoles(roles);
    };
    fetchData();
  }, []);

  const handleAddRole = async () => {
    const createdRole = await createRole({ nom: newRole });
    setRoles([...roles, createdRole]);
    setNewRole("");
    toast.success("Rôle ajouté avec succès");
  };

  const handleEditRole = (id: number) => {
    const role = roles.find(r => r.id === id);
    if (role) {
      setSelectedRole(role);
    }
  };

  const handleUpdateRole = async () => {
    if (selectedRole) {
      const updatedRole = await updateRole(selectedRole.id, { nom: selectedRole.nom });
      setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
      setSelectedRole(null);
      toast.success("Rôle modifié avec succès");
    }
  };

  const handleDeleteRole = (id: number) => {
    setIsDeleteDialogOpen(true);
    setRoleToDelete(id);
  };

  const confirmDeleteRole = async () => {
    if (roleToDelete !== null) {
      await deleteRole(roleToDelete);
      setRoles(roles.filter(r => r.id !== roleToDelete));
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
      toast.success("Rôle supprimé avec succès");
    }
  };

  const cancelDeleteRole = () => {
    setIsDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Gestion des rôles</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Rôle</DialogTitle>
                <DialogDescription>Entrez le nom du nouveau rôle.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom du rôle"
                  onChange={(e) => setNewRole(e.target.value)}
                  value={newRole}
                  className="mb-4"
                />
                <Button onClick={handleAddRole} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditRole(role.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteRole(role.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedRole && (
          <Dialog open={selectedRole !== null} onOpenChange={() => setSelectedRole(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier le Rôle</DialogTitle>
                <DialogDescription>Modifiez le nom du rôle.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom du rôle"
                  onChange={(e) => setSelectedRole({ ...selectedRole, nom: e.target.value })}
                  value={selectedRole.nom}
                  className="mb-4"
                />
                <Button onClick={handleUpdateRole} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteRole}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer ce rôle ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteRole} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteRole} className="bg-gray-500 text-white hover:bg-gray-600">
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

export default RolePage;
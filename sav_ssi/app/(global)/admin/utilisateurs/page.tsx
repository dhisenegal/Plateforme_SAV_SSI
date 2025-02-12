"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import "react-toastify/dist/ReactToastify.css";
import { getAllUsers, createUser, updateUser, deleteUser, getAllRoles, updateUserPassword } from "@/actions/admin/utilisateur";
import { Utilisateur, Role } from "@/types";

const UtilisateurPage = () => {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [newUser, setNewUser] = useState<Omit<Utilisateur, 'id'>>({ login: "", password: "", nom: "", prenom: "", numero: "", email: "", idRole: 0 });
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRole, setFilterRole] = useState<number | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers();
      const roles = await getAllRoles();
      setUsers(users);
      setRoles(roles);
    };
    fetchData();
  }, []);

  const handleAddUser = async () => {
    const createdUser = await createUser(newUser);
    setUsers([...users, createdUser]);
    setNewUser({ login: "", password: "", nom: "", prenom: "", numero: "", email: "", idRole: 0 });
    toast.success("Utilisateur ajouté avec succès");
  };

  const handleEditUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      const updatedUser = await updateUser(selectedUser.id, selectedUser);
      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
      setSelectedUser(null);
      toast.success("Utilisateur modifié avec succès");
    }
  };

  const handleDeleteUser = (id: number) => {
    setIsDeleteDialogOpen(true);
    setUserToDelete(id);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete !== null) {
      await deleteUser(userToDelete);
      setUsers(users.filter(u => u.id !== userToDelete));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      toast.success("Utilisateur supprimé avec succès");
    }
  };

  const cancelDeleteUser = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleResetPassword = (id: number) => {
    setUserToResetPassword(id);
    setIsResetPasswordDialogOpen(true);
  };

  const confirmResetPassword = async () => {
    if (userToResetPassword !== null && newPassword) {
      await updateUserPassword(userToResetPassword, newPassword);
      setIsResetPasswordDialogOpen(false);
      setUserToResetPassword(null);
      setNewPassword("");
      toast.success("Mot de passe réinitialisé avec succès");
    }
  };

  const cancelResetPassword = () => {
    setIsResetPasswordDialogOpen(false);
    setUserToResetPassword(null);
    setNewPassword("");
  };

  const filteredUsers = users.filter(user => {
    return (
      user.login.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole ? user.idRole === filterRole : true)
    );
  });

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Gestion des utilisateurs</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Utilisateur</DialogTitle>
                <DialogDescription>Entrez les détails du nouvel utilisateur.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="login"
                  placeholder="Login"
                  onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                  value={newUser.login}
                  className="mb-4"
                />
                <div className="relative mb-4">
                  <Input
                    name="password"
                    placeholder="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    value={newUser.password}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <Input
                  name="nom"
                  placeholder="Nom"
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                  value={newUser.nom}
                  className="mb-4"
                />
                <Input
                  name="prenom"
                  placeholder="Prénom"
                  onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                  value={newUser.prenom}
                  className="mb-4"
                />
                <Input
                  name="numero"
                  placeholder="Numéro"
                  onChange={(e) => setNewUser({ ...newUser, numero: e.target.value })}
                  value={newUser.numero}
                  className="mb-4"
                />
                <Input
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  value={newUser.email}
                  className="mb-4"
                />
                <Select
                  value={newUser.idRole.toString()}
                  onValueChange={(value) => setNewUser({ ...newUser, idRole: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddUser} className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
            value={filterRole?.toString() || ""}
            onValueChange={(value) => setFilterRole(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tous les rôles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Login</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Numéro</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.login}</TableCell>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.numero}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{roles.find(role => role.id === user.idRole)?.nom}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditUser(user.id)} />
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteUser(user.id)} />
                    <FaKey className="text-green-500 cursor-pointer" onClick={() => handleResetPassword(user.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedUser && (
          <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier l'Utilisateur</DialogTitle>
                <DialogDescription>Modifiez les détails de l'utilisateur.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="login"
                  placeholder="Login"
                  onChange={(e) => setSelectedUser({ ...selectedUser, login: e.target.value })}
                  value={selectedUser.login}
                  className="mb-4"
                />
                <Input
                  name="nom"
                  placeholder="Nom"
                  onChange={(e) => setSelectedUser({ ...selectedUser, nom: e.target.value })}
                  value={selectedUser.nom}
                  className="mb-4"
                />
                <Input
                  name="prenom"
                  placeholder="Prénom"
                  onChange={(e) => setSelectedUser({ ...selectedUser, prenom: e.target.value })}
                  value={selectedUser.prenom}
                  className="mb-4"
                />
                <Input
                  name="numero"
                  placeholder="Numéro"
                  onChange={(e) => setSelectedUser({ ...selectedUser, numero: e.target.value })}
                  value={selectedUser.numero}
                  className="mb-4"
                />
                <Input
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  value={selectedUser.email}
                  className="mb-4"
                />
                <Select
                  value={selectedUser.idRole.toString()}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, idRole: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleUpdateUser} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteUser}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <Button onClick={confirmDeleteUser} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
              <Button onClick={cancelDeleteUser} className="bg-gray-500 text-white hover:bg-gray-600">
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isResetPasswordDialogOpen} onOpenChange={cancelResetPassword}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Réinitialiser le Mot de Passe</DialogTitle>
              <DialogDescription>Entrez le nouveau mot de passe pour l'utilisateur.</DialogDescription>
            </DialogHeader>
            <div>
              <Input
                name="newPassword"
                placeholder="Nouveau mot de passe"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className="mb-4"
              />
              <div className="flex justify-between">
                <Button onClick={confirmResetPassword} className="bg-blue-500 text-white hover:bg-blue-600">
                  Réinitialiser
                </Button>
                <Button onClick={cancelResetPassword} className="bg-gray-500 text-white hover:bg-gray-600">
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ToastContainer />
    </>
  );
};

export default UtilisateurPage;
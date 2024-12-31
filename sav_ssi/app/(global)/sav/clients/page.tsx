"use client";

import React, { useState, useEffect } from "react";
import { getClients, addClient, deleteClient, updateClient } from "@/actions/sav/client";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface Client {
  id: number;
  nom: string;
  secteurDactivite: string;
}

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nom, setNom] = useState<string>("");
  const [secteurDactivite, setSecteurDactivite] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientsPerPage] = useState<number>(10);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des clients");
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = async () => {
    try {
      const newClient = await addClient(nom, secteurDactivite);
      setClients((prevClients) => [...prevClients, newClient]);
      setShowForm(false);
      setNom("");
      setSecteurDactivite("");
      toast.success("Client ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du client");
    }
  };

  const handleUpdateClient = async () => {
    if (currentClientId !== null) {
      try {
        const updatedClient = await updateClient(currentClientId, { nom, secteurDactivite });
        setClients((prevClients) =>
          prevClients.map((client) => (client.id === currentClientId ? updatedClient : client))
        );
        setShowForm(false);
        setNom("");
        setSecteurDactivite("");
        setIsEditing(false);
        toast.success("Client modifié avec succès");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du client");
      }
    }
  };

  const handleDeleteClient = async () => {
    if (clientToDelete !== null) {
      try {
        await deleteClient(clientToDelete);
        setClients(clients.filter((client) => client.id !== clientToDelete));
        setShowDeleteDialog(false);
        setClientToDelete(null);
        toast.success("Client supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression du client");
      }
    }
  };

  const handleViewDetails = (clientId: number) => {
    router.push(`/sav/clients/${clientId}`);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClientId(client.id);
    setNom(client.nom);
    setSecteurDactivite(client.secteurDactivite);
    setIsEditing(true);
    setShowForm(true);
  };

  const handlePrepareDeleteClient = (clientId: number) => {
    setClientToDelete(clientId);
    setShowDeleteDialog(true);
  };

  const filteredClients = clients.filter((client) =>
    client.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white flex items-center">
              <FaPlus className="mr-2" />
              {isEditing ? "Modifier Client" : "Ajouter Client"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Modifier le Client" : "Ajouter un Nouveau Client"}</DialogTitle>
              <DialogDescription>Entrez les détails du client.</DialogDescription>
            </DialogHeader>
            <form onSubmit={isEditing ? handleUpdateClient : handleAddClient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Nom du client"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="secteurDactivite">Secteur d'activité</Label>
                  <Input
                    id="secteurDactivite"
                    value={secteurDactivite}
                    onChange={(e) => setSecteurDactivite(e.target.value)}
                    placeholder="Secteur d'activité"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white w-full">
                  {isEditing ? "Modifier" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="text"
          placeholder="Rechercher un client"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Secteur d'activité</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentClients.map((client) => (
            <TableRow key={client.id} className="cursor-pointer hover:bg-blue-100">
              <TableCell>{client.nom}</TableCell>
              <TableCell>{client.secteurDactivite}</TableCell>
              <TableCell className="flex space-x-2 justify-center">
                <FaEye className="text-blue-500 cursor-pointer" onClick={() => handleViewDetails(client.id)} />
                <FaEdit className="text-yellow-500 cursor-pointer" onClick={() => handleEditClient(client)} />
                <FaTrash className="text-red-500 cursor-pointer" onClick={() => handlePrepareDeleteClient(client.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          Total: {filteredClients.length} client(s)
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmation de Suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer ce client ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button onClick={handleDeleteClient} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </Button>
            <Button onClick={() => setShowDeleteDialog(false)} className="bg-gray-500 text-white hover:bg-gray-600">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default ClientsPage;
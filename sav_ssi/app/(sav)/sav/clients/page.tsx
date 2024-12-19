"use client";

import React, { useState, useEffect } from "react";
import { getClients, addClient, deleteClient, updateClient } from "@/actions/sav/client";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
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

  // Récupérer les clients au chargement
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        toast.error("Erreur lors de la récupération des clients");
      }
    };
    fetchClients();
  }, []);

  // Ajouter un client
  const handleAddClient = async () => {
    try {
      const newClient = await addClient(nom, secteurDactivite);
      setClients((prevClients) => [...prevClients, newClient]);
      setShowForm(false); // Hide the form after adding a client
      setNom("");
      setSecteurDactivite("");
      toast.success("Client ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      toast.error("Erreur lors de l'ajout du client");
    }
  };

  // Modifier un client
  const handleUpdateClient = async () => {
    if (currentClientId !== null) {
      try {
        const updatedClient = await updateClient(currentClientId, { nom, secteurDactivite });
        setClients((prevClients) =>
          prevClients.map((client) => (client.id === currentClientId ? updatedClient : client))
        );
        setShowForm(false); // Hide the form after updating a client
        setNom("");
        setSecteurDactivite("");
        setIsEditing(false);
        toast.success("Client modifié avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du client:", error);
        toast.error("Erreur lors de la mise à jour du client");
      }
    }
  };

  // Supprimer un client
  const handleDeleteClient = async () => {
    if (clientToDelete !== null) {
      try {
        await deleteClient(clientToDelete);
        setClients(clients.filter((client) => client.id !== clientToDelete));
        setShowDeleteDialog(false);
        setClientToDelete(null);
        toast.success("Client supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
        toast.error("Erreur lors de la suppression du client");
      }
    }
  };

  // Afficher les détails d'un client
  const handleViewDetails = (clientId: number) => {
    router.push(`/sav/clients/${clientId}`);
  };

  // Préparer le formulaire pour l'édition
  const handleEditClient = (client: Client) => {
    setCurrentClientId(client.id);
    setNom(client.nom);
    setSecteurDactivite(client.secteurDactivite);
    setIsEditing(true);
    setShowForm(true);
  };

  // Préparer la suppression d'un client
  const handlePrepareDeleteClient = (clientId: number) => {
    setClientToDelete(clientId);
    setShowDeleteDialog(true);
  };

  // Filtrer les clients en fonction de la recherche
  const filteredClients = clients.filter((client) =>
    client.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gestion des Clients</h1>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white">
              {isEditing ? "Modifier Client" : "Ajouter Client"}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Modifier le Client" : "Ajouter un Nouveau Client"}</DialogTitle>
              <DialogDescription>Entrez les détails du client.</DialogDescription>
            </DialogHeader>
            <div>
              <label className="block mb-2">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <label className="block mb-2">Secteur d'activité</label>
              <input
                type="text"
                value={secteurDactivite}
                onChange={(e) => setSecteurDactivite(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <Button onClick={isEditing ? handleUpdateClient : handleAddClient} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                {isEditing ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <input
        type="text"
        placeholder="Rechercher un client"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left border-b">Nom</th>
            <th className="py-2 px-4 text-left border-b">Secteur d'activité</th>
            <th className="py-2 px-4 text-center border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{client.nom}</td>
              <td className="py-2 px-4 border-b">{client.secteurDactivite}</td>
              <td className="py-2 px-4 border-b text-center">
                <div className="flex justify-center space-x-2">
                  <FaEye className="text-blue-500 cursor-pointer" onClick={() => handleViewDetails(client.id)} />
                  <FaEdit className="text-yellow-500 cursor-pointer" onClick={() => handleEditClient(client)} />
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handlePrepareDeleteClient(client.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
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
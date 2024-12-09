"use client";

import React, { useState, useEffect } from "react";
import { getAllSystemes, getClients, addClient, deleteClient, getClientById, addSiteToClient, addContactToClient, addInstallationToSite, addEquipementToInstallation } from "@/actions/client";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import ClientForm from "@/components/sav/ClientForm";
import SiteForm from "@/components/sav/SiteForm";
import ContactForm from "@/components/sav/ContactForm";
import InstallationForm from "@/components/sav/InstallationForm";
import ClientDetailsModal from "@/components/sav/ClientDetailsModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nom, setNom] = useState<string>("");
  const [secteurDactivite, setSecteurDactivite] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showSiteForm, setShowSiteForm] = useState<boolean>(false);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [showInstallationForm, setShowInstallationForm] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [currentClientDetails, setCurrentClientDetails] = useState<Client | null>(null);
  const [systemes, setSystemes] = useState<Systeme[]>([]);

  // Récupérer les clients au chargement
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      }
    };
    fetchClients();
  }, []);

  // Récupérer les systèmes au chargement
  useEffect(() => {
    const fetchSystemes = async () => {
      try {
        const data = await getAllSystemes();
        setSystemes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des systèmes:", error);
      }
    };
    fetchSystemes();
  }, []);

  // Ajouter un client
  const handleAddClient = async (nom: string, secteurDactivite: string) => {
    try {
      const newClient = await addClient(nom, secteurDactivite);
      setClients((prevClients) => [...prevClients, newClient]);
      setShowForm(false); // Hide the form after adding a client
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
    }
  };

  // Ajouter un site
  const handleAddSite = async (nomSite: string) => {
    if (currentClientId) {
      try {
        const newSite = await addSiteToClient(currentClientId, nomSite);
        setShowSiteForm(false); // Hide the form after adding a site
      } catch (error) {
        console.error("Erreur lors de l'ajout du site:", error);
      }
    } else {
      alert("Tous les champs sont obligatoires");
    }
  };

  // Ajouter un contact
  const handleAddContact = async (nomResponsable: string, idUtilisateur: number) => {
    if (currentClientId) {
      try {
        const newContact = await addContactToClient(currentClientId, nomResponsable, idUtilisateur);
        setShowContactForm(false); // Hide the form after adding a contact
      } catch (error) {
        console.error("Erreur lors de l'ajout du contact:", error);
      }
    } else {
      alert("Tous les champs sont obligatoires");
    }
  };

  // Ajouter une installation
  const handleAddInstallation = async (dateInstallation: string, observations: string, idSysteme: number, selectedEquipements: { id: number, quantite: number }[]) => {
    if (currentClientId) {
      try {
        console.log("Adding installation with the following details:");
        console.log("Date Installation:", dateInstallation);
        console.log("Observations:", observations);
        console.log("ID Systeme:", idSysteme);
        console.log("Selected Equipements:", selectedEquipements);

        const newInstallation = await addInstallationToSite(currentClientId, new Date(dateInstallation), observations, currentClientId, idSysteme);
        setShowInstallationForm(false); // Hide the form after adding an installation

        // Ajouter les équipements sélectionnés à l'installation
        for (const equipement of selectedEquipements) {
          if (equipement.quantite === undefined || equipement.quantite === null) {
            console.error("Quantité manquante pour l'équipement:", equipement);
            continue;
          }
          console.log("Adding equipement to installation:", {
            installationId: newInstallation.id,
            equipementId: equipement.id,
            quantite: equipement.quantite,
          });
          const newEquipement = await addEquipementToInstallation(newInstallation.id, equipement.id, equipement.quantite);
          console.log("Equipement ajouté avec succès:", newEquipement);
    
        }
      } catch (error) {
        console.log("Erreur lors de l'ajout de l'installation:", error);
      }
    } else {
      alert("Tous les champs sont obligatoires");
    }
  };

  // Supprimer un client
  const handleDeleteClient = async (clientId: number) => {
    try {
      await deleteClient(clientId);
      setClients(clients.filter((client) => client.id !== clientId));
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
    }
  };

  // Afficher les détails d'un client
  const handleViewDetails = async (clientId: number) => {
    try {
      const clientDetails = await getClientById(clientId);
      setCurrentClientDetails(clientDetails);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du client:", error);
    }
  };

  // Filtrer les clients en fonction de la recherche
  const filteredClients = clients.filter((client) =>
    client.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gestion des Clients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Ajouter Client
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher un client"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {showForm && (
        <ClientForm
          onSubmit={handleAddClient}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showSiteForm && (
        <SiteForm
          onSubmit={handleAddSite}
          onCancel={() => setShowSiteForm(false)}
        />
      )}

      {showContactForm && (
        <ContactForm
          onSubmit={handleAddContact}
          onCancel={() => setShowContactForm(false)}
        />
      )}

      {showInstallationForm && (
        <InstallationForm
          onSubmit={handleAddInstallation}
          onCancel={() => setShowInstallationForm(false)}
          systemes={systemes}
        />
      )}

      {showDetailsModal && currentClientDetails && (
        <ClientDetailsModal
          client={currentClientDetails}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left border-b">Nom</th>
            <th className="py-2 px-4 text-left border-b">Secteur d'activité</th>
            <th className="py-2 px-4 text-center border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{client.nom}</td>
              <td className="py-2 px-4 border-b">{client.secteurDactivite}</td>
              <td className="py-2 px-4 border-b text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="p-2 bg-gray-200 rounded cursor-pointer">Actions</div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleViewDetails(client.id)}>
                      <FaEye className="mr-2" /> Afficher
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setCurrentClientId(client.id); setShowSiteForm(true); }}>
                      <FaEdit className="mr-2" /> Ajouter Site
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setCurrentClientId(client.id); setShowContactForm(true); }}>
                      <FaEdit className="mr-2" /> Ajouter Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setCurrentClientId(client.id); setShowInstallationForm(true); }}>
                      <FaEdit className="mr-2" /> Ajouter Installation
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDeleteClient(client.id)}>
                      <FaTrash className="mr-2" /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsPage;
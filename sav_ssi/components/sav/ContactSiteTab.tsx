"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSiteContacts, createContact, updateContact, deleteContact } from "@/actions/sav/contact";
import { ContactSite } from "@/types";

const ContactSiteTab = ({ id }: { id: number }) => {
  const [contacts, setContacts] = useState<ContactSite[]>([]);
  const [newContact, setNewContact] = useState({
    nom: "",
    prenom: "",
    numero: "",
    email: "",
    estManager: false,
  });
  const [selectedContact, setSelectedContact] = useState<ContactSite | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteContacts = async () => {
      try {
        const data = await getSiteContacts(id);
        console.log("Contacts récupérés:", JSON.stringify(data, null, 2));
        setContacts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts du site:", error);
        toast.error("Erreur lors de la récupération des contacts du site.");
      }
    };

    fetchSiteContacts();
  }, [id]);

  const handleAddContact = async () => {
    try {
      const newContactData = await createContact({ ...newContact, idSite: id });
      console.log("Nouveau contact ajouté:", newContactData);
      setContacts([...contacts, newContactData]);
      setNewContact({
        nom: "",
        prenom: "",
        numero: "",
        email: "",
        estManager: false,
      });
      toast.success("Contact ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact:", error);
      toast.error("Erreur lors de l'ajout du contact");
    }
  };

  const handleEditContact = (id: number) => {
    const contact = contacts.find(c => c.id === id);
    console.log("Contact sélectionné pour modification:", contact);
    setSelectedContact(contact || null);
  };

  const handleUpdateContact = async () => {
    try {
      if (selectedContact) {
        const updatedContact = await updateContact(selectedContact.id, {
          nom: selectedContact.Contact?.Utilisateur.nom || "",
          prenom: selectedContact.Contact?.Utilisateur.prenom || "",
          numero: selectedContact.Contact?.Utilisateur.numero || "",
          email: selectedContact.Contact?.Utilisateur.email || "",
          estManager: selectedContact.estManager || false,
        });
        console.log("Contact mis à jour:", updatedContact);
        setContacts(contacts.map(c => c.id === selectedContact.id ? updatedContact : c));
        setSelectedContact(null);
        toast.success("Contact modifié avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la modification du contact:", error);
      toast.error("Erreur lors de la modification du contact");
    }
  };

  const handleDeleteContact = (id: number) => {
    setIsDeleteDialogOpen(true);
    setContactToDelete(id);
  };

  const confirmDeleteContact = async () => {
    try {
      if (contactToDelete !== null) {
        const deletedContact = await deleteContact(contactToDelete);
        console.log("Contact supprimé:", deletedContact);
        setContacts(contacts.filter(c => c.id !== contactToDelete));
        setIsDeleteDialogOpen(false);
        setContactToDelete(null);
        toast.success("Contact supprimé avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      toast.error("Erreur lors de la suppression du contact");
    }
  };

  const cancelDeleteContact = () => {
    setIsDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-800 font-bold">Contacts du Site</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white flex items-center">
              <FaPlus className="w-3 h-3 mr-2" />
              Ajouter un contact
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Contact</DialogTitle>
              <DialogDescription>Entrez les détails du nouveau contact.</DialogDescription>
            </DialogHeader>
            <div>
              <Input
                name="nom"
                placeholder="Nom"
                onChange={(e) => setNewContact({ ...newContact, nom: e.target.value })}
                value={newContact.nom}
                className="mb-4"
              />
              <Input
                name="prenom"
                placeholder="Prénom"
                onChange={(e) => setNewContact({ ...newContact, prenom: e.target.value })}
                value={newContact.prenom}
                className="mb-4"
              />
              <Input
                name="numero"
                placeholder="Numéro"
                onChange={(e) => setNewContact({ ...newContact, numero: e.target.value })}
                value={newContact.numero}
                className="mb-4"
              />
              <Input
                name="email"
                placeholder="Email"
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                value={newContact.email}
                className="mb-4"
              />
              <label className="mb-4">
                <input
                  type="checkbox"
                  checked={newContact.estManager}
                  onChange={(e) => setNewContact({ ...newContact, estManager: e.target.checked })}
                />
                Est Manager
              </label>
              <Button onClick={handleAddContact} className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map(contactsite => (
            <TableRow key={contactsite.id} className="cursor-pointer">
              <TableCell>{contactsite.Contact?.Utilisateur.nom || "N/A"}</TableCell>
              <TableCell>{contactsite.Contact?.Utilisateur.email || "N/A"}</TableCell>
              <TableCell>{contactsite.Contact?.Utilisateur.numero || "N/A"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditContact(contactsite.id)} />
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteContact(contactsite.id)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedContact && (
        <Dialog open={selectedContact !== null} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Modifier le Contact</DialogTitle>
              <DialogDescription>Modifiez les détails du contact.</DialogDescription>
            </DialogHeader>
            <div>
              <Input
                name="nom"
                placeholder="Nom"
                onChange={(e) => setSelectedContact({ ...selectedContact, Contact: { ...selectedContact.Contact, Utilisateur: { ...selectedContact.Contact.Utilisateur, nom: e.target.value } } })}
                value={selectedContact.Contact?.Utilisateur.nom || ""}
                className="mb-4"
              />
              <Input
                name="prenom"
                placeholder="Prénom"
                onChange={(e) => setSelectedContact({ ...selectedContact, Contact: { ...selectedContact.Contact, Utilisateur: { ...selectedContact.Contact.Utilisateur, prenom: e.target.value } } })}
                value={selectedContact.Contact?.Utilisateur.prenom || ""}
                className="mb-4"
              />
              <Input
                name="numero"
                placeholder="Numéro"
                onChange={(e) => setSelectedContact({ ...selectedContact, Contact: { ...selectedContact.Contact, Utilisateur: { ...selectedContact.Contact.Utilisateur, numero: e.target.value } } })}
                value={selectedContact.Contact?.Utilisateur.numero || ""}
                className="mb-4"
              />
              <Input
                name="email"
                placeholder="Email"
                onChange={(e) => setSelectedContact({ ...selectedContact, Contact: { ...selectedContact.Contact, Utilisateur: { ...selectedContact.Contact.Utilisateur, email: e.target.value } } })}
                value={selectedContact.Contact?.Utilisateur.email || ""}
                className="mb-4"
              />
              <label className="mb-4">
                <input
                  type="checkbox"
                  checked={selectedContact.estManager || false}
                  onChange={(e) => setSelectedContact({ ...selectedContact, estManager: e.target.checked })}
                />
                Est Manager
              </label>
              <div className="flex justify-between">
                <Button onClick={handleUpdateContact} className="bg-blue-500 text-white hover:bg-blue-600">
                  Modifier
                </Button>
                <Button onClick={() => handleDeleteContact(selectedContact.id)} className="bg-red-500 text-white hover:bg-red-600">
                  Supprimer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteContact}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirmation de Suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer ce contact ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button onClick={confirmDeleteContact} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </Button>
            <Button onClick={cancelDeleteContact} className="bg-gray-500 text-white hover:bg-gray-600">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ContactSiteTab;
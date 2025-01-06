"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaPause, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllContrats, createContrat, updateContrat, deleteContrat, getAllClients, getSitesByClientId } from "@/actions/sav/contrat";

const contractTypes = ["Préventive", "Curative"];

const ContratPage = () => {
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [newContract, setNewContract] = useState({ nom: "", client: "", site: "", startDate: "", endDate: "", periodicite: "", typeContrat: "", pieceMainDoeuvre: false });
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalContracts, setTotalContracts] = useState(0);

  useEffect(() => {
    const fetchContracts = async () => {
      const { contrats, total } = await getAllContrats(currentPage, itemsPerPage);
      setContracts(contrats);
      setTotalContracts(total);
    };
    fetchContracts();
    setLoading(false);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getAllClients();
      setClients(data);
    };
    fetchClients();
  }, []);

  const handleClientChange = async (clientId) => {
    setNewContract({ ...newContract, client: clientId });
    const data = await getSitesByClientId(clientId);
    setSites(data);
  };

  const handleAddContract = async () => {
    try {
      const newContractData = {
        nom: newContract.nom,
        dateDebut: new Date(newContract.startDate),
        dateFin: newContract.endDate ? new Date(newContract.endDate) : null,
        periodicite: newContract.periodicite,
        typeContrat: newContract.typeContrat,
        pieceMainDoeuvre: newContract.pieceMainDoeuvre,
        idSite: parseInt(newContract.site),
      };
      const createdContract = await createContrat(newContractData);
      setContracts([...contracts, createdContract]);
      setNewContract({ nom: "", client: "", site: "", startDate: "", endDate: "", periodicite: "", typeContrat: "", pieceMainDoeuvre: false });
      toast.success("Contrat ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du contrat");
    }
  };

  const handleEditContract = (id) => {
    const contract = contracts.find(c => c.id === id);
    setSelectedContract(contract);
    handleClientChange(contract.clientId);
  };

  const handleUpdateContract = async () => {
    try {
      const updatedContractData = {
        nom: selectedContract.nom,
        dateDebut: new Date(selectedContract.startDate),
        dateFin: selectedContract.endDate ? new Date(selectedContract.endDate) : null,
        periodicite: selectedContract.periodicite,
        typeContrat: selectedContract.typeContrat,
        pieceMainDoeuvre: selectedContract.pieceMainDoeuvre,
        idSite: parseInt(selectedContract.site),
      };
      const updatedContract = await updateContrat(selectedContract.id, updatedContractData);
      setContracts(contracts.map(c => c.id === selectedContract.id ? updatedContract : c));
      setSelectedContract(null);
      toast.success("Contrat modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification du contrat");
    }
  };

  const handleDeleteContract = (id) => {
    setIsDeleteDialogOpen(true);
    setContractToDelete(id);
  };

  const confirmDeleteContract = async () => {
    try {
      await deleteContrat(contractToDelete);
      setContracts(contracts.filter(c => c.id !== contractToDelete));
      setIsDeleteDialogOpen(false);
      setContractToDelete(null);
      toast.success("Contrat supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du contrat");
    }
  };

  const cancelDeleteContract = () => {
    setIsDeleteDialogOpen(false);
    setContractToDelete(null);
  };

  const handleRenewContract = (id) => {
    // Logic to renew contract
  };

  const handleSuspendContract = (id) => {
    // Logic to suspend contract
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
  };

  const totalPages = Math.ceil(totalContracts / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
    if(loading){
      return (
        <div className="flex items-center justify-center gap-3">
          Chargement en cours...
        </div>
      );
    }
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-800 font-bold">Contrats</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 text-white flex items-center">
                <FaPlus className="w-3 h-3 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Contrat</DialogTitle>
                <DialogDescription>Entrez les détails du nouveau contrat.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="nom"
                  placeholder="Nom"
                  onChange={(e) => setNewContract({ ...newContract, nom: e.target.value })}
                  value={newContract.nom}
                  className="mb-4"
                />
                <Select
                  value={newContract.client}
                  onValueChange={handleClientChange}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newContract.site}
                  onValueChange={(value) => setNewContract({ ...newContract, site: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  name="startDate"
                  type="date"
                  placeholder="Date de début"
                  onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                  value={newContract.startDate}
                  className="mb-4"
                />
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  name="endDate"
                  type="date"
                  placeholder="Date de fin"
                  onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                  value={newContract.endDate}
                  className="mb-4"
                  disabled={newContract.typeContrat === "Tacite"}
                />
                <Select
                  value={newContract.periodicite}
                  onValueChange={(value) => setNewContract({ ...newContract, periodicite: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez une périodicité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                    <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                    <SelectItem value="Annuelle">Annuelle</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newContract.typeContrat}
                  onValueChange={(value) => setNewContract({ ...newContract, typeContrat: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newContract.typeContrat === "Curative" && (
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="pieceMainDoeuvre"
                      checked={newContract.pieceMainDoeuvre}
                      onChange={(e) => setNewContract({ ...newContract, pieceMainDoeuvre: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="pieceMainDoeuvre">Inclut pièces et main d'œuvre</label>
                  </div>
                )}
                <Button onClick={handleAddContract} className="w-full bg-blue-500 text-white hover:bg-blue-600">
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
          <TableHead>Client</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Date de début</TableHead>
          <TableHead>Date de fin</TableHead>
          <TableHead>Périodicité</TableHead>
          <TableHead>Type de contrat</TableHead>
          <TableHead>Inclut pièces et main d'œuvre</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((contract) => (
          <TableRow key={contract.id} className="cursor-pointer">
            <TableCell>{contract.nom}</TableCell>
            <TableCell>{contract.Site.Client.nom}</TableCell>
            <TableCell>{contract.Site.nom}</TableCell>
            <TableCell>{new Date(contract.dateDebut).toLocaleDateString()}</TableCell>
            <TableCell>{contract.dateFin ? new Date(contract.dateFin).toLocaleDateString() : "Tacite"}</TableCell>
            <TableCell>{contract.periodicite}</TableCell>
            <TableCell>{contract.typeContrat}</TableCell>
            <TableCell>{contract.pieceMainDoeuvre ? "Oui" : "Non"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditContract(contract.id)} />
                <FaSyncAlt className="text-green-500 cursor-pointer" onClick={() => handleRenewContract(contract.id)} />
                <FaPause className="text-yellow-500 cursor-pointer" onClick={() => handleSuspendContract(contract.id)} />
                <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteContract(contract.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <div className="flex justify-end items-center mt-4 gap-2">
      <span>
        Page {currentPage} / {totalPages}
      </span>
      <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-blue-500">
        <FaArrowLeft />
      </Button>
      <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500">
        <FaArrowRight />
      </Button>
    </div>

    {selectedContract && (
      <Dialog open={selectedContract !== null} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Modifier le Contrat</DialogTitle>
            <DialogDescription>Modifiez les détails du contrat.</DialogDescription>
          </DialogHeader>
          <div>
            <Input
              name="nom"
              placeholder="Nom"
              onChange={(e) => setSelectedContract({ ...selectedContract, nom: e.target.value })}
              value={selectedContract.nom}
              className="mb-4"
            />
            <Select
              value={selectedContract.client}
              onValueChange={handleClientChange}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Sélectionnez un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedContract.site}
              onValueChange={(value) => setSelectedContract({ ...selectedContract, site: value })}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Sélectionnez un site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              name="startDate"
              type="date"
              placeholder="Date de début"
              onChange={(e) => setSelectedContract({ ...selectedContract, startDate: e.target.value })}
              value={formatDate(selectedContract.startDate)}
              className="mb-4"
            />
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              name="endDate"
              type="date"
              placeholder="Date de fin"
              onChange={(e) => setSelectedContract({ ...selectedContract, endDate: e.target.value })}
              value={formatDate(selectedContract.endDate)}
              className="mb-4"
              disabled={selectedContract.typeContrat === "Tacite"}
            />
            <Select
              value={selectedContract.periodicite}
              onValueChange={(value) => setSelectedContract({ ...selectedContract, periodicite: value })}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Sélectionnez une périodicité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                <SelectItem value="Annuelle">Annuelle</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedContract.typeContrat}
              onValueChange={(value) => setSelectedContract({ ...selectedContract, typeContrat: value })}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Sélectionnez un type de contrat" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedContract.typeContrat === "Curative" && (
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="pieceMainDoeuvre"
                  checked={selectedContract.pieceMainDoeuvre}
                  onChange={(e) => setSelectedContract({ ...selectedContract, pieceMainDoeuvre: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="pieceMainDoeuvre">Inclut pièces et main d'œuvre</label>
              </div>
            )}
            <div className="flex justify-between">
              <Button onClick={handleUpdateContract} className="bg-blue-500 text-white hover:bg-blue-600">
                Modifier
              </Button>
              <Button onClick={() => handleDeleteContract(selectedContract.id)} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}

    <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteContract}>
      <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Confirmation de Suppression</DialogTitle>
          <DialogDescription>Êtes-vous sûr de vouloir supprimer ce contrat ?</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <Button onClick={confirmDeleteContract} className="bg-red-500 text-white hover:bg-red-600">
            Supprimer
          </Button>
          <Button onClick={cancelDeleteContract} className="bg-gray-500 text-white hover:bg-gray-600">
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
export default ContratPage;  
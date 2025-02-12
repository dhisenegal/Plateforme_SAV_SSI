"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FaPlus, FaSyncAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllContrats, createContrat, renewContrat, getAllClients, getSitesByClientId } from "@/actions/sav/contrat";

const contractTypes = ["Préventive", "Curative"];
const periodicityOptions = ["Mensuels", "Trimestriels", "Semestriels", "Annuels"];

const ContratPage = () => {
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [newContract, setNewContract] = useState({ 
    nom: "", 
    client: "", 
    site: "", 
    startDate: "", 
    endDate: "", 
    periodicite: "", 
    typeContrat: "", 
    pieceMainDoeuvre: false 
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalContracts, setTotalContracts] = useState(0);
  const [filter, setFilter] = useState("");
  const [renewalContract, setRenewalContract] = useState(null);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);

  const params = useSearchParams();

  useEffect(() => {
    const fetchContracts = async () => {
      const urlFilter = params.get('filter')?.toString();
      setFilter(urlFilter || "");

      let whereClause = {};
      
      if (urlFilter === "expiring") {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        whereClause = {
          dateFin: {
            lte: thirtyDaysFromNow,
            gte: new Date()
          }
        };
      }

      const { contrats, total } = await getAllContrats(currentPage, itemsPerPage, whereClause);
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
      setNewContract({ 
        nom: "", 
        client: "", 
        site: "", 
        startDate: "", 
        endDate: "", 
        periodicite: "", 
        typeContrat: "", 
        pieceMainDoeuvre: false 
      });
      toast.success("Contrat ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du contrat");
    }
  };

  const handleRenewClick = (contract) => {
    setRenewalContract({
      ...contract,
      nombreAnnees: 1
    });
    setIsRenewDialogOpen(true);
  };

  const handleRenewContract = async () => {
    if (!renewalContract) {
      toast.error("Données de renouvellement manquantes");
      return;
    }
    
    try {
      // Vérifier que toutes les données requises sont présentes
      const renewalData = {
        nom: renewalContract.nom,
        periodicite: renewalContract.periodicite,
        typeContrat: renewalContract.typeContrat,
        pieceMainDoeuvre: renewalContract.pieceMainDoeuvre,
        nombreAnnees: renewalContract.nombreAnnees || 1 // Valeur par défaut si non définie
      };
  
      const updatedContract = await renewContrat(renewalContract.id, renewalData);
  
      // Mettre à jour la liste des contrats
      setContracts(contracts.map(c => 
        c.id === updatedContract.id ? updatedContract : c
      ));
      
      setIsRenewDialogOpen(false);
      setRenewalContract(null);
      toast.success("Contrat renouvelé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du renouvellement du contrat");
    }
  };

  const isExpiringSoon = (dateFin) => {
    if (!dateFin) return false;
    const endDate = new Date(dateFin);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return endDate <= thirtyDaysFromNow && endDate >= today;
  };

  const isExpired = (dateFin) => {
    if (!dateFin) return false;
    const endDate = new Date(dateFin);
    const today = new Date();
    return endDate < today;
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

  if (loading) {
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
                />
                <Label htmlFor="periodicite">Périodicité</Label>
                <Select
                  value={newContract.periodicite}
                  onValueChange={(value) => setNewContract({ ...newContract, periodicite: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez une périodicité" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodicityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
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
              <TableHead>Passages/mois</TableHead>
              <TableHead>Type de contrat</TableHead>
              <TableHead>Pièces et main d'œuvre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {contracts.map((contract) => (
              <TableRow 
                key={contract.id} 
                className={`cursor-pointer ${isExpiringSoon(contract.dateFin) ? 'bg-red-100' : ''}`}
              >
                <TableCell>{contract.nom}</TableCell>
                <TableCell>{contract.Site.Client.nom}</TableCell>
                <TableCell>{contract.Site.nom}</TableCell>
                <TableCell>{new Date(contract.dateDebut).toLocaleDateString()}</TableCell>
                <TableCell className={`${isExpiringSoon(contract.dateFin) ? 'font-bold text-red-600' : ''}`}>
                  {contract.dateFin ? new Date(contract.dateFin).toLocaleDateString() : "N/A"}
                  {isExpired(contract.dateFin) && <span className="text-red-600 ml-2">Expiré</span>}
                </TableCell>
                <TableCell>{contract.periodicite}</TableCell>
                <TableCell>{contract.typeContrat}</TableCell>
                <TableCell>{contract.pieceMainDoeuvre ? "Oui" : "Non"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <FaSyncAlt 
                      className="text-green-500 cursor-pointer" 
                      onClick={() => handleRenewClick(contract)} 
                    />
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

        <Dialog open={isRenewDialogOpen} onOpenChange={() => setIsRenewDialogOpen(false)}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Renouvellement du Contrat</DialogTitle>
              <DialogDescription>
                La date de début sera fixée à aujourd'hui. La date de fin sera calculée en fonction du nombre d'années de renouvellement.
              </DialogDescription>
            </DialogHeader>
            {renewalContract && (
              <div className="space-y-4">
                <div>
                  <Label>Nom du contrat</Label>
                  <Input
                    value={renewalContract.nom}
                    onChange={(e) => setRenewalContract({
                      ...renewalContract,
                      nom: e.target.value
                    })}
                  />
                </div>

                <div>
                  <Label>Nombre d'années de renouvellement</Label>
                  <Input
                    type="number"
                    min="1"
                    value={renewalContract.nombreAnnees}
                    onChange={(e) => setRenewalContract({
                      ...renewalContract,
                      nombreAnnees: parseInt(e.target.value)
                    })}
                  />
                </div>

                <div>
                  <Label>Périodicité</Label>
                  <Select
                    value={renewalContract.periodicite}
                    onValueChange={(value) => setRenewalContract({
                      ...renewalContract,
                      periodicite: value
                    })}
                  >
                    <SelectTrigger className="w-full mb-4">
                      <SelectValue placeholder="Sélectionnez une périodicité" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodicityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))} 
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type de contrat</Label>
                  <Select
                    value={renewalContract.typeContrat}
                    onValueChange={(value) => setRenewalContract({
                      ...renewalContract,
                      typeContrat: value
                    })}
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
                </div>

                {renewalContract.typeContrat === "Curative" && (
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="renewPieceMainDoeuvre"
                      checked={renewalContract.pieceMainDoeuvre}
                      onChange={(e) => setRenewalContract({
                        ...renewalContract,
                        pieceMainDoeuvre: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <label htmlFor="renewPieceMainDoeuvre">
                      Inclut pièces et main d'œuvre
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    onClick={() => setIsRenewDialogOpen(false)}
                    variant="outline"
                    className="bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleRenewContract}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Renouveler
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <ToastContainer />
      </div>
    </>
  );
};

export default ContratPage;
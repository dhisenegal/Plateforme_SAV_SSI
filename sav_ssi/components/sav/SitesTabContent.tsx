import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FaPlus, FaEye, FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getAllClients, getAllSites, createSite, updateSite, deleteSite, getAllContrats } from "@/actions/sav/site";
import { Client } from "@prisma/client";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SitesTabContent = () => {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [contrats, setContrats] = useState([]);
  const [sites, setSites] = useState([]);
  const [newSite, setNewSite] = useState({ clientId: "", nom: "", contractId: "", adresse: "" });
  const [selectedSite, setSelectedSite] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalSites, setTotalSites] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const clientsData = await getAllClients();
      const contratsData = await getAllContrats();
      const { sites: sitesData, total } = await getAllSites(currentPage, itemsPerPage);
      setClients(clientsData);
      setContrats(contratsData);
      setSites(sitesData);
      setTotalSites(total);
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleAddSite = async () => {
    try {
      const newSiteData = {
        nom: newSite.nom,
        idClient: parseInt(newSite.clientId),
        adresse: newSite.adresse,
      };
      const createdSite = await createSite(newSiteData);
      setSites([...sites, createdSite]);
      setNewSite({ clientId: "", nom: "", contractId: "", adresse: "" });
      toast.success("Site ajouté avec succès");
      console.log("New site added:", createdSite);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du site");
      console.error("Erreur lors de l'ajout du site:", error);
    }
  };

  const handleEditSite = (site, event) => {
    event.stopPropagation();
    setSelectedSite(site);
  };

  const handleUpdateSite = async () => {
    try {
      const updatedSiteData = {
        nom: selectedSite.nom,
        idClient: parseInt(selectedSite.clientId),
        adresse: selectedSite.adresse,
      };
      const updatedSite = await updateSite(selectedSite.id, updatedSiteData);
      setSites(sites.map(site => site.id === updatedSite.id ? updatedSite : site));
      setSelectedSite(null);
      toast.success("Site modifié avec succès");
      console.log("Site updated:", updatedSite);
    } catch (error) {
      toast.error("Erreur lors de la modification du site");
      console.error("Erreur lors de la modification du site:", error);
    }
  };

  const handleDeleteSite = (site, event) => {
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
    setSiteToDelete(site);
  };

  const confirmDeleteSite = async () => {
    try {
      await deleteSite(siteToDelete.id);
      setSites(sites.filter(site => site.id !== siteToDelete.id));
      setIsDeleteDialogOpen(false);
      setSiteToDelete(null);
      toast.success("Site supprimé avec succès");
      console.log("Site deleted:", siteToDelete);
    } catch (error) {
      toast.error("Erreur lors de la suppression du site");
      console.error("Erreur lors de la suppression du site:", error);
    }
  };

  const cancelDeleteSite = () => {
    setIsDeleteDialogOpen(false);
    setSiteToDelete(null);
  };

  const handleRowClick = (siteId) => {
    router.push(`/sav/sites/${siteId}`);
  };

  const handleSelectRow = (siteId) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(siteId)
        ? prevSelectedRows.filter((id) => id !== siteId)
        : [...prevSelectedRows, siteId]
    );
  };

  const handleSelectAllRows = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sites.map((site) => site.id));
    }
    setSelectAll(!selectAll);
  };

  const totalPages = Math.ceil(totalSites / itemsPerPage);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mes Sites</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white flex items-center">
              <FaPlus className="w-5 h-5 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Site</DialogTitle>
              <DialogDescription>Sélectionnez un client, un contrat et une adresse pour ajouter un site.</DialogDescription>
            </DialogHeader>
            <div>
              <div className="mb-4">
                <label className="block mb-2">Client</label>
                <Select
                  value={newSite.clientId}
                  onValueChange={(value) => setNewSite({ ...newSite, clientId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Nom du Site</label>
                <Input
                  name="nom"
                  placeholder="Nom du site"
                  onChange={(e) => setNewSite({ ...newSite, nom: e.target.value })}
                  value={newSite.nom}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Contrat</label>
                <Select
                  value={newSite.contractId}
                  onValueChange={(value) => setNewSite({ ...newSite, contractId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    {contrats.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id.toString()}>
                        {contract.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Adresse</label>
                <Input
                  name="adresse"
                  placeholder="Adresse"
                  onChange={(e) => setNewSite({ ...newSite, adresse: e.target.value })}
                  value={newSite.adresse}
                />
              </div>
              <Button onClick={handleAddSite} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Ajouter le Site
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllRows}
              />
            </TableHead>
            <TableHead>Sites</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Contrat</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => (
            <TableRow
              key={site.id}
              className={`cursor-pointer ${selectedRows.includes(site.id) ? 'bg-blue-100' : 'hover:bg-blue-100'}`}
              onClick={() => handleRowClick(site.id)}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(site.id)}
                  onChange={() => handleSelectRow(site.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>{site.nom}</TableCell>
              <TableCell>{site.Client.nom}</TableCell>
              <TableCell>{site.Contrats.length > 0 ? site.Contrats[0].nom : "Aucun contrat"}</TableCell>
              <TableCell>{site.adresse}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={(event) => handleEditSite(site, event)} />
                  <FaTrash className="text-red-500 cursor-pointer" onClick={(event) => handleDeleteSite(site, event)} />
                  <FaEye className="text-blue-500 cursor-pointer" onClick={() => handleRowClick(site.id)} />
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

      {selectedSite && (
        <Dialog open={selectedSite !== null} onOpenChange={() => setSelectedSite(null)}>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Modifier le Site</DialogTitle>
              <DialogDescription>Modifiez les détails du site.</DialogDescription>
            </DialogHeader>
            <div>
              <Input
                name="nom"
                placeholder="Nom"
                onChange={(e) => setSelectedSite({ ...selectedSite, nom: e.target.value })}
                value={selectedSite.nom}
                className="mb-4"
              />
              <Select
                value={selectedSite.clientId}
                onValueChange={(value) => setSelectedSite({ ...selectedSite, clientId: value })}
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Sélectionnez un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="adresse"
                placeholder="Adresse"
                onChange={(e) => setSelectedSite({ ...selectedSite, adresse: e.target.value })}
                value={selectedSite.adresse}
                className="mb-4"
              />
              <Button onClick={handleUpdateSite} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Modifier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteSite}>
        <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Confirmation de Suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer ce site ?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button onClick={confirmDeleteSite} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </Button>
            <Button onClick={cancelDeleteSite} className="bg-gray-500 text-white hover:bg-gray-600">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default SitesTabContent;
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaPause } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialContracts = [
  { id: "1", name: "Contrat 1", client: "Client 1", site: "Site 1", system: "Système 1", startDate: "2023-01-01", endDate: "2023-12-31", periodicity: "Annuelle", contractType: "Tacite 1 an", contractTerm: "Curative" },
  { id: "2", name: "Contrat 2", client: "Client 2", site: "Site 2", system: "Système 2", startDate: "2023-06-01", endDate: "2023-12-31", periodicity: "Semestrielle", contractType: "Renouvelable 2 ans", contractTerm: "Préventive" },
];

const clients = ["Client 1", "Client 2", "Client 3"];
const sites = ["Site 1", "Site 2", "Site 3"];
const systems = ["Système 1", "Système 2", "Système 3"];
const contractTypes = ["Tacite","1 an renouvelable","2 ans renouvelable", "3 ans renouvelable"];
const contractTerms = ["Curative", "Préventive"];

const ContratTabContent = () => {
  const [contracts, setContracts] = useState(initialContracts);
  const [newContract, setNewContract] = useState({ name: "", client: "", site: "", system: "", startDate: "", endDate: "", periodicity: "", contractType: "", contractTerm: "" });
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  const handleAddContract = () => {
    const newId = (contracts.length + 1).toString();
    setContracts([...contracts, { id: newId, ...newContract }]);
    setNewContract({ name: "", client: "", site: "", system: "", startDate: "", endDate: "", periodicity: "", contractType: "", contractTerm: "" });
    toast.success("Contrat ajouté avec succès");
  };

  const handleEditContract = (id) => {
    const contract = contracts.find(c => c.id === id);
    setSelectedContract(contract);
  };

  const handleUpdateContract = () => {
    setContracts(contracts.map(c => c.id === selectedContract.id ? selectedContract : c));
    setSelectedContract(null);
    toast.success("Contrat modifié avec succès");
  };

  const handleDeleteContract = (id) => {
    setIsDeleteDialogOpen(true);
    setContractToDelete(id);
  };

  const confirmDeleteContract = () => {
    setContracts(contracts.filter(c => c.id !== contractToDelete));
    setIsDeleteDialogOpen(false);
    setContractToDelete(null);
    toast.success("Contrat supprimé avec succès");
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
                  name="name"
                  placeholder="Nom"
                  onChange={(e) => setNewContract({ ...newContract, name: e.target.value })}
                  value={newContract.name}
                  className="mb-4"
                />
                <Select
                  value={newContract.client}
                  onValueChange={(value) => setNewContract({ ...newContract, client: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
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
                      <SelectItem key={site} value={site}>
                        {site}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newContract.system}
                  onValueChange={(value) => setNewContract({ ...newContract, system: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un système" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map((system) => (
                      <SelectItem key={system} value={system}>
                        {system}
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
                <Select
                  value={newContract.periodicity}
                  onValueChange={(value) => setNewContract({ ...newContract, periodicity: value })}
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
                  value={newContract.contractType}
                  onValueChange={(value) => setNewContract({ ...newContract, contractType: value })}
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
                <Select
                  value={newContract.contractTerm}
                  onValueChange={(value) => setNewContract({ ...newContract, contractTerm: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un terme de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <TableHead>Système</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead>Périodicité</TableHead>
              <TableHead>Type de contrat</TableHead>
              <TableHead>Terme du contrat</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id} className="cursor-pointer">
                <TableCell>{contract.name}</TableCell>
                <TableCell>{contract.client}</TableCell>
                <TableCell>{contract.site}</TableCell>
                <TableCell>{contract.system}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell>{contract.periodicity}</TableCell>
                <TableCell>{contract.contractType}</TableCell>
                <TableCell>{contract.contractTerm}</TableCell>
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

        {selectedContract && (
          <Dialog open={selectedContract !== null} onOpenChange={() => setSelectedContract(null)}>
            <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Modifier le Contrat</DialogTitle>
                <DialogDescription>Modifiez les détails du contrat.</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  name="name"
                  placeholder="Nom"
                  onChange={(e) => setSelectedContract({ ...selectedContract, name: e.target.value })}
                  value={selectedContract.name}
                  className="mb-4"
                />
                <Select
                  value={selectedContract.client}
                  onValueChange={(value) => setSelectedContract({ ...selectedContract, client: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
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
                      <SelectItem key={site} value={site}>
                        {site}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedContract.system}
                  onValueChange={(value) => setSelectedContract({ ...selectedContract, system: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un système" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map((system) => (
                      <SelectItem key={system} value={system}>
                        {system}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="startDate"
                  type="date"
                  placeholder="Date de début"
                  onChange={(e) => setSelectedContract({ ...selectedContract, startDate: e.target.value })}
                  value={selectedContract.startDate}
                  className="mb-4"
                />
                <Input
                  name="endDate"
                  type="date"
                  placeholder="Date de fin"
                  onChange={(e) => setSelectedContract({ ...selectedContract, endDate: e.target.value })}
                  value={selectedContract.endDate}
                  className="mb-4"
                />
                <Select
                  value={selectedContract.periodicity}
                  onValueChange={(value) => setSelectedContract({ ...selectedContract, periodicity: value })}
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
                  value={selectedContract.contractType}
                  onValueChange={(value) => setSelectedContract({ ...selectedContract, contractType: value })}
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
                <Select
                  value={selectedContract.contractTerm}
                  onValueChange={(value) => setSelectedContract({ ...selectedContract, contractTerm: value })}
                >
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Sélectionnez un terme de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default ContratTabContent;
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FaPlus, FaEye } from "react-icons/fa";

const initialClients = [
  { id: "1", name: "Client 1" },
  { id: "2", name: "Client 2" },
];

const initialContracts = [
  { id: "1", name: "Contrat 1" },
  { id: "2", name: "Contrat 2" },
];

const initialAddresses = [
  { id: "1", address: "Adresse 1" },
  { id: "2", address: "Adresse 2" },
];

const initialSites = [
  { id: "1", name: "Site 1", clientId: "1", contractId: "1", addressId: "1" },
  { id: "2", name: "Site 2", clientId: "2", contractId: "2", addressId: "2" },
];

const SitesTabContent = () => {
  const router = useRouter();
  const [newSite, setNewSite] = useState({ clientId: "", name: "", contractId: "", addressId: "" });
  const [sites] = useState(initialSites);

  const handleAddSite = () => {
    // Logic to add the new site
    console.log("New site added:", newSite);
    setNewSite({ clientId: "", name: "", contractId: "", addressId: "" });
  };

  const handleRowClick = (siteId) => {
    router.push(`/sav/sites/${siteId}`);
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
                    {initialClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Nom du Site</label>
                <Input
                  name="name"
                  placeholder="Nom du site"
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  value={newSite.name}
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
                    {initialContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Adresse</label>
                <Select
                  value={newSite.addressId}
                  onValueChange={(value) => setNewSite({ ...newSite, addressId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une adresse" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialAddresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <TableHead>Sites</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Contrat</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => (
            <TableRow key={site.id} className="cursor-pointer" onClick={() => handleRowClick(site.id)}>
              <TableCell>{site.name}</TableCell>
              <TableCell>{initialClients.find(client => client.id === site.clientId)?.name}</TableCell>
              <TableCell>{initialContracts.find(contract => contract.id === site.contractId)?.name}</TableCell>
              <TableCell>{initialAddresses.find(address => address.id === site.addressId)?.address}</TableCell>
              <TableCell>
                <FaEye className="text-blue-500 cursor-pointer" onClick={() => handleRowClick(site.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SitesTabContent;
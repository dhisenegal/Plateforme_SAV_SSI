<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
=======
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
import { Dialog, DialogContent,
  DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
<<<<<<< HEAD

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Liste des clients pour l'exemple
  const clients = [
    { id: 1, name: "Client A", type: "Particulier", address: " Dakar", contact: "responsable@senelec.sn" },
    { id: 2, name: "Client B", type: "professionnel", address: "Dakar", contact: "responsable@senelec.sn" },
    { id: 3, name: "Client C", type: "Particulier", address: "Dakar", contact: "responsable@senelec.sn" },
    { id: 4, name: "Client D", type: "professionnel", address: "Dakar", contact: "responsable@senelec.sn" },
  ];

  // Filtrage des clients basé sur la recherche
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

=======
 import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
 
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
const systemes = [
  {
    value: "Extincteurs automatiques",
    label: "Extincteurs automatiques",
  },
  {
    value: "Alarmes",
    label: "Alarmes",
  },
  {
    value: "Sprinklers",
    label: "Sprinklers",
  },
  {
    value: "extincteurs portatifs",
    label: "extincteurs portatifs",
  },
    
  {
    value: "SDI",
    label: "SDI",
  },
  {
    value: "Désenfumage naturel",
    label: "Désenfumage naturel",
  },
  
]

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  // Liste des clients pour l'exemple
  const [clients, setClients] = useState([
    { id: 1, secteur: "TELECOM", entreprise: "SONATEL", batiment: "RDC(salle d'archives)", niveau: "RDC", systeme: "Extinction Automatique à Gaz" },
   
  ]);

  // Filtrage des clients basé sur la recherche
  const filteredClients = clients.filter((client) =>
    client.entreprise.toLowerCase().includes(searchQuery.toLowerCase())
  );

   /// États pour le formulaire
  const [secteur, setSecteur] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [batiment, setBatiment] = useState("");
  const [niveau, setNiveau] = useState("");
  const [systeme, setSysteme] = useState(value);

  // Gestion de l'ajout d'un technicien
  const handleAddClient = (e) => {
    e.preventDefault();

    // Création d'un nouvel objet technicien
    const newClient = {
      id: clients.length + 1,
      secteur,
      entreprise,
      batiment,
     niveau,
     systeme
    };

    // Mise à jour de la liste des clients
    setClients([...clients, newClient]);

    // Réinitialiser les champs du formulaire
    setSecteur("");
    setEntreprise("");
    setBatiment("");
    setNiveau("");
    setSysteme("");
  };

>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6">Gestion des Clients</h1>

      {/* Disposition avec Flex */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        
          <h2 className="text-xl font-medium mb-4">Clients</h2>

        {/* Barre de recherche au centre */}
        <div className="lg:col-span-1 flex items-center justify-center  p-4 rounded-md shadow-md">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher un client"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
        </div>

        {/* Ajouter un client à droite */}
        <div className="lg:col-span-1 flex justify-center items-center p-4 rounded-md shadow-md">
        <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all">
                Ajouter un client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un client</DialogTitle>
                <DialogDescription>
                Vous pouvez ajouter un client
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
                  <Label htmlFor="name" className="text-right">
                    Nom du client
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Senelec"
=======
                  <Label htmlFor="secteur" className="text-right">
                    Secteur d'activité
                  </Label>
                  <Input
                    id="secteur"
                    placeholder="Senelec"
                    onChange={(e) => setSecteur(e.target.value)}
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
                  <Label htmlFor="contact" className="text-right">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    defaultValue="responsable@senelec.sn"
                    className="col-span-3"
                    placeholder="adresse email ou numéro téléphone"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Adresse
                  </Label>
                  <Input
                    id="adresse"
                    defaultValue="Yoff rue 10"
                    className="col-span-3"
                    placeholder="nom et numéro de la rue"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all">
=======
                  <Label htmlFor="entreprise" className="text-right">
                    Entreprise
                  </Label>
                  <Input
                    id="entreprise"
                    className="col-span-3"
                    onChange={(e) => setEntreprise(e.target.value)}
                    placeholder="entreprise de l'entreprise"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batiment" className="text-right">
                    Type de Batiment
                  </Label>
                  <Input
                    id="batiment"
                    onChange={(e) => setBatiment(e.target.value)}
                    className="col-span-3"
                    placeholder="Salle serveur"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="niveau" className="text-right">
                    Niveau
                  </Label>
                  <Input
                    id="niveau"
                    onChange={(e) => setNiveau(e.target.value)}
                    className="col-span-3"
                    placeholder="RDC"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  
                  <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? systemes.find((systeme) => systeme.value === value)?.label
            : "Select systeme..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un système..." />
          <CommandList>
            <CommandEmpty>Ce sytéme n'existe pas.</CommandEmpty>
            <CommandGroup>
              {systemes.map((systeme) => (
                <CommandItem
                key={systeme.value}
                value={systeme.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setSysteme(currentValue);  // Mettre à jour 'systeme'
                  setOpen(false);
                }}
              >
                {systeme.label}
                <Check
                  className={cn(
                    "ml-auto",
                    value === systeme.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
                onClick={handleAddClient}>
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-medium mb-4">Liste des Clients</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
<<<<<<< HEAD
              <th className="py-2 px-4 border">Nom</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">Adresse</th>
=======
              <th className="py-2 px-4 border">Secteur D'activité</th>
              <th className="py-2 px-4 border">Entreprise</th>
              <th className="py-2 px-4 border">Type de Batiment</th>
              <th className="py-2 px-4 border">Niveau</th>
              <th className="py-2 px-4 border">Systéme</th>
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b">
<<<<<<< HEAD
                  <td className="py-2 px-4">{client.name}</td>
                  <td className="py-2 px-4">{client.type}</td>
                  <td className="py-2 px-4">{client.address}</td>
                  <td className="py-2 px-4">{client.contact}</td>
=======
                  <td className="py-2 px-4">{client.secteur}</td>
                  <td className="py-2 px-4">{client.entreprise}</td>
                  <td className="py-2 px-4">{client.batiment}</td>
                  <td className="py-2 px-4">{client.niveau}</td>
                  <td className="py-2 px-4">{client.systeme}</td>
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  Aucun client trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;

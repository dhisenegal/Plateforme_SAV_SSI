"use client";

import React, { useState, useEffect } from "react";
import { FaFileExport } from "react-icons/fa";
import { exportMaintenancesToExcel } from "@/utils/maintenance-export";
import { FaSpinner, FaPause, FaEdit, FaPlus } from "react-icons/fa";
import { getAllMaintenances, updateMaintenanceStatus,
   planifierMaintenanceGlobal, ajouterCommentaireMaintenance,
    getCommentairesMaintenance, updateMaintenanceWithComment } from "@/actions/sav/maintenance";
import { getClients } from "@/actions/sav/client";
import { getSitesByClient } from "@/actions/sav/site";
import { getAllTechniciens } from "@/actions/sav/technicien";
import { getContactsBySite } from "@/actions/sav/contact";
import { getInstallationsBySite } from "@/actions/sav/installation";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FaComment } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import ModifierMaintenanceDialog from "@/components/sav/ModifierMaintenanceDialog";
import Link from "next/link";
import { toast } from "react-toastify";
// Import nécessaires pour les selects améliorés
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MaintenancesPage = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [installations, setInstallations] = useState<any[]>([]);
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
  const [techniciens, setTechniciens] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    numero: '',
    datePlanifiee: '',
    description: '',
    typeMaintenance: '',
    idClient: 0,
    idSite: 0,
    idTechnicien: 0,
    idContact: 0,
    idInstallation: 0,
    dateMaintenance: ''
  });
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [commentaireOpen, setCommentaireOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [commentaire, setCommentaire] = useState('');
  const [commentaires, setCommentaires] = useState<any[]>([]);
  const [isModificationOpen, setIsModificationOpen] = useState(false);
  const [maintenanceToModify, setMaintenanceToModify] = useState(null);

  // États pour les selects améliorés
  const [clientComboOpen, setClientComboOpen] = useState(false);
  const [siteComboOpen, setSiteComboOpen] = useState(false);
  const [installationComboOpen, setInstallationComboOpen] = useState(false);
  const [technicienComboOpen, setTechnicienComboOpen] = useState(false);
  const [contactComboOpen, setContactComboOpen] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [searchSite, setSearchSite] = useState("");
  const [searchInstallation, setSearchInstallation] = useState("");
  const [searchTechnicien, setSearchTechnicien] = useState("");
  const [searchContact, setSearchContact] = useState("");

  const [formErrors, setFormErrors] = useState({
    idClient: false,
    idSite: false,
    idInstallation: false,
    datePlanifiee: false,
    typeMaintenance: false,
    idTechnicien: false,
    idContact: false
  });

  // Fonction de validation avant soumission
  const validateForm = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialise l'heure à minuit
    const selectedDate = new Date(formData.datePlanifiee);
    selectedDate.setHours(0, 0, 0, 0);
  
    const errors = {
      idClient: !formData.idClient,
      idSite: !formData.idSite,
      idInstallation: !formData.idInstallation,
      datePlanifiee: !formData.datePlanifiee || selectedDate < today,
      typeMaintenance: !formData.typeMaintenance,
      idTechnicien: !formData.idTechnicien,
      idContact: !formData.idContact
    };
  
    setFormErrors(errors);
  
    if (selectedDate < today) {
      toast.error("La date de maintenance ne peut pas être dans le passé");
    }
  
    return !Object.values(errors).some(error => error);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Dans le handleEdit :
  const handleEdit = async (maintenance) => {
    if (!techniciens || techniciens.length === 0) {
      try {
        const techniciensData = await getAllTechniciens();
        setTechniciens(techniciensData);
      } catch (error) {
        console.error("Erreur lors du chargement des techniciens:", error);
        alert("Erreur lors du chargement des techniciens");
        return;
      }
    }
    setMaintenanceToModify(maintenance);
    setIsModificationOpen(true);
  };

  // Ajoutez la fonction de soumission :
  const handleModificationSubmit = async (formData) => {
    try {
      await updateMaintenanceWithComment(maintenanceToModify.id, {
        ...formData,
        idUtilisateur: idUtilisateurConnecte
      });
      fetchMaintenances();
      setIsModificationOpen(false);
      setMaintenanceToModify(null);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert("Une erreur est survenue lors de la modification");
    }
  };

  const { data: session } = useSession();
  const idUtilisateurConnecte = session?.user?.id;

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const { maintenances: maintenancesData, total: totalMaintenances } = await getAllMaintenances(
        page, 
        pageSize, 
        searchQuery,
        dateDebut,
        dateFin,
        statusFilter === 'all' ? '' : statusFilter // Pass empty string if "all" is selected
      );
      setMaintenances(maintenancesData);
      setTotal(totalMaintenances);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommentaires = async (maintenanceId: number) => {
    try {
      const comments = await getCommentairesMaintenance(maintenanceId);
      setCommentaires(comments);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, [page, pageSize, searchQuery, dateDebut, dateFin, statusFilter]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [clientsData, techniciensData] = await Promise.all([
          getClients(),
          getAllTechniciens()
        ]);

        setClients(clientsData);
        setTechniciens(techniciensData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const handleClientSelect = async (clientId: string) => {
    try {
      const sitesData = await getSitesByClient(parseInt(clientId));
      setSites(sitesData);
      setFormData(prev => ({ ...prev, idClient: parseInt(clientId) }));
    } catch (error) {
      console.error("Erreur lors de la récupération des sites:", error);
    }
  };

  const handleSiteSelect = async (siteId: string) => {
    try {
      const [installationsData, contactsData] = await Promise.all([
        getInstallationsBySite(parseInt(siteId)),
        getContactsBySite(parseInt(siteId))
      ]);

      setInstallations(installationsData);
      setContacts(contactsData);
      setFormData(prev => ({ ...prev, idSite: parseInt(siteId) }));
    } catch (error) {
      console.error("Erreur lors de la récupération des installations et contacts:", error);
    }
  };

  const handleInstallationSelect = (installationId: string) => {
    const installation = installations.find(i => i.id === parseInt(installationId));
    setSelectedInstallation(installation);
    setFormData(prev => ({ ...prev, idInstallation: parseInt(installationId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation avant soumission
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const formattedData = {
        ...formData,
        datePlanifiee: new Date(formData.datePlanifiee).toISOString()
      };
  
      await planifierMaintenanceGlobal({
        ...formattedData,
        statut: 'PLANIFIE'
      });
      setIsOpen(false);
      fetchMaintenances();
      toast.success("Maintenance planifiée avec succès");
    } catch (error) {
      console.error("Erreur lors de la planification:", error);
      toast.error("Une erreur est survenue lors de la planification");
    }
  };

  const handlePause = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'SUSPENDU' ? 'PLANIFIE' : 'SUSPENDU';
      await updateMaintenanceStatus(id, newStatus);
      // Refresh the list of maintenances
      fetchMaintenances();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleExport = () => {
    exportMaintenancesToExcel(maintenances);
  };

  // Filtrer les données pour les sélecteurs
  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchClient.toLowerCase())
  );
  
  const filteredSites = sites.filter(site => 
    site.nom.toLowerCase().includes(searchSite.toLowerCase())
  );
  
  const filteredInstallations = installations.filter(installation => 
    installation.Systeme?.nom.toLowerCase().includes(searchInstallation.toLowerCase())
  );
  
  const filteredTechniciens = techniciens.filter(technicien => 
    `${technicien.nom} ${technicien.prenom}`.toLowerCase().includes(searchTechnicien.toLowerCase())
  );
  
  const filteredContacts = contacts.filter(contact => 
    `${contact.nom} ${contact.prenom}`.toLowerCase().includes(searchContact.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3">
        <FaSpinner className="animate-spin" />
        Chargement en cours...
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
    <div className="grid grid-cols-4 gap-4 mb-4">
      <Input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Input
        type="date"
        value={dateDebut}
        onChange={(e) => setDateDebut(e.target.value)}
      />
      <Input
        type="date"
        value={dateFin}
        onChange={(e) => setDateFin(e.target.value)}
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          Statut
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="PLANIFIE">Planifié</SelectItem>
          <SelectItem value="SUSPENDU">Suspendu</SelectItem>
          <SelectItem value="TERMINE">Terminé</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold">Gestion Maintenances</h1>
    <div className="flex gap-2">
      <Button 
        className="flex items-center bg-green-500 text-white hover:bg-green-600" 
        onClick={handleExport}
      >
        <FaFileExport className="mr-2" />
        Exporter Excel
      </Button>
      <Button 
        className="flex items-center bg-blue-500 text-white hover:bg-blue-600" 
        onClick={() => setIsOpen(true)}
      >
        <FaPlus className="mr-2" />
        Planifier Maintenance
      </Button>
    </div>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Système</TableHead>
          <TableHead>Date Prévue</TableHead>
          <TableHead>Date Effectuée</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Technicien</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenances.map((maintenance) => (
          <TableRow key={maintenance.id} className="hover:bg-blue-100">
            <TableCell>{maintenance.Contact.Client.nom}</TableCell>
            <TableCell>{maintenance.Site.nom}</TableCell>
            <TableCell>{maintenance.Installation.Systeme.nom}</TableCell>
            <TableCell>{new Date(maintenance.datePlanifiee).toLocaleDateString()}</TableCell>
            <TableCell>
              {maintenance.dateMaintenance 
                ? new Date(maintenance.dateMaintenance).toLocaleDateString()
                : '-'}
            </TableCell>
            <TableCell className={maintenance.statut === 'PLANIFIE' ? 'text-green-500' : maintenance.statut === 'TERMINE' ? 'text-red-500' : ''}>
              {maintenance.statut}
            </TableCell>
            <TableCell>{`${maintenance.Technicien.prenom} ${maintenance.Technicien.nom}`}</TableCell>
            <TableCell className="flex space-x-2">
            <Button
                variant="outline"
                className={`${
                  maintenance.statut === 'SUSPENDU' ? 'text-red-500' : 'text-green-500'
                } ${maintenance.statut === 'TERMINE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handlePause(maintenance.id, maintenance.statut)}
                disabled={maintenance.statut === 'TERMINE'}
              >
                <FaPause />
              </Button>
              <Button 
                variant="outline" 
                className={`text-blue-500 ${
                  maintenance.statut === 'TERMINE' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handleEdit(maintenance)}
                disabled={maintenance.statut === 'TERMINE'}
              >
                <FaEdit />
              </Button>
              <Button variant="outline" className="text-yellow-500" 
                onClick={() => {
              setSelectedMaintenance(maintenance);
              loadCommentaires(maintenance.id);
              setCommentaireOpen(true);
            }}>
              <FaComment />
              </Button>
              <Link href={`/sav/maintenances/${maintenance.id}`}>
              Voir détails
            </Link>
            </TableCell>  
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <div className="flex justify-end items-center mt-4">
      <div className=" text-white p-2 rounded-lg flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${page === index + 1 ? 'bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-white shadow-2xl rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Planifier une nouvelle maintenance
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Tous les champs marqués d'un * sont obligatoires
            </p>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Client avec recherche */}
              <div>
                <Label className="block mb-2 text-gray-700 font-semibold">Client *</Label>
                <Popover open={clientComboOpen} onOpenChange={setClientComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientComboOpen}
                      className={`w-full justify-between ${
                        formErrors.idClient ? 'border-red-500 text-red-500' : 'border-gray-300'
                      }`}
                    >
                      {formData.idClient
                        ? clients.find(client => client.id === formData.idClient)?.nom || "Sélectionner un client"
                        : "Sélectionner un client"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher un client..."
                        value={searchClient}
                        onValueChange={setSearchClient}
                      />
                      <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-64">
                          {filteredClients.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.nom}
                              onSelect={() => {
                                handleClientSelect(client.id.toString());
                                setClientComboOpen(false);
                                setSearchClient("");
                                // Réinitialiser site et installation quand client change
                                setFormData(prev => ({ 
                                  ...prev, 
                                  idSite: 0, 
                                  idInstallation: 0,
                                  idContact: 0
                                }));
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.idClient === client.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {client.nom}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors.idClient && (
                  <p className="text-red-500 text-sm mt-1">Ce champ est requis</p>
                )}
              </div>

              {/* Site avec recherche */}
              <div>
                <Label className="block mb-2 text-gray-700 font-semibold">Site *</Label>
                <Popover 
                  open={siteComboOpen} 
                  onOpenChange={(open) => formData.idClient ? setSiteComboOpen(open) : null}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={siteComboOpen}
                      className={`w-full justify-between ${
                        formErrors.idSite ? 'border-red-500 text-red-500' : 'border-gray-300'
                      }`}
                      disabled={!formData.idClient}
                    >
                      {formData.idSite
                        ? sites.find(site => site.id === formData.idSite)?.nom || "Sélectionner un site"
                        : "Sélectionner un site"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher un site..."
                        value={searchSite}
                        onValueChange={setSearchSite}
                      />
                      <CommandEmpty>Aucun site trouvé.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-64">
                          {filteredSites.map((site) => (
                            <CommandItem
                              key={site.id}
                              value={site.nom}
                              onSelect={() => {
                                handleSiteSelect(site.id.toString());
                                setSiteComboOpen(false);
                                setSearchSite("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.idSite === site.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {site.nom}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors.idSite && (
                  <p className="text-red-500 text-sm mt-1">Ce champ est requis</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Installation avec recherche */}
              <div>
                <Label className="block mb-2 text-gray-700 font-semibold">Installation *</Label>
                <Popover 
                  open={installationComboOpen} 
                  onOpenChange={(open) => formData.idSite ? setInstallationComboOpen(open) : null}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={installationComboOpen}
                      className={`w-full justify-between ${
                        formErrors.idInstallation ? 'border-red-500 text-red-500' : 'border-gray-300'
                      }`}
                      disabled={!formData.idSite}
                    >
                      {formData.idInstallation
                        ? installations.find(inst => inst.id === formData.idInstallation)
                          ? `${installations.find(inst => inst.id === formData.idInstallation)?.Systeme?.nom} - Installé le ${new Date(installations.find(inst => inst.id === formData.idInstallation)?.dateInstallation).toLocaleDateString()}`
                          : "Sélectionner une installation"
                        : "Sélectionner une installation"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher une installation..."
                        value={searchInstallation}
                        onValueChange={setSearchInstallation}
                      />
                      <CommandEmpty>Aucune installation trouvée.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-64">
                          {filteredInstallations.map((installation) => (
                            <CommandItem
                              key={installation.id}
                              value={installation.Systeme?.nom || ""}
                              onSelect={() => {
                                handleInstallationSelect(installation.id.toString());
                                setInstallationComboOpen(false);
                                setSearchInstallation("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.idInstallation === installation.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {`${installation.Systeme?.nom} - Installé le ${new Date(installation.dateInstallation).toLocaleDateString()}`}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors.idInstallation && (
                  <p className="text-red-500 text-sm mt-1">Ce champ est requis</p>
                )}
              </div>

              {/* Date Prévue */}
              <div>
                <Label className="block mb-2 text-gray-700 font-semibold">Date prévue *</Label>
                <Input
                    type="date"
                    min={getCurrentDate()}
                    value={formData.datePlanifiee}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, datePlanifiee: e.target.value }));
                      setFormErrors(prev => ({ ...prev, datePlanifiee: false }));
                    }}
                    className={`
                      ${formErrors.datePlanifiee ? 'border-red-500 text-red-500' : 'border-gray-300'}
                    `}
                  />
                 {formErrors.datePlanifiee && (
                  <p className="text-red-500 text-sm mt-1">Ce champ est requis</p>
                )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Type de Maintenance */}
                <div>
                  <Label className="block mb-2 text-gray-700 font-semibold">Type de maintenance *</Label>
                  <Select 
                    value={formData.typeMaintenance}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, typeMaintenance: value }));
                      setFormErrors(prev => ({ ...prev, typeMaintenance: false }));
                    }}
                  >
                    <SelectTrigger className={`
                      ${formErrors.typeMaintenance ? 'border-red-500 text-red-500' : 'border-gray-300'}
                    `}>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Préventive</SelectItem>
                      <SelectItem value="curative">Curative</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.typeMaintenance && (
                    <p className="text-red-500 text-sm mt-1">Ce champ est requis</p>
                  )}
                </div>

                {/* Technicien avec recherche */}
                <div>
                  <Label className="block mb-2 text-gray-700 font-semibold">Technicien *</Label>
                  <Popover 
                    open={technicienComboOpen} 
                    onOpenChange={setTechnicienComboOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={technicienComboOpen}
                        className={`w-full justify-between ${
                          formErrors.idTechnicien ? 'border-red-500 text-red-500' : 'border-gray-300'
                        }`}
                      >
                        {formData.idTechnicien
                          ? techniciens.find(tech => tech.id === formData.idTechnicien)
                            ? `${techniciens.find(tech => tech.id === formData.idTechnicien).prenom} ${techniciens.find(tech => tech.id === formData.idTechnicien).nom}`
                            : "Sélectionner un technicien"
                          : "Sélectionner un technicien"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher un technicien..."
                          value={searchTechnicien}
                          onValueChange={setSearchTechnicien}
                        />
                        <CommandEmpty>Aucun technicien trouvé.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {filteredTechniciens.map((tech) => (
                              <CommandItem
                                key={tech.id}
                                value={`${tech.prenom} ${tech.nom}`}
                                onSelect={() => {
                                  setFormData(prev => ({ ...prev, idTechnicien: tech.id }));
                                  setFormErrors(prev => ({ ...prev, idTechnicien: false }));
                                  setTechnicienComboOpen(false);
                                  setSearchTechnicien("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.idTechnicien === tech.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {tech.prenom} {tech.nom}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {formErrors.idTechnicien && (
                    <p className="text-red-500 text-sm mt-1">Ce champ est requis</p>
                  )}
                </div>

                {/* Contact avec recherche */}
                <div>
                  <Label className="block mb-2 text-gray-700 font-semibold">Contact sur site *</Label>
                  <Popover 
                    open={contactComboOpen} 
                    onOpenChange={(open) => formData.idSite ? setContactComboOpen(open) : null}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={contactComboOpen}
                        className={`w-full justify-between ${
                          formErrors.idContact ? 'border-red-500 text-red-500' : 'border-gray-300'
                        }`}
                        disabled={!formData.idSite}
                      >
                        {formData.idContact
                          ? contacts.find(contact => contact.id === formData.idContact)
                            ? `${contacts.find(contact => contact.id === formData.idContact).prenom} ${contacts.find(contact => contact.id === formData.idContact).nom}`
                            : "Sélectionner un contact"
                          : "Sélectionner un contact"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher un contact..."
                          value={searchContact}
                          onValueChange={setSearchContact}
                        />
                        <CommandEmpty>Aucun contact trouvé.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {filteredContacts.map((contact) => (
                              <CommandItem
                                key={contact.id}
                                value={`${contact.prenom} ${contact.nom}`}
                                onSelect={() => {
                                  setFormData(prev => ({ ...prev, idContact: contact.id }));
                                  setFormErrors(prev => ({ ...prev, idContact: false }));
                                  setContactComboOpen(false);
                                  setSearchContact("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.idContact === contact.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {contact.prenom} {contact.nom}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {formErrors.idContact && (
                    <p className="text-red-500 text-sm mt-1">Ce champ est requis</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="block mb-2 text-gray-700 font-semibold">Description</Label>
                <Input
                  placeholder="Description détaillée des travaux à effectuer"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="border-gray-300"
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 text-white">
                Planifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      <Dialog open={commentaireOpen} onOpenChange={setCommentaireOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Commentaires de la maintenance {selectedMaintenance?.numero}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-2">
                {commentaires.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">
                          {comment.Utilisateur.prenom} {comment.Utilisateur.nom}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.dateCommentaire).toLocaleString()}
                        </span>
                      </div>
                      <p>{comment.commentaire}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Votre commentaire..."
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                />
                <Button 
                  className="w-full"
                  onClick={async () => {
                    if (commentaire.trim() && selectedMaintenance) {
                      await ajouterCommentaireMaintenance({
                        idMaintenance: selectedMaintenance.id,
                        idUtilisateur: idUtilisateurConnecte,
                        commentaire: commentaire.trim()
                      });
                      setCommentaire('');
                      loadCommentaires(selectedMaintenance.id);
                    }
                  }}
                >
                  Ajouter un commentaire
                </Button>
              </div>
            </div>
          </DialogContent>
      </Dialog>

      <ModifierMaintenanceDialog
        isOpen={isModificationOpen}
        onClose={() => setIsModificationOpen(false)}
        maintenance={maintenanceToModify}
        techniciens={techniciens}
        onSubmit={handleModificationSubmit}
      />
    </div>
  );
};

export default MaintenancesPage;
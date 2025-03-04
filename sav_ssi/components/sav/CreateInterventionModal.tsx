"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getClientById } from "@/actions/sav/client";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getAllClients, getSitesByClient } from "@/actions/sav/site";
import { getAllSystemes } from "@/actions/admin/equipement";
import { getAllTechniciens, getTechnicienById } from "@/actions/sav/technicien";
import { createIntervention } from "@/actions/sav/intervention";
import { sendUrgentInterventionNotification } from "@/lib/send-email";
import { toast } from "react-toastify";
// Import nécessaires pour les selects améliorés
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  typePanneDeclare: string;
  dateDeclaration: string;
  idClient: string;
  idSite: string;
  idSysteme: string;
  prenomContact: string;
  telephoneContact: string;
  adresse: string;
  numero: string;
  sousGarantie: boolean;
  urgent: boolean;
}

const CreateInterventionModal = ({ onCreate }) => {
  const [formData, setFormData] = useState<FormData>({
    typePanneDeclare: "",
    dateDeclaration: new Date().toISOString().split('T')[0],
    idClient: "",
    idSite: "",
    idSysteme: "",
    prenomContact: "",
    telephoneContact: "",
    adresse: "",
    numero: "",
    sousGarantie: true,
    urgent: false
  });

  const [planificationData, setPlanificationData] = useState({
    planifierMaintenant: false,
    datePlanifiee: "",
    idTechnicien: "",
    statut: "NON_PLANIFIE"
  });

  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [systemes, setSystemes] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // États pour les selects améliorés avec recherche
  const [clientComboOpen, setClientComboOpen] = useState(false);
  const [siteComboOpen, setSiteComboOpen] = useState(false);
  const [systemeComboOpen, setSystemeComboOpen] = useState(false);
  const [technicienComboOpen, setTechnicienComboOpen] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [searchSite, setSearchSite] = useState("");
  const [searchSysteme, setSearchSysteme] = useState("");
  const [searchTechnicien, setSearchTechnicien] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [clientsData, techniciensData, systemesData] = await Promise.all([
          getAllClients(),
          getAllTechniciens(),
          getAllSystemes(),
        ]);
        setClients(clientsData);
        setTechniciens(techniciensData);
        setSystemes(systemesData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données initiales");
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchSites = async () => {
      if (formData.idClient) {
        try {
          const sitesData = await getSitesByClient(parseInt(formData.idClient));
          setSites(sitesData);
        } catch (error) {
          toast.error("Erreur lors du chargement des sites");
        }
      }
    };
    fetchSites();
  }, [formData.idClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanificationChange = (e) => {
    const { name, value } = e;
    setPlanificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      typePanneDeclare: "",
      dateDeclaration: new Date().toISOString().split('T')[0],
      idClient: "",
      idSite: "",
      idSysteme: "",
      prenomContact: "",
      telephoneContact: "",
      adresse: "",
      numero: "",
      sousGarantie: true,
      urgent: false
    });
    setPlanificationData({
      planifierMaintenant: false,
      datePlanifiee: "",
      idTechnicien: "",
      statut: "NON_PLANIFIE",
    });
    // Réinitialiser les états de recherche
    setSearchClient("");
    setSearchSite("");
    setSearchSysteme("");
    setSearchTechnicien("");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Récupérer d'abord le technicien si une planification est faite
      let technicien = null;
      let client = null;
      
      if (planificationData.planifierMaintenant && planificationData.idTechnicien) {
        technicien = await getTechnicienById(parseInt(planificationData.idTechnicien));
        if (!technicien) {
          toast.error("Technicien non trouvé");
          return;
        }
      }

      // Récupérer les informations du client si l'intervention est urgente
      if (formData.urgent) {
        client = await getClientById(parseInt(formData.idClient));
        if (!client) {
          toast.error("Client non trouvé");
          return;
        }
      }

      const interventionData = {
        ...formData,
        idClient: parseInt(formData.idClient),
        idSite: parseInt(formData.idSite),
        idSysteme: parseInt(formData.idSysteme),
        numero: formData.numero ? parseInt(formData.numero) : null,
        dateDeclaration: new Date(formData.dateDeclaration),
        sousGarantie: formData.sousGarantie,
        urgent: formData.urgent,
        ...(planificationData.planifierMaintenant && {
          datePlanifiee: new Date(planificationData.datePlanifiee),
          idTechnicien: parseInt(planificationData.idTechnicien),
          statut: "PLANIFIE"
        })
      };

      const newIntervention = await createIntervention(interventionData);

      // Si l'intervention est urgente et qu'un technicien est assigné
      if (formData.urgent && technicien && client) {
        try {
          await sendUrgentInterventionNotification(
            {
              email: technicien.email,
              nom: technicien.nom,
              prenom: technicien.prenom
            }, 
            {
              description: newIntervention.typePanneDeclare,
              Client: client,
              datePlanifiee: newIntervention.datePlanifiee,
              urgent: true
            }
          );
          toast.success("Email d'urgence envoyé au technicien");
        } catch (error) {
          console.error("Erreur lors de l'envoi de l'email:", error);
          toast.warning("L'intervention a été créée mais l'email n'a pas pu être envoyé");
        }
      }

      toast.success("Intervention créée avec succès");
      onCreate(newIntervention);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur complète:", error);
      toast.error("Erreur lors de la création de l'intervention");
    }
  };

  // Filtrer les données selon les termes de recherche
  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchClient.toLowerCase())
  );
  
  const filteredSites = sites.filter(site => 
    site.nom.toLowerCase().includes(searchSite.toLowerCase())
  );
  
  const filteredSystemes = systemes.filter(systeme => 
    systeme.nom.toLowerCase().includes(searchSysteme.toLowerCase())
  );
  
  const filteredTechniciens = techniciens.filter(tech => 
    `${tech.nom} ${tech.prenom}`.toLowerCase().includes(searchTechnicien.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button className="bg-blue-500 text-white flex items-center">
        <FaPlus className="w-5 h-5 mr-2" />
        Nouvelle intervention
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Créer une nouvelle intervention</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Sélecteur de client amélioré avec recherche */}
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Popover open={clientComboOpen} onOpenChange={setClientComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={clientComboOpen}
                  className="w-full justify-between"
                >
                  {formData.idClient
                    ? clients.find(client => client.id.toString() === formData.idClient)?.nom
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
                            handleSelectChange("idClient", client.id.toString());
                            setClientComboOpen(false);
                            setSearchClient("");
                            // Réinitialiser le site et système quand le client change
                            handleSelectChange("idSite", "");
                            handleSelectChange("idSysteme", "");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.idClient === client.id.toString() ? "opacity-100" : "opacity-0"
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
          </div>

          {/* Sélecteur de site amélioré avec recherche */}
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Popover 
              open={siteComboOpen} 
              onOpenChange={(open) => formData.idClient ? setSiteComboOpen(open) : null}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={siteComboOpen}
                  className="w-full justify-between"
                  disabled={!formData.idClient}
                >
                  {formData.idSite
                    ? sites.find(site => site.id.toString() === formData.idSite)?.nom
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
                            handleSelectChange("idSite", site.id.toString());
                            setSiteComboOpen(false);
                            setSearchSite("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.idSite === site.id.toString() ? "opacity-100" : "opacity-0"
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
          </div>

          {/* Sélecteur de système amélioré avec recherche */}
          <div className="space-y-2">
            <Label htmlFor="systeme">Système</Label>
            <Popover 
              open={systemeComboOpen} 
              onOpenChange={(open) => formData.idSite ? setSystemeComboOpen(open) : null}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={systemeComboOpen}
                  className="w-full justify-between"
                  disabled={!formData.idSite}
                >
                  {formData.idSysteme
                    ? systemes.find(sys => sys.id.toString() === formData.idSysteme)?.nom
                    : "Sélectionner un système"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Rechercher un système..."
                    value={searchSysteme}
                    onValueChange={setSearchSysteme}
                  />
                  <CommandEmpty>Aucun système trouvé.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-64">
                      {filteredSystemes.map((systeme) => (
                        <CommandItem
                          key={systeme.id}
                          value={systeme.nom}
                          onSelect={() => {
                            handleSelectChange("idSysteme", systeme.id.toString());
                            setSystemeComboOpen(false);
                            setSearchSysteme("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.idSysteme === systeme.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {systeme.nom}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="typePanneDeclare">Type de panne</Label>
            <Input
              id="typePanneDeclare"
              name="typePanneDeclare"
              value={formData.typePanneDeclare}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenomContact">Nom du contact</Label>
              <Input
                id="prenomContact"
                name="prenomContact"
                value={formData.prenomContact}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephoneContact">Téléphone</Label>
              <Input
                id="telephoneContact"
                name="telephoneContact"
                value={formData.telephoneContact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sousGarantie"
                checked={formData.sousGarantie}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({...prev, sousGarantie: checked as boolean}))
                }
              />
              <Label htmlFor="sousGarantie">Sous garantie</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={formData.urgent}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({...prev, urgent: checked as boolean}))
                }
              />
              <Label htmlFor="urgent">Urgent</Label>
            </div>
          </div>

          <div className="border p-4 rounded-lg space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="planifierMaintenant"
                checked={planificationData.planifierMaintenant}
                onCheckedChange={(checked) => 
                  setPlanificationData(prev => ({...prev, planifierMaintenant: checked as boolean}))
                }
              />
              <Label htmlFor="planifierMaintenant">Planifier </Label>
            </div>

            {planificationData.planifierMaintenant && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="datePlanifiee">Date planifiée</Label>
                  <Input
                    id="datePlanifiee"
                    type="date"
                    value={planificationData.datePlanifiee}
                    onChange={(e) => handlePlanificationChange({
                      name: "datePlanifiee",
                      value: e.target.value
                    })}
                    required
                  />
                </div>

                {/* Sélecteur de technicien amélioré avec recherche */}
                <div className="space-y-2">
                  <Label htmlFor="technicien">Technicien</Label>
                  <Popover open={technicienComboOpen} onOpenChange={setTechnicienComboOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={technicienComboOpen}
                        className="w-full justify-between"
                      >
                        {planificationData.idTechnicien
                          ? techniciens.find(tech => tech.id.toString() === planificationData.idTechnicien)
                            ? `${techniciens.find(tech => tech.id.toString() === planificationData.idTechnicien).nom} ${techniciens.find(tech => tech.id.toString() === planificationData.idTechnicien).prenom}`
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
                                value={`${tech.nom} ${tech.prenom}`}
                                onSelect={() => {
                                  handlePlanificationChange({
                                    name: "idTechnicien",
                                    value: tech.id.toString()
                                  });
                                  setTechnicienComboOpen(false);
                                  setSearchTechnicien("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    planificationData.idTechnicien === tech.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {tech.nom} {tech.prenom}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-500 text-white">
            Créer
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);
};

export default CreateInterventionModal;
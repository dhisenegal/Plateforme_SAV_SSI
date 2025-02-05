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
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
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
  interface FormErrors {
    idClient: boolean;
    idSite: boolean;
    idSysteme: boolean;
    typePanneDeclare: boolean;
    prenomContact: boolean;
    telephoneContact: boolean;
    datePlanifiee: boolean;
    idTechnicien: boolean;
  }
  const validateForm = () => {
    const errors = {
      idClient: !formData.idClient,
      idSite: !formData.idSite,
      idSysteme: !formData.idSysteme,
      typePanneDeclare: !formData.typePanneDeclare,
      prenomContact: !formData.prenomContact,
      telephoneContact: !formData.telephoneContact,
      datePlanifiee: planificationData.planifierMaintenant && !planificationData.datePlanifiee,
      idTechnicien: planificationData.planifierMaintenant && !planificationData.idTechnicien
    };

    return !Object.values(errors).some(error => error);
  };

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
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select 
                value={formData.idClient} 
                onValueChange={(value) => handleSelectChange("idClient", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
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

            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Select 
                value={formData.idSite} 
                onValueChange={(value) => handleSelectChange("idSite", value)}
                disabled={!formData.idClient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      {site.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systeme">Système</Label>
              <Select 
                value={formData.idSysteme} 
                onValueChange={(value) => handleSelectChange("idSysteme", value)}
                disabled={!formData.idSite}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un système" />
                </SelectTrigger>
                <SelectContent>
                  {systemes.map((systeme) => (
                    <SelectItem key={systeme.id} value={systeme.id.toString()}>
                      {systeme.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Label htmlFor="planifierMaintenant">Planifier maintenant</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="technicien">Technicien</Label>
                    <Select 
                      value={planificationData.idTechnicien}
                      onValueChange={(value) => handlePlanificationChange({
                        name: "idTechnicien",
                        value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un technicien" />
                      </SelectTrigger>
                      <SelectContent>
                        {techniciens.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id.toString()}>
                            {`${tech.nom} ${tech.prenom}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
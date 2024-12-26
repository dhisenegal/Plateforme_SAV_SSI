"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getAllClients, getSitesByClient } from "@/actions/sav/site";
import { getAllSystemes } from "@/actions/admin/equipement";
import { getAllTechniciens } from "@/actions/sav/technicien";
import { createIntervention } from "@/actions/sav/intervention";
import { toast } from "react-toastify";

const CreateInterventionModal = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    typePanneDeclare: "",
    dateDeclaration: new Date().toISOString().split('T')[0],
    idClient: "",
    idSite: "",
    idSysteme: "",
    prenomContact: "",
    telephoneContact: "",
    adresse: "",
    numero: "",
  });

  const [planificationData, setPlanificationData] = useState({
    planifierMaintenant: false,
    datePlanifiee: "",
    idTechnicien: "",
    statut: "",
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
    try {
      const interventionData = {
        ...formData,
        idClient: parseInt(formData.idClient),
        idSite: parseInt(formData.idSite),
        idSysteme: parseInt(formData.idSysteme),
        numero: formData.numero ? parseInt(formData.numero) : null,
        dateDeclaration: new Date(formData.dateDeclaration),
        // Ajouter les données de planification seulement si la case est cochée
        ...(planificationData.planifierMaintenant && {
          datePlanifiee: new Date(planificationData.datePlanifiee),
          idTechnicien: parseInt(planificationData.idTechnicien),
          statut: "PLANIFIE"
        })
      };

      const newIntervention = await createIntervention(interventionData);
      toast.success("Intervention créée avec succès");
      onCreate(newIntervention);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de la création de l'intervention");
      console.error(error);
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white flex items-center">
          <FaPlus className="w-5 h-5 mr-2" />
          Créer une intervention
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une intervention</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle intervention.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations de base */}
          <div className="space-y-4">
            <Select value={formData.idClient} onValueChange={(value) => handleSelectChange("idClient", value)}>
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

            <Input
              name="typePanneDeclare"
              placeholder="Type de panne déclarée"
              value={formData.typePanneDeclare}
              onChange={handleChange}
              required
            />

            <Input
              name="prenomContact"
              placeholder="Nom du contact"
              value={formData.prenomContact}
              onChange={handleChange}
            />

            <Input
              name="telephoneContact"
              placeholder="Téléphone du contact"
              value={formData.telephoneContact}
              onChange={handleChange}
            />
            <Input
              name="adresse"
              placeholder="Adresse du contact"
              value={formData.adresse}
              onChange={handleChange}
                />
            {/* Section Planification */}
            <div className="space-y-4 border p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="planifierMaintenant"
                  name="planifierMaintenant"
                  checked={planificationData.planifierMaintenant}
                  onCheckedChange={(checked) => 
                    setPlanificationData(prev => ({...prev, planifierMaintenant: checked}))
                  }
                />
                <Label htmlFor="planifierMaintenant">Planifier maintenant</Label>
              </div>

              {planificationData.planifierMaintenant && (
                <div className="space-y-4">
                  <Input
                    name="datePlanifiee"
                    type="date"
                    value={planificationData.datePlanifiee}
                    onChange={(e) => handlePlanificationChange({
                      name: "datePlanifiee",
                      value: e.target.value
                    })}
                    required
                  />

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
                      {techniciens.map((technicien) => (
                        <SelectItem key={technicien.id} value={technicien.id.toString()}>
                          {`${technicien.nom} ${technicien.prenom}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
    </>
  );
};

export default CreateInterventionModal;
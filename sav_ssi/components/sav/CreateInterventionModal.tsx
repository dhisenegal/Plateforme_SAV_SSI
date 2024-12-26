"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getAllClients, getSitesByClient } from "@/actions/sav/site";
import { getInstallationsBySite, createDemandeIntervention } from "@/actions/sav/intervention";
import { toast } from "react-toastify";

const CreateInterventionModal = ({ onCreate }) => {
  // États pour la demande d'intervention
  const [typePanneDeclare, setTypePanneDeclare] = useState("");
  const [dateDeclaration, setDateDeclaration] = useState("");
  const [idClient, setIdClient] = useState("");
  const [idSite, setIdSite] = useState("");
  const [idInstallation, setIdInstallation] = useState("");
  const [idSysteme, setIdSysteme] = useState("");

  // États pour les listes déroulantes
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [systemes, setSystemes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Chargement initial des clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getAllClients();
        setClients(clientsData);
      } catch (error) {
        toast.error("Erreur lors du chargement des clients");
      }
    };
    fetchClients();
  }, []);

  // Chargement des sites lors du changement de client
  useEffect(() => {
    const fetchSites = async () => {
      if (idClient) {
        try {
          const sitesData = await getSitesByClient(parseInt(idClient));
          setSites(sitesData);
          setIdSite("");
          setInstallations([]);
          setSystemes([]);
        } catch (error) {
          toast.error("Erreur lors du chargement des sites");
        }
      }
    };
    fetchSites();
  }, [idClient]);

  // Chargement des installations lors du changement de site
  useEffect(() => {
    const fetchInstallations = async () => {
      if (idSite) {
        try {
          const installationsData = await getInstallationsBySite(parseInt(idSite));
          setInstallations(installationsData);
          setIdInstallation("");
          setSystemes([]);
        } catch (error) {
          toast.error("Erreur lors du chargement des installations");
        }
      }
    };
    fetchInstallations();
  }, [idSite]);

  // Chargement des systèmes lors du changement d'installation
  useEffect(() => {
    if (idInstallation) {
      const selectedInstallation = installations.find(installation => installation.id === parseInt(idInstallation));
      if (selectedInstallation) {
        setSystemes([selectedInstallation.Systeme]);
      }
    }
  }, [idInstallation, installations]);

  const resetForm = () => {
    setTypePanneDeclare("");
    setDateDeclaration("");
    setIdClient("");
    setIdSite("");
    setIdInstallation("");
    setIdSysteme("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Création de la demande d'intervention
      const newDemande = await createDemandeIntervention({
        typePanneDeclare,
        dateDeclaration: new Date(dateDeclaration),
        idClient: parseInt(idClient),
        idSite: parseInt(idSite),
        idInstallation: parseInt(idInstallation),
      });

      toast.success("Demande d'intervention créée avec succès");
      onCreate(newDemande);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de la création de la demande d'intervention");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white flex items-center">
          <FaPlus className="w-5 h-5 mr-2" />
          Créer une intervention
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une intervention</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle intervention.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Informations de la demande */}
            <div className="space-y-4">
              <h3 className="font-semibold">Informations de la demande</h3>
              <Input
                placeholder="Type de panne"
                value={typePanneDeclare}
                onChange={(e) => setTypePanneDeclare(e.target.value)}
                required
              />
              <Input
                type="date"
                value={dateDeclaration}
                onChange={(e) => setDateDeclaration(e.target.value)}
                required
              />
              <Select value={idClient} onValueChange={setIdClient}>
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
              <Select value={idSite} onValueChange={setIdSite}>
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
              <Select value={idInstallation} onValueChange={setIdInstallation}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une installation" />
                </SelectTrigger>
                <SelectContent>
                  {installations.map((installation) => (
                    <SelectItem key={installation.id} value={installation.id.toString()}>
                      {installation.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={idSysteme} onValueChange={setIdSysteme}>
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
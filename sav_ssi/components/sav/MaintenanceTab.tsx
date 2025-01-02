"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { planifierMaintenance } from '@/actions/sav/maintenance';
import { getAllTechniciens } from '@/actions/sav/technicien';
import { getContactsBySite } from '@/actions/sav/contact';
import { getInstallationsBySite } from '@/actions/sav/installation';

const MaintenanceTab = ({ siteId }: { siteId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [installations, setInstallations] = useState<any[]>([]);
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
  const [techniciens, setTechniciens] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    numero: '',
    dateMaintenance: '',
    description: '',
    typeMaintenance: '',
    idTechnicien: 0,
    idContact: 0,
    idInstallation: 0
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [installationsData, techniciensData, contactsData] = await Promise.all([
          getInstallationsBySite(siteId),
          getAllTechniciens(),
          getContactsBySite(siteId)
        ]);

        setInstallations(installationsData);
        setTechniciens(techniciensData);
        setContacts(contactsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    if (isOpen) {
      loadInitialData();
    }
  }, [siteId, isOpen]);

  const handleInstallationSelect = (installationId: string) => {
    const installation = installations.find(i => i.id === parseInt(installationId));
    setSelectedInstallation(installation);
    setFormData(prev => ({ ...prev, idInstallation: parseInt(installationId) }));
  };

  const handleSubmit = async () => {
    try {
      await planifierMaintenance({
        ...formData,
        idSite: siteId,
        statut: 'PLANIFIE',
        dateMaintenance: new Date(formData.dateMaintenance).toISOString()
      });
      setIsOpen(false);
      // Vous pouvez ajouter ici un callback pour rafraîchir la liste des maintenances
    } catch (error) {
      console.error("Erreur lors de la planification:", error);
    }
  };

  return (
    <div className="w-full">
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        Planifier une maintenance
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Planifier une nouvelle maintenance</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Installation</label>
                <Select onValueChange={handleInstallationSelect}>
                  <SelectTrigger>
                    Sélectionner une installation
                  </SelectTrigger>
                  <SelectContent>
                    {installations.map((installation) => (
                      <SelectItem key={installation.id} value={installation.id.toString()}>
                        {`${installation.Systeme.nom} - Installé le ${new Date(installation.dateInstallation).toLocaleDateString()}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedInstallation && (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Détails de l'installation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Système: {selectedInstallation.Systeme.nom}</p>
                      <p>Date d'installation: {new Date(selectedInstallation.dateInstallation).toLocaleDateString()}</p>
                      {selectedInstallation.dateMaintenance && (
                        <p>Dernière maintenance: {new Date(selectedInstallation.dateMaintenance).toLocaleDateString()}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Numéro</label>
                <Input
                  value={formData.numero}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                  placeholder="Numéro de maintenance"
                />
              </div>

              <div>
                <label className="block mb-2">Date prévue</label>
                <Input
                  type="date"
                  value={formData.dateMaintenance}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateMaintenance: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description des travaux à effectuer"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Type de maintenance</label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, typeMaintenance: value }))}>
                  <SelectTrigger>
                    Sélectionner un type
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Préventive</SelectItem>
                    <SelectItem value="curative">Curative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2">Technicien</label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, idTechnicien: parseInt(value) }))}>
                  <SelectTrigger>
                    Sélectionner un technicien
                  </SelectTrigger>
                  <SelectContent>
                    {techniciens.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id.toString()}>
                        {`${tech.prenom} ${tech.nom}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2">Contact sur site</label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, idContact: parseInt(value) }))}>
                  <SelectTrigger>
                    Sélectionner un contact
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id.toString()}>
                        {`${contact.prenom} ${contact.nom}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Planifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceTab;
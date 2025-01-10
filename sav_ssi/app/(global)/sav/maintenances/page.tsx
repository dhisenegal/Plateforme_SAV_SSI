"use client";

import React, { useState, useEffect } from "react";
import { FaSpinner, FaPause, FaEdit, FaPlus, FaHistory, FaCheck } from "react-icons/fa";
import { getAllMaintenances, updateMaintenanceStatus, planifierMaintenanceGlobal, replanifierMaintenance, marquerMaintenanceEffectuee } from "@/actions/sav/maintenance";
import { getClients } from "@/actions/sav/client";
import { getSitesByClient } from "@/actions/sav/site";
import { getAllTechniciens } from "@/actions/sav/technicien";
import { getContactsBySite } from "@/actions/sav/contact";
import { getInstallationsBySite } from "@/actions/sav/installation";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MaintenancesPage = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isReplanifierOpen, setIsReplanifierOpen] = useState(false);
  const [nouvelleDateMaintenance, setNouvelleDateMaintenance] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [installations, setInstallations] = useState<any[]>([]);
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
  const [techniciens, setTechniciens] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    numero: '',
    dateMaintenance: '',
    description: '',
    typeMaintenance: '',
    idClient: 0,
    idSite: 0,
    idTechnicien: 0,
    idContact: 0,
    idInstallation: 0
  });
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const { maintenances: maintenancesData, total: totalMaintenances } = await getAllMaintenances(
        page,
        pageSize,
        searchQuery,
        dateDebut,
        dateFin,
        statusFilter
      );
      setMaintenances(maintenancesData);
      setTotal(totalMaintenances);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
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

  const handlePause = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'SUSPENDU' ? 'PLANIFIE' : 'SUSPENDU';
      await updateMaintenanceStatus(id, newStatus);
      fetchMaintenances();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handleShowHistory = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsHistoryOpen(true);
  };

  const handleReplanifier = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsReplanifierOpen(true);
  };

  const handleConfirmReplanification = async () => {
    try {
      await replanifierMaintenance(selectedMaintenance.id, new Date(nouvelleDateMaintenance));
      setIsReplanifierOpen(false);
      fetchMaintenances();
    } catch (error) {
      console.error("Erreur lors de la replanification:", error);
    }
  };

  const handleMarquerEffectuee = async (planificationId) => {
    try {
      await marquerMaintenanceEffectuee(planificationId);
      fetchMaintenances();
    } catch (error) {
      console.error("Erreur lors du marquage comme effectuée:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await planifierMaintenanceGlobal({
        ...formData,
        statut: 'PLANIFIE',
        dateMaintenance: new Date(formData.dateMaintenance).toISOString()
      });
      setIsOpen(false);
      fetchMaintenances();
    } catch (error) {
      console.error("Erreur lors de la planification:", error);
    }
  };

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
        <Button className="flex items-center bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsOpen(true)}>
          <FaPlus className="mr-2" />
          Planifier Maintenance
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Système</TableHead>
            <TableHead>Date Prévue</TableHead>
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
              <TableCell>
                {maintenance.Planifications[0]?.date 
                  ? new Date(maintenance.Planifications[0].date).toLocaleDateString()
                  : "Non planifiée"}
              </TableCell>
              <TableCell>{maintenance.statut}</TableCell>
              <TableCell>{`${maintenance.Technicien.prenom} ${maintenance.Technicien.nom}`}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  className="text-blue-500"
                  onClick={() => handleShowHistory(maintenance)}
                >
                  <FaHistory />
                </Button>
                <Button
                  variant="outline"
                  className="text-green-500"
                  onClick={() => handleReplanifier(maintenance)}
                >
                  <FaPlus />
                </Button>
                {maintenance.Planifications[0] && !maintenance.Planifications[0].effectif && (
                  <Button
                    variant="outline"
                    className="text-orange-500"
                    onClick={() => handleMarquerEffectuee(maintenance.Planifications[0].id)}
                  >
                    <FaCheck />
                  </Button>
                )}
                <Button
                  variant="outline"
                  className={maintenance.statut === 'SUSPENDU' ? 'text-red-500' : 'text-green-500'}
                  onClick={() => handlePause(maintenance.id, maintenance.statut)}
                >
                  <FaPause />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-4">
        <div className="text-white p-2 rounded-lg flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`px-3 py-1 rounded ${page === index + 1 ? 'bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Planifier une nouvelle maintenance</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Client</label>
                <Select onValueChange={handleClientSelect}>
                  <SelectTrigger>
                    Sélectionner un client
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

              <div>
                <label className="block mb-2">Site</label>
                <Select onValueChange={handleSiteSelect}>
                  <SelectTrigger>
                    Sélectionner un site
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
            </div>

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
                <label className="block mb-2">Numéro
                </label>
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

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Historique des planifications</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedMaintenance?.Planifications.map((planif, index) => (
              <div key={planif.id} className="mb-4 p-4 border rounded">
                <p className="font-bold">
                  {index === 0 ? "Dernière planification" : `Planification #${selectedMaintenance.Planifications.length - index}`}
                </p>
                <p>Date: {new Date(planif.date).toLocaleDateString()}</p>
                <p>Type: {planif.previsionnel ? "Prévisionnelle" : "Replanification"}</p>
                <p>Statut: {planif.effectif ? "Effectuée" : "Non effectuée"}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReplanifierOpen} onOpenChange={setIsReplanifierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replanifier la maintenance</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="date"
              value={nouvelleDateMaintenance}
              onChange={(e) => setNouvelleDateMaintenance(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplanifierOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmReplanification}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenancesPage;
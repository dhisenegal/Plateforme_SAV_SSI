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
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaComment } from "react-icons/fa";
import { useSession } from "next-auth/react";
import ModifierMaintenanceDialog from "@/components/sav/ModifierMaintenanceDialog";

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
  const [statusFilter, setStatusFilter] = useState('');
  const [commentaireOpen, setCommentaireOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [commentaire, setCommentaire] = useState('');
  const [commentaires, setCommentaires] = useState<any[]>([]);
  const [isModificationOpen, setIsModificationOpen] = useState(false);
  const [maintenanceToModify, setMaintenanceToModify] = useState(null);

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

  const handleSubmit = async () => {
    try {
      await planifierMaintenanceGlobal({
        ...formData,
        statut: 'PLANIFIE',
        datePlanifiee: new Date(formData.datePlanifiee).toISOString()
      });
      setIsOpen(false);
      // Refresh the list of maintenances
      fetchMaintenances();
    } catch (error) {
      console.error("Erreur lors de la planification:", error);
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
                  className={maintenance.statut === 'SUSPENDU' ? 'text-red-500' : 'text-green-500'}
                  onClick={() => handlePause(maintenance.id, maintenance.statut)}
                >
                  <FaPause />
                </Button>
                <Button 
                  variant="outline" 
                  className="text-blue-500" 
                  onClick={() => handleEdit(maintenance)}
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
                  value={formData.datePlanifiee}
                  onChange={(e) => setFormData(prev => ({ ...prev, datePlanifiee: e.target.value }))}
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
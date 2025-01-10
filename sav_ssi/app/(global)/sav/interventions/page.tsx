"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { fr } from "date-fns/locale";
import { FaPlus, FaEdit, FaTrash, FaPause, FaPlay, FaCalendarAlt, FaSpinner, FaClock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { getAllTechniciens } from "@/actions/sav/technicien";
import { getInterventions, updateIntervention, deleteIntervention, updateInterventionComment } from "@/actions/sav/intervention";
import CreateInterventionModal from "@/components/sav/CreateInterventionModal";

const InterventionsList = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [totalInterventions, setTotalInterventions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [planningModalOpen, setPlanningModalOpen] = useState(false);
  const [justificationModalOpen, setJustificationModalOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [justification, setJustification] = useState("");
  const [planningData, setPlanningData] = useState({
    datePlanifiee: "",
    idTechnicien: "",
  });
  const itemsPerPage = 10;
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const technicienData = await getAllTechniciens();
        setTechniciens(technicienData);
      } catch (error) {
        toast.error("Erreur lors du chargement des techniciens");
      }
    };

    fetchTechniciens();
  }, []);

  useEffect(() => {
    // Vérifier si on vient de la page overview avec le filtre overdue
    const overdueFilter = searchParams.get("overdue");
    if (overdueFilter === "true") {
      // Logique pour filtrer les interventions en retard
      setStartDate("");
      setEndDate("");
      setStatusFilter("NON_PLANIFIE");
    } else {
      // Récupérer le status depuis l'URL si présent
      const statusFromUrl = searchParams.get("status");
      if (statusFromUrl) {
        setStatusFilter(statusFromUrl);
      }
    }
    fetchInterventions();
  }, [currentPage, searchQuery, statusFilter, startDate, endDate, searchParams]);

  const fetchInterventions = useCallback(async () => {
    try {
      const { interventions, total } = await getInterventions(
        currentPage,
        itemsPerPage,
        searchQuery,
        statusFilter,
        null,
        null,
        startDate,
        endDate
      );
      setInterventions(interventions);
      setTotalInterventions(total);
    } catch (error) {
      toast.error("Erreur lors du chargement des interventions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, startDate, endDate]);

  const isInterventionOverdue = useCallback((intervention) => {
    if (!intervention.datePlanifiee) return false;
    const planifiedDate = new Date(intervention.datePlanifiee);
    const today = new Date();
    return planifiedDate < today && intervention.statut !== "TERMINE";
  }, []);

  const getStatusBadge = useCallback((status) => {
    const statusStyles = {
      NON_PLANIFIE: "bg-gray-500",
      PLANIFIE: "bg-yellow-500",
      EN_COURS: "bg-blue-500",
      SUSPENDU: "bg-red-500",
      TERMINE: "bg-green-500"
    };

    return (
      <Badge className={`${statusStyles[status]} text-white`}>
        {status}
      </Badge>
    );
  }, []);

  const handleStatusUpdate = useCallback(async (intervention, newStatus) => {
    try {
      await updateIntervention(intervention.id, { statut: newStatus });
      toast.success("Statut mis à jour avec succès");
      fetchInterventions();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  }, [fetchInterventions]);

  const handlePlanningSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await updateIntervention(selectedIntervention.id, {
        datePlanifiee: new Date(planningData.datePlanifiee),
        idTechnicien: parseInt(planningData.idTechnicien),
        statut: "PLANIFIE"
      });
      toast.success("Planification mise à jour avec succès");
      setPlanningModalOpen(false);
      fetchInterventions();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la planification");
    }
  }, [fetchInterventions, planningData, selectedIntervention]);

  interface Intervention {
    id: number;
    numero: string;
    Client?: { nom: string };
    Site?: { nom: string };
    Systeme?: { nom: string };
    typePanneDeclare: string;
    prenomContact: string;
    telephoneContact: string;
    dateDeclaration: string;
    datePlanifiee?: string;
    Technicien?: { nom: string; prenom: string };
    statut: string;
    commentaire?: string;
    diagnostics?: string;
    travauxRealises?: string;
    pieceFournies?: string;
  }

  interface PlanningData {
    datePlanifiee: string;
    idTechnicien: string;
  }

  const handleJustificationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntervention) return;
    
    try {
      await updateInterventionComment(selectedIntervention.id, justification);
      toast.success("Justification enregistrée avec succès");
      setJustificationModalOpen(false);
      setJustification("");
      fetchInterventions();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la justification");
    }
  };


  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      try {
        await deleteIntervention(id);
        toast.success("Intervention supprimée avec succès");
        fetchInterventions();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  }, [fetchInterventions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3">
        <FaSpinner className="animate-spin" />
        Chargement en cours...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interventions</h1>
        <CreateInterventionModal onCreate={fetchInterventions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="NON_PLANIFIE">Non planifié</SelectItem>
            <SelectItem value="PLANIFIE">Planifié</SelectItem>
            <SelectItem value="EN_COURS">En cours</SelectItem>
            <SelectItem value="SUSPENDU">Suspendu</SelectItem>
            <SelectItem value="TERMINE">Terminé</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Date début"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Date fin"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date Planifiée</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Technicien</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interventions.map((intervention) => (
            <TableRow 
              key={intervention.id}
              className={isInterventionOverdue(intervention) ? "bg-red-50" : ""}
            >
              <TableCell>{intervention.numero}</TableCell>
              <TableCell>{intervention.Client?.nom}</TableCell>
              <TableCell>
                {intervention.datePlanifiee && 
                  format(new Date(intervention.datePlanifiee), "dd/MM/yyyy", { locale: fr })}
              </TableCell>
              <TableCell>
                {intervention.prenomContact || "-"}<br/>
                {intervention.telephoneContact || "-"}
              </TableCell>
              <TableCell>
                {intervention.Technicien 
                  ? `${intervention.Technicien.nom} ${intervention.Technicien.prenom}`
                  : "-"}
              </TableCell>
              <TableCell>
                {getStatusBadge(intervention.statut)}
                {isInterventionOverdue(intervention) && (
                  <Badge className="ml-2 bg-red-500">Hors délai</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <FaCalendarAlt 
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      setSelectedIntervention(intervention);
                      setPlanningModalOpen(true);
                    }}
                  />
                  {intervention.statut !== "SUSPENDU" ? (
                    <FaPause
                      className="cursor-pointer text-yellow-500"
                      onClick={() => handleStatusUpdate(intervention, "SUSPENDU")}
                    />
                  ) : (
                    <FaPlay
                      className="cursor-pointer text-green-500"
                      onClick={() => handleStatusUpdate(intervention, "EN_COURS")}
                    />
                  )}
                  {isInterventionOverdue(intervention) && !intervention.commentaire && (
                    <FaClock
                      className="cursor-pointer text-orange-500"
                      onClick={() => {
                        setSelectedIntervention(intervention);
                        setJustificationModalOpen(true);
                      }}
                      title="Justifier le retard"
                    />
                  )}
                  <FaTrash
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(intervention.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          Total: {totalInterventions} intervention(s)
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(totalInterventions / itemsPerPage) }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "bg-blue-600" : "bg-blue-500"}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={planningModalOpen} onOpenChange={setPlanningModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Planifier l'intervention</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePlanningSubmit} className="space-y-4">
            <div className="space-y-4">
              <Input
                type="date"
                value={planningData.datePlanifiee}
                onChange={(e) => setPlanningData(prev => ({
                  ...prev,
                  datePlanifiee: e.target.value
                }))}
                required
              />

              <Select 
                value={planningData.idTechnicien}
                onValueChange={(value) => setPlanningData(prev => ({
                  ...prev,
                  idTechnicien: value
                }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un technicien" />
                </SelectTrigger>
                <SelectContent>
                  {techniciens.length > 0 ? (
                    techniciens.map((technicien) => (
                      <SelectItem key={technicien.id} value={technicien.id.toString()}>
                        {technicien.nom} {technicien.prenom}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">Aucun technicien disponible</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setPlanningModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Planifier
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={justificationModalOpen} onOpenChange={setJustificationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justifier le retard</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJustificationSubmit} className="space-y-4">
            <Textarea
              placeholder="Entrez votre justification..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setJustificationModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal pour afficher les détails d'une intervention */}
      <Dialog open={selectedIntervention && !planningModalOpen && !justificationModalOpen} 
             onOpenChange={() => setSelectedIntervention(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'intervention #{selectedIntervention?.numero}</DialogTitle>
          </DialogHeader>
          {selectedIntervention && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <strong>Client:</strong>
                  <p>{selectedIntervention.Client?.nom}</p>
                </div>
                <div>
                  <strong>Site:</strong>
                  <p>{selectedIntervention.Site?.nom}</p>
                </div>
                <div>
                  <strong>Système:</strong>
                  <p>{selectedIntervention.Systeme?.nom}</p>
                </div>
                <div>
                  <strong>Type de panne:</strong>
                  <p>{selectedIntervention.typePanneDeclare}</p>
                </div>
                <div>
                  <strong>Contact:</strong>
                  <p>{selectedIntervention.prenomContact} - {selectedIntervention.telephoneContact}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Date de déclaration:</strong>
                  <p>{format(new Date(selectedIntervention.dateDeclaration), "dd/MM/yyyy", { locale: fr })}</p>
                </div>
                <div>
                  <strong>Date planifiée:</strong>
                  <p>{selectedIntervention.datePlanifiee ? 
                     format(new Date(selectedIntervention.datePlanifiee), "dd/MM/yyyy", { locale: fr }) : 
                     "Non planifiée"}</p>
                </div>
                <div>
                  <strong>Technicien:</strong>
                  <p>{selectedIntervention.Technicien ? 
                     `${selectedIntervention.Technicien.nom} ${selectedIntervention.Technicien.prenom}` : 
                     "Non assigné"}</p>
                </div>
                <div>
                  <strong>Statut:</strong>
                  <p>{selectedIntervention.statut}</p>
                </div>
                {selectedIntervention.commentaire && (
                  <div>
                    <strong>Justification du retard:</strong>
                    <p className="text-red-500">{selectedIntervention.commentaire}</p>
                  </div>
                )}
              </div>
              {selectedIntervention.diagnostics && (
                <div className="col-span-2">
                  <strong>Diagnostics:</strong>
                  <p>{selectedIntervention.diagnostics}</p>
                </div>
              )}
              {selectedIntervention.travauxRealises && (
                <div className="col-span-2">
                  <strong>Travaux réalisés:</strong>
                  <p>{selectedIntervention.travauxRealises}</p>
                </div>
              )}
              {selectedIntervention.pieceFournies && (
                <div className="col-span-2">
                  <strong>Pièces fournies:</strong>
                  <p>{selectedIntervention.pieceFournies}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterventionsList;
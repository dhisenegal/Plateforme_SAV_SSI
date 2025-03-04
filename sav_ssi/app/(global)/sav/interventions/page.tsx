"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { fr } from "date-fns/locale";
import { FaPlus, FaEdit, FaTrash, FaPause, FaPlay, FaCalendarAlt, FaSpinner, FaComment, FaDownload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { getAllTechniciens } from "@/actions/sav/technicien";
import { getInterventions, updateIntervention, deleteIntervention } from "@/actions/sav/intervention";
import CreateInterventionModal from "@/components/sav/CreateInterventionModal";
import CommentModal from "@/components/sav/CommentModal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [planningData, setPlanningData] = useState({
    datePlanifiee: "",
    idTechnicien: "",
  });
  const itemsPerPage = 10;
  const searchParams = useSearchParams();
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedInterventionForComment, setSelectedInterventionForComment] = useState(null);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const { data: session } = useSession();
  const currentUser = session?.user?.id;

  // États pour les sélecteurs améliorés
  const [technicienComboOpen, setTechnicienComboOpen] = useState(false);
  const [searchTechnicien, setSearchTechnicien] = useState("");
  const [statusComboOpen, setStatusComboOpen] = useState(false);
  

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
    fetchInterventions();
  }, [currentPage, searchQuery, statusFilter, startDate, endDate]);

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

  useEffect(() => {
    // Récupérer le statut depuis l'URL si présent
    const statusFromUrl = searchParams.get("status");
    if (statusFromUrl) {
      setStatusFilter(statusFromUrl);
    }
  }, [searchParams]);

  const getStatusBadge = useCallback((status) => {
    const statusStyles = {
      NON_PLANIFIE: "bg-gray-500",
      PLANIFIE: "bg-yellow-500",
      EN_COURS: "bg-blue-500",
      SUSPENDU: "bg-red-500",
      TERMINE: "bg-green-500",
    };

    return (
      <Badge className={`${statusStyles[status]} text-white`}>
        {status}
      </Badge>
    );
  }, []);

  const handleStatusUpdate = useCallback(async (intervention, newStatus) => {
    setSelectedInterventionForComment(intervention);
    setNewStatus(newStatus);
    setStatusChangeModalOpen(true);
  }, []);

  const handleCommentModalClose = () => {
    setCommentModalOpen(false);
    setStatusChangeModalOpen(false);
    setSelectedInterventionForComment(null);
    setNewStatus(null);
    fetchInterventions();
  };

  const handlePlanningSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validation de la date
    const selectedDate = new Date(planningData.datePlanifiee);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour la comparaison

    if (selectedDate < today) {
      toast.error("La date de planification ne peut pas être antérieure à aujourd'hui");
      return;
    }

    try {
      await updateIntervention(selectedIntervention.id, {
        datePlanifiee: new Date(planningData.datePlanifiee),
        idTechnicien: parseInt(planningData.idTechnicien),
        statut: "PLANIFIE",
      });
      toast.success("Planification mise à jour avec succès");
      setPlanningModalOpen(false);
      fetchInterventions();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la planification");
    }
  }, [fetchInterventions, planningData, selectedIntervention]);

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

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filtrer les techniciens basés sur la recherche
  const filteredTechniciens = techniciens.filter((technicien) =>
    `${technicien.nom} ${technicien.prenom}`.toLowerCase().includes(searchTechnicien.toLowerCase())
  );

  // Options de statut pour le dropdown
  const statusOptions = [
    { value: "", label: "Tous les statuts" },
    { value: "NON_PLANIFIE", label: "Non planifié" },
    { value: "PLANIFIE", label: "Planifié" },
    { value: "EN_COURS", label: "En cours" },
    { value: "SUSPENDU", label: "Suspendu" },
    { value: "TERMINE", label: "Terminé" },
  ];

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

      {/* Sélecteur de statut amélioré avec défilement */}
      <Popover open={statusComboOpen} onOpenChange={setStatusComboOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={statusComboOpen}
            className="w-full justify-between"
          >
            {statusFilter
              ? statusOptions.find((status) => status.value === statusFilter)?.label
              : "Tous les statuts"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Filtrer les statuts..." />
            <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-48">
                {statusOptions.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.label}
                    onSelect={() => {
                      setStatusFilter(status.value);
                      setStatusComboOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        statusFilter === status.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {status.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

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
          <TableHead>Date effectuée</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Technicien</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interventions.map((intervention) => (
          <TableRow key={intervention.id}>
            <TableCell>{intervention.numero}</TableCell>
            <TableCell>{intervention.Client.nom}</TableCell>
            <TableCell>
              {intervention.datePlanifiee &&
                format(new Date(intervention.datePlanifiee), "dd/MM/yyyy", { locale: fr })}
            </TableCell>
            <TableCell>
              {intervention.dateIntervention &&
                format(new Date(intervention.dateIntervention), "dd/MM/yyyy", { locale: fr }) || "-"}
            </TableCell>
            <TableCell>
              {intervention.prenomContact || "-"}<br />
              {intervention.telephoneContact || "-"}
            </TableCell>
            <TableCell>
              {intervention.Technicien
                ? `${intervention.Technicien.nom} ${intervention.Technicien.prenom}`
                : "-"}
            </TableCell>
            <TableCell>{getStatusBadge(intervention.statut)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <FaComment
                  className="cursor-pointer text-blue-500"
                  onClick={() => {
                    setSelectedInterventionForComment(intervention);
                    setCommentModalOpen(true);
                  }}
                />
                <FaCalendarAlt
                  className={`cursor-pointer text-blue-500 ${
                    intervention.statut === "TERMINE" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (intervention.statut !== "TERMINE") {
                      setSelectedIntervention(intervention);
                      setPlanningModalOpen(true);
                    }
                  }}
                />

                {intervention.statut !== "SUSPENDU" ? (
                  <FaPause
                    className={`cursor-pointer text-yellow-500 ${
                      intervention.statut === "TERMINE" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      intervention.statut !== "TERMINE" && handleStatusUpdate(intervention, "SUSPENDU")
                    }
                  />
                ) : (
                  <FaPlay
                    className={`cursor-pointer text-green-500 ${
                      intervention.statut === "TERMINE" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      intervention.statut !== "TERMINE" && handleStatusUpdate(intervention, "EN_COURS")
                    }
                  />
                )}
                <FaTrash
                  className="cursor-pointer text-red-500"
                  onClick={() => handleDelete(intervention.id)}
                />
                <Link href={`/sav/interventions/${intervention.id}`}>
                  <FaDownload
                    className="cursor-pointer text-blue-500"
                    title="Cliquez pour télécharger le rapport"
                  />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <div className="flex justify-between items-center mt-4">
      <div>Total: {totalInterventions} intervention(s)</div>
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
              min={getCurrentDate()}
              value={planningData.datePlanifiee}
              onChange={(e) => {
                const selected = e.target.value;
                // Validation instantanée
                if (new Date(selected) < new Date(getCurrentDate())) {
                  toast.error("Date invalide");
                  return;
                }
                setPlanningData((prev) => ({ ...prev, datePlanifiee: selected }));
              }}
              required
            />

            {/* Sélecteur de technicien amélioré avec recherche et défilement */}
            <Popover open={technicienComboOpen} onOpenChange={setTechnicienComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={technicienComboOpen}
                  className="w-full justify-between"
                >
                  {planningData.idTechnicien
                    ? techniciens.find((tech) => tech.id.toString() === planningData.idTechnicien)
                      ? `${techniciens.find((tech) => tech.id.toString() === planningData.idTechnicien).nom} ${techniciens.find((tech) => tech.id.toString() === planningData.idTechnicien).prenom}`
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
                  <CommandEmpty>Aucun technicien disponible</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-64">
                      {filteredTechniciens.map((technicien) => (
                        <CommandItem
                          key={technicien.id}
                          value={`${technicien.nom} ${technicien.prenom}`}
                          onSelect={() => {
                            setPlanningData((prev) => ({
                              ...prev,
                              idTechnicien: technicien.id.toString(),
                            }));
                            setTechnicienComboOpen(false);
                            setSearchTechnicien("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              planningData.idTechnicien === technicien.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {technicien.nom} {technicien.prenom}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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

    <CommentModal
      isOpen={commentModalOpen}
      onClose={handleCommentModalClose}
      intervention={selectedInterventionForComment}
      onCommentAdded={fetchInterventions}
      currentUser={currentUser}
    />

    <CommentModal
      isOpen={statusChangeModalOpen}
      onClose={handleCommentModalClose}
      intervention={selectedInterventionForComment}
      onCommentAdded={fetchInterventions}
      requiredComment={true}
      newStatus={newStatus}
      currentUser={currentUser}
    />
  </div>
);
};

export default InterventionsList;
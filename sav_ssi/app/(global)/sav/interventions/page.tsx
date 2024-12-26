"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { getInterventions } from "@/actions/sav/intervention";
import CreateInterventionModal from "@/components/sav/CreateInterventionModal"; // Import the modal component

const InterventionsList = () => {
  // États
  const [interventions, setInterventions] = useState([]);
  const [totalInterventions, setTotalInterventions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 10;

  // Chargement des interventions
  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const { interventions, total } = await getInterventions(
          currentPage,
          itemsPerPage,
          searchQuery,
          statusFilter,
          technicianFilter,
          clientFilter,
          startDate,
          endDate
        );
        setInterventions(interventions);
        setTotalInterventions(total);
      } catch (error) {
        console.error("Erreur lors du chargement des interventions:", error);
        toast.error("Erreur lors du chargement des interventions");
      }
    };

    fetchInterventions();
  }, [currentPage, searchQuery, statusFilter, technicianFilter, clientFilter, startDate, endDate]);

  // Gestion du statut
  const getStatusBadge = (status) => {
    const statusStyles = {
      PROGRAMME: "bg-yellow-500",
      EN_COURS: "bg-blue-500",
      SUSPENDU: "bg-red-500",
      TERMINE: "bg-green-500"
    };

    return (
      <Badge className={`${statusStyles[status]} text-white`}>
        {status}
      </Badge>
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateIntervention = (newIntervention) => {
    setInterventions([...interventions, newIntervention]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interventions</h1>
        <CreateInterventionModal onCreate={handleCreateIntervention} techniciens={[]} /> {/* Use the modal component */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <SelectItem value="PROGRAMME">Programmé</SelectItem>
            <SelectItem value="EN_COURS">En cours</SelectItem>
            <SelectItem value="SUSPENDU">Suspendu</SelectItem>
            <SelectItem value="TERMINE">Terminé</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Technicien</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interventions.map((intervention) => (
            <TableRow key={intervention.id}>
              <TableCell>{intervention.numero}</TableCell>
              <TableCell>
                {format(new Date(intervention.dateIntervention), "dd/MM/yyyy", { locale: fr })}
              </TableCell>
              <TableCell>{intervention.DemandeIntervention.Client.nom}</TableCell>
              <TableCell>{intervention.DemandeIntervention.Site.nom}</TableCell>
              <TableCell>
                {`${intervention.Technicien.nom} ${intervention.Technicien.prenom}`}
              </TableCell>
              <TableCell>{getStatusBadge(intervention.statut)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <FaEye className="cursor-pointer text-blue-500" />
                  <FaEdit className="cursor-pointer text-yellow-500" />
                  <FaTrash className="cursor-pointer text-red-500" />
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
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "bg-blue-600" : "bg-blue-500"}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterventionsList;
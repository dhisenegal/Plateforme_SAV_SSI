'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEye, FaEdit, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPlanning, formatDate, getClientName, getDescription, getType, getDateMaintenanceOrIntervention, getStatut } from '@/actions/technicien/planning';

const PlanningTabContent = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchPlanning();
  }, [currentPage]);

  const fetchPlanning = async () => {
    try {
      const planning = await getPlanning(); // Récupération des données du planning depuis la base de données

      // Ajout des informations dynamiques pour chaque élément du planning
      const planningWithDetails = await Promise.all(
        planning.map(async (plan) => {
          const clientName = await getClientName(plan); // Récupération du nom du client
          const description = await getDescription(plan); // Récupération de la description
          const type = await getType(plan); // Récupération du type (intervention ou maintenance)
          const date = await getDateMaintenanceOrIntervention(plan.id, type.toLowerCase()); // Récupération de la date
          const formattedDate = await formatDate(date); // Formater la date
          const statut = await getStatut(plan.id, type.toLowerCase()); // Récupération du statut
          return { ...plan, client: clientName, description, date: formattedDate, type, statut };
        })
      );

      // Filtrer pour ne garder que les maintenances
      const maintenances = planningWithDetails.filter(plan => plan.type === "Maintenance");

      setCurrentPlanning(maintenances); // Mettre à jour les maintenances
      setTotalPages(1); // Exemple de pagination
    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === currentPlanning.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentPlanning.map((plan) => plan.id));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Maintenances</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectedRows.length === currentPlanning.length}
                onChange={handleSelectAllRows}
              />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlanning.map((plan) => (
            <TableRow
              key={plan.id}
              className={`cursor-pointer ${selectedRows.includes(plan.id) ? 'bg-blue-100' : 'hover:bg-blue-100'}`}
              onClick={() => console.log(`Row clicked for planning ID: ${plan.id}`)}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(plan.id)}
                  onChange={() => handleSelectRow(plan.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>{plan.date || 'Non défini'}</TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.description}</TableCell>
              
              <TableCell>{plan.statut || 'Non défini'}</TableCell>
              <TableCell className="flex justify-center">
                <div className="flex space-x-2">
                  <Link href={`/technicien/Planning/${plan.id}?type=${plan.type.toLowerCase()}`} passHref>
                    <FaEye className="text-blue-500 cursor-pointer" />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-4 gap-2">
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-blue-500">
          <FaArrowLeft />
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500">
          <FaArrowRight />
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PlanningTabContent;

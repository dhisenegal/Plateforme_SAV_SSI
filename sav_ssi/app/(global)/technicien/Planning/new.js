'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPlanning, formatDate, getClientName, getDescription, getType, getDateMaintenanceOrIntervention, getStatut } from '@/actions/technicien/planning';
import { useSession } from 'next-auth/react';

const PlanningTabContent = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  //const { data: session } = useSession();
  //const technicianId = session?.user?.id;

  useEffect(() => {
    
      fetchPlanning();
  
  }, [currentPage]);

  const fetchPlanning = async () => {
    try {
      const planning = await getPlanning();

      // Combine interventions and maintenances
      //const combinedPlanning = [...interventions, ...maintenances];

      // Add dynamic details to each plan
      const planningWithDetails = await Promise.all(
        planning.map(async (plan) => {
          const clientName = await getClientName(plan);
          const description = await getDescription(plan);
          const type = await getType(plan);
          const date = await getDateMaintenanceOrIntervention(plan.id, type.toLowerCase());
          const formattedDate = await formatDate(date);
          const statut = await getStatut(plan.id, type.toLowerCase());
          return { ...plan, client: clientName, description, dateMaintenance: formattedDate, type, statut };
        })
      );

      setCurrentPlanning(planningWithDetails);
      // Example pagination logic
      const itemsPerPage = 5;
      setTotalPages(Math.ceil(planningWithDetails.length / itemsPerPage));
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
        <h2 className="text-2xl font-bold">Planning</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white flex items-center">
              <FaPlus className="w-5 h-5 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Planning</DialogTitle>
              <DialogDescription>Sélectionnez un client, une description, et un type pour ajouter un planning.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
            <TableHead>Type</TableHead>
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
              <TableCell>{plan.dateMaintenance || 'Non défini'}</TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.type}</TableCell>
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
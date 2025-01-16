'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaEye, FaArrowLeft, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<<<<<<< HEAD
import { formatStatut, getPlanning, formatDate, getClientName, getDescription, getType, getDateMaintenanceOrIntervention, getStatut } from '@/actions/technicien/planning';
import { fetchDetails } from '@/lib/fonctionas';
=======
import { getEtatUrgence, formatStatut, getPlanning, formatDate, getClientName, getDescription, getType, getDateMaintenanceOrIntervention, getStatut } from '@/actions/technicien/planning';
>>>>>>> 35c4b6775540c5b1c0c26751083e73bcbdee7347

const PlanningTabContent = () => {
  const { data: session } = useSession();
  const technicienId = session?.user?.id;
  const router = useRouter();
  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchPlanning();
  }, [currentPage]);

  const fetchPlanning = async () => {
    try {
      const planning = await getPlanning(technicienId);
      const planningWithDetails = await Promise.all(
        planning.map(async (plan) => {
          const clientName = await getClientName(plan);
          const description = await getDescription(plan);
          const type = await getType(plan);
          const date = await getDateMaintenanceOrIntervention(plan.id, type.toLowerCase());
          const formattedDate = await formatDate(date);
          const statut = await getStatut(plan.id, type.toLowerCase());
          const formattedStatut = await formatStatut(statut);
          const urgent = await getEtatUrgence(plan.id, type.toLowerCase());
          return { 
            ...plan, 
            client: clientName, 
            description, 
            date: formattedDate, 
            type, 
            statut: formattedStatut,
            urgent 
          };
        })
      );

      setCurrentPlanning(planningWithDetails);
      setTotalPages(1);
    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Planning</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Urgent</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlanning.map((plan) => (
            <TableRow
              key={plan.id}
<<<<<<< HEAD
              className={`cursor-pointer hover:bg-blue-100 ${plan.urgent === 1 ? 'bg-red-200' : ''}`}
=======
              className={`cursor-pointer hover:bg-blue-100 ${plan.urgent ? 'bg-red-50' : ''}`}
>>>>>>> 35c4b6775540c5b1c0c26751083e73bcbdee7347
              onClick={() => router.push(`/technicien/Planning/${plan.id}?type=${plan.type.toLowerCase()}`)}
            >
              <TableCell>{plan.date || 'Non défini'}</TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.type}</TableCell>
              <TableCell>{plan.statut || 'Non défini'}</TableCell>
              <TableCell>
                {plan.urgent ? (
                  <div className="flex items-center text-red-600">
                    <FaExclamationTriangle className="mr-2" />
                    <span className="text-sm font-semibold">Urgent</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell className="flex justify-center">
                <Link href={`/technicien/Planning/${plan.id}?type=${plan.type.toLowerCase()}`} passHref>
                  <FaEye 
                    className="text-blue-500 cursor-pointer" 
                    onClick={(e) => e.stopPropagation()} 
                  />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-4 gap-2">
        <span>Page {currentPage} / {totalPages}</span>
        <Button 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="bg-blue-500"
        >
          <FaArrowLeft />
        </Button>
        <Button 
          onClick={() => setCurrentPage(currentPage + 1)} 
          disabled={currentPage === totalPages} 
          className="bg-blue-500"
        >
          <FaArrowRight />
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PlanningTabContent;
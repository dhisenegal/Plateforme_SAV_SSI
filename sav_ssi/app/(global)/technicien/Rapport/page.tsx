'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getType, getPlanning } from '@/actions/technicien/planning';
import { fetchDetails } from '@/lib/fonctionas'; 

const PlanningTabContent = () => {
  const { data: session } = useSession();
  const technicienId = session?.user?.id;
  const router = useRouter();
  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleValidateClick = (id, type) => {
    if (type === 'maintenance') {
      router.push(`/technicien/Maintenances/${id}`);
    } else if (type === 'intervention') {
      router.push(`/technicien/Interventions/${id}`);
    }
  };

  useEffect(() => {
    fetchPlanning();
  }, [currentPage]);

  const fetchPlanning = async () => {
    setLoading(true); 
    try {
     
      const planning = await getPlanning(technicienId);

      const planningWithDetails = await Promise.all(
        planning.map(async (plan) => {
         
          const type = await getType(plan);
          if (!plan.id || !type || type === 'Type inconnu') {
            console.error(`Erreur: ID ou type manquant ou inconnu pour le plan ${JSON.stringify(plan)}`);
            return {}; 
          }
    
          const { clientName, description, statut, urgent, technicienName, dateFinInt, dateFinMaint, systeme } = await fetchDetails(plan.id, type.toLowerCase());

          return {
            ...plan,
            client: clientName,
            description,
            statut,
            dateFin: dateFinInt || dateFinMaint,
            urgent,
            technicienName,
            systeme,
            type 
          };
        })
      );

      const filteredPlanning = planningWithDetails.filter(plan => plan.statut === 'TERMINE');

      setCurrentPlanning(filteredPlanning);
    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">RAPPORT</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date de fin</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlanning.map((plan, index) => (
            <TableRow
              key={`${plan.id}-${index}`}  // Utiliser une combinaison de l'id et de l'index pour garantir l'unicité
              className="cursor-pointer hover:bg-gray-100"  // Ajoute un effet de survol visuel
              onClick={() => handleValidateClick(plan.id, plan.type.toLowerCase())}  // Redirige lors du clic
            >
              <TableCell>{plan.dateFin ? new Date(plan.dateFin).toLocaleDateString() : 'Non défini'}</TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.type}</TableCell>
              <TableCell>{plan.statut || 'Non défini'}</TableCell>
              <TableCell className="flex justify-center">
                <FaEye 
                  className="text-blue-500 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();  // Empêche la propagation du clic pour éviter une redirection au survol
                    handleValidateClick(plan.id, plan.type.toLowerCase());  // Redirige vers la page de détail
                  }} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-4 gap-2">
        <span>Page {currentPage}</span>
        <Button 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="bg-blue-500"
        >
          <FaArrowLeft />
        </Button>
        <Button 
          onClick={() => setCurrentPage(currentPage + 1)} 
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

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
import { getType, getPlanning, fetchDetails } from '@/actions/technicien/planning';

const PlanningTabContent = () => {
  const { data: session } = useSession();
  const technicienId = session?.user?.id;
  const router = useRouter();
  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlanning();
  }, [currentPage]);

  const fetchPlanning = async () => {
    setLoading(true);
    try {
      // Récupérer le planning pour la page actuelle
      const planning = await getPlanning(technicienId, currentPage);

      // Récupérer les détails associés à chaque élément du planning
      const planningWithDetails = await Promise.all(
        planning.map(async (plan) => {
          // Déterminer le type en utilisant la fonction getType
          const type = await getType(plan);
          if (!plan.id || type === 'Type inconnu') {
            console.error(`Erreur: ID ou type manquant ou inconnu pour le plan ${JSON.stringify(plan)}`);
            return null;  // Retourne null pour les plans incomplets ou inconnus
          }

          // Appel de fetchDetails avec le type déterminé par getType
          const { clientName, statut, urgent, technicienName, datePlanifiee, systeme } = await fetchDetails(plan.id, type);

          return {
            ...plan,
            client: clientName,
            statut,
            date: datePlanifiee,
            urgent,
            technicienName,
            systeme,
            type // Ajout du type pour pouvoir l'afficher dans la table
          };
        })
      );

      // Filtrer les plans valides et dont le statut n'est pas "Terminé"
      const filteredPlanning = planningWithDetails.filter(plan => plan && plan.statut !== 'TERMINE');

      // Mettre à jour l'état avec les données filtrées
      setCurrentPlanning(filteredPlanning);

      // Récupérer le nombre d'interventions urgentes et le stocker dans le localStorage
      const urgentCount = filteredPlanning.filter(plan => plan.urgent).length;
      localStorage.setItem('urgentInterventionsCount', String(urgentCount));
      console.log('Nombre d\'interventions urgentes stockées :', urgentCount);

    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">PLANNING</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Systéme</TableHead>
            <TableHead>Urgence</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlanning.map((plan, index) => (
            <TableRow
              key={`${plan.id}-${index}`}  // Utiliser une combinaison de l'id et de l'index pour garantir l'unicité
              className={`cursor-pointer hover:bg-blue-100 ${plan.urgent ? 'bg-red-50' : ''}`}
              onClick={() => router.push(`/technicien/Planning/${plan.id}?type=${plan.type}`)}
            >
              <TableCell>{plan.date ? new Date(plan.date).toLocaleDateString() : 'Non défini'}</TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.type}</TableCell>
              <TableCell>{plan.systeme}</TableCell>
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
                <Link href={`/technicien/Planning/${plan.id}?type=${plan.type}`} passHref>
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
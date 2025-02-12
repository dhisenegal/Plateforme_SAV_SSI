'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaEye, FaArrowLeft, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPlanning, getType } from '@/actions/technicien/planning'; // Importation de fetchDetails
import { fetchDetails } from '@/lib/fonctionas';  // Fonction fetchDetails utilisée ici

// Fonction utilitaire pour formater les dates au format 'DD/MM/YYYY'
const formatDate = (date: Date | string) => {
  if (date instanceof Date) {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',   // Affiche le jour sur 2 chiffres
      month: '2-digit', // Affiche le mois sur 2 chiffres
      year: 'numeric'   // Affiche l'année sur 4 chiffres
    });
  }
  return date;  // Si la date est déjà une chaîne, on la retourne directement
};

const PlanningTabContent = () => {
  const router = useRouter();
  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { data: session } = useSession();
  const technicienId = session?.user?.id;

  useEffect(() => {
    fetchPlanning();
  }, [currentPage]);

  const fetchPlanning = async () => {
    try {
      // Récupérer le planning actuel pour le technicien
      const planning = await getPlanning(technicienId);

      // Ajouter les détails associés pour chaque plan
      const planningWithDetails = await Promise.all(
        planning.map(async (plan) => {
          const type = await getType(plan);  // Récupérer le type (Maintenance ou Intervention)
          
          if (!plan.id || !type || type !== 'Intervention') {
            return null;  // Retourne null pour tout sauf les interventions
          }

          // Appel à fetchDetails pour récupérer les détails supplémentaires
          const details = await fetchDetails(plan.id, type.toLowerCase());

          // Ajouter les informations récupérées à chaque plan
          return {
            ...plan,
            client: details.clientName,
            description: details.description,
            statut: details.statut,
            date: formatDate(details.datePlanifiee),  // Formater la date ici
            type,
            urgent: details.urgent,
            horsDelai: details.horsDelai,  // Ajout de l'attribut "horsDelai"
            technicienName: details.technicienName,
            systeme: details.systeme,
            Heureint: details.Heureint,
          };
        })
      );

      // Filtrer les plans qui ne sont pas des interventions
      const interventions = planningWithDetails.filter(plan => plan !== null);

      // Calculer le nombre d'interventions urgentes et hors délai
      const urgentCount = interventions.filter((plan) => plan.urgent && plan.statut !== 'TERMINE').length;
      const horsDelaiCount = interventions.filter((plan) => plan.horsDelai && plan.statut !== 'TERMINE').length;

      // Enregistrer les comptages dans le localStorage
      localStorage.setItem('urgentInterventionsCount', urgentCount.toString());
      localStorage.setItem('horsDelaiInterventionsCount', horsDelaiCount.toString());

      setCurrentPlanning(interventions);
      setTotalPages(1); // Vous pouvez ajuster cette logique pour calculer le nombre total de pages
    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Interventions</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Urgence</TableHead>
            
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlanning.map((plan) => (
            <TableRow
              key={plan.id}
              className={`cursor-pointer hover:bg-blue-100 ${plan.urgent ? 'bg-red-50' : ''} ${plan.horsDelai ? 'bg-yellow-50' : ''}`}
              onClick={() => router.push(`/technicien/Planning/${plan.id}?type=${plan.type.toLowerCase()}`)}
            >
              <TableCell>{plan.date || 'Non défini'}</TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.description}</TableCell>
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
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="bg-blue-500">
          <FaArrowLeft />
        </Button>
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="bg-blue-500">
          <FaArrowRight />
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PlanningTabContent;

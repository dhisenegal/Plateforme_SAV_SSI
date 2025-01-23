'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPlanning, getType } from '@/actions/technicien/planning'; // Importation de fetchDetails
import { fetchDetails } from '@/lib/fonctionas'; // Assurez-vous que fetchDetails est bien importé

// Fonction utilitaire pour formater les dates
const formatDate = (date: Date | string) => {
  if (date instanceof Date) {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',   // Affiche le jour sur 2 chiffres
      month: '2-digit', // Affiche le mois sur 2 chiffres
      year: 'numeric'   // Affiche l'année sur 4 chiffres
    });}}

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
          
          if (!plan.id || !type) {
            console.error(`Erreur: ID ou type manquant pour le plan ${JSON.stringify(plan)}`);
            return {};  // Retourne un objet vide si le type ou l'ID est manquant
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
            technicienName: details.technicienName,
            systeme: details.systeme,
            
          };
        })
      );

      // Filtrer les plans de type 'Maintenance' uniquement
      const maintenances = planningWithDetails.filter(plan => plan.type === "Maintenance");

      // Mettre à jour l'état avec les données de type 'Maintenance'
      setCurrentPlanning(maintenances);

      // Calculer le nombre total de pages (à ajuster en fonction de vos données)
      const totalPlans = maintenances.length;
      const pageSize = 10; // Ajustez cela selon vos besoins
      setTotalPages(Math.ceil(totalPlans / pageSize));
    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
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
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => router.push(`/technicien/Planning/${plan.id}?type=${plan.type.toLowerCase()}`)}
            >
              <TableCell>{(plan.date) || 'Non défini'}</TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.statut || 'Non défini'}</TableCell>
              <TableCell className="flex justify-center">
                <Link href={`/technicien/Planning/${plan.id}?type=${plan.type.toLowerCase()}`} passHref>
                  <FaEye className="text-blue-500 cursor-pointer" onClick={(e) => e.stopPropagation()} />
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

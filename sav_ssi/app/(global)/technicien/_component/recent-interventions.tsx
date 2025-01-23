'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { fetchDetails } from '@/lib/fonctionas'; // Assurez-vous que fetchDetails est importé
import { getStatut, getPlanning, getType } from '@/actions/technicien/planning'; // Importation des fonctions existantes
import { useRouter } from 'next/navigation'; // Utilisation de useRouter pour la redirection

// Fonction utilitaire pour formater les dates au format 'DD/MM/YYYY'
const formatDate = (date: Date | string) => {
  if (date instanceof Date) {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  return date;
};

export function RecentInterventions() { // Pas besoin de passer `plans` car les données seront récupérées ici
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const router = useRouter();  // Initialisation du hook useRouter pour gérer la redirection

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        // Récupérer tous les plans de type "Maintenance" pour le technicien
        const planning = await getPlanning(); // Récupère le planning complet (assurez-vous d'avoir l'ID du technicien ici)

        // Ajouter les détails associés à chaque plan
        const planningWithDetails = await Promise.all(
          planning.map(async (plan) => {
            const type = await getType(plan);  // Récupérer le type (Maintenance ou Intervention)
            
            if (!plan.id || !type || type !== 'Maintenance') {
              return null;  // Ne garder que les plans de type "Maintenance"
            }

            // Appel à fetchDetails pour récupérer les détails supplémentaires
            const details = await fetchDetails(plan.id, type.toLowerCase());
            const statut = await getStatut(plan.id, type.toLowerCase()); // Récupérer le statut

            // Ne garder que les maintenances avec le statut "EN_COURS" ou "PLANIFIE"
            if (statut === 'EN_COURS' || statut === 'PLANIFIE') {
              return {
                ...plan,
                client: details.clientName,
                date: formatDate(details.datePlanifiee),  // Formater la date
              };
            }

            return null; // Si le statut n'est pas "EN_COURS" ou "PLANIFIE", on ignore ce plan
          })
        );

        // Filtrer les maintenances valides (non nulles)
        const validMaintenances = planningWithDetails.filter((plan) => plan !== null);

        // Trier les maintenances par date croissante
        const sortedMaintenances = validMaintenances.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Limiter à 10 prochaines maintenances
        setMaintenances(sortedMaintenances.slice(0, 10));
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances :", error);
      }
    };

    fetchMaintenances();
  }, []);  // L'effet est exécuté une seule fois au montage du composant

  if (maintenances.length === 0) {
    return <p>Chargement...</p>;
  }

  const handleRowClick = (id: number, type: string) => {
    // Redirige vers la page de maintenance spécifique
    router.push(`/technicien/Planning/${id}?type=${type}`);
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {maintenances.map((plan) => (
            <TableRow
              key={plan.id}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => handleRowClick(plan.id, 'maintenance')}  // Utilisation de onClick pour gérer la redirection
            >
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">{plan.date}</p>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">{plan.client}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

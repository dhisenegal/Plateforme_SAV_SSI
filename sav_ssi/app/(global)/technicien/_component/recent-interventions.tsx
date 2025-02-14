'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { fetchDetails } from '@/lib/fonctionas';
import { getStatut, getPlanning } from '@/actions/technicien/planning';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

export function RecentInterventions() {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const technicienId = session?.user?.id;

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const planning = await getPlanning(technicienId);

        const planningWithDetails = await Promise.all(
          planning.map(async (plan) => {
            const type = 'maintenance'; // Nous savons que ce sont des maintenances
            const details = await fetchDetails(plan.id, type);
            const statut = await getStatut(plan.id, type);

            if (statut === 'EN_COURS' || statut === 'PLANIFIE') {
              return {
                ...plan,
                client: details.clientName,
                date: formatDate(details.datePlanifiee),
              };
            }

            return null;
          })
        );

        const validMaintenances = planningWithDetails.filter((plan) => plan !== null);
        const sortedMaintenances = validMaintenances.sort((a, b) => new Date(a.date) - new Date(b.date));

        setMaintenances(sortedMaintenances.slice(0, 10));
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances :", error);
      }
    };

    fetchMaintenances();
  }, [technicienId]);

  if (maintenances.length === 0) {
    return <p>Aucune maintenance récente.</p>;
  }

  const handleRowClick = (id: number, type: string) => {
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
              onClick={() => handleRowClick(plan.id, 'maintenance')}
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
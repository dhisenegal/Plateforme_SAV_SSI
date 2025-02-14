'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { getNextMaintenances } from '@/actions/technicien/planning';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Fonction utilitaire pour formater les dates au format 'DD/MM/YYYY'
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export function RecentInterventions() {
  // État pour stocker les données de maintenance
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const technicienId = session?.user?.id;

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        // Récupère uniquement les 3 prochaines opérations de maintenance
        const nextMaintenances = await getNextMaintenances(technicienId);
        // Formate les dates avant de les stocker dans l'état
        const formattedMaintenances = nextMaintenances.map(maintenance => ({
          ...maintenance,
          date: formatDate(maintenance.date)
        }));
        setMaintenances(formattedMaintenances);
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances:", error);
      }
    };

    if (technicienId) {
      fetchMaintenances();
    }
  }, [technicienId]);

  if (maintenances.length === 0) {
    return <p>Aucune maintenance à venir.</p>;
  }

  const handleRowClick = (id: number) => {
    router.push(`/technicien/Planning/${id}?type=maintenance`);
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
              onClick={() => handleRowClick(plan.id)}
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
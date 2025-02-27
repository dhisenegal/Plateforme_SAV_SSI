'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { getNextMaintenances } from '@/actions/technicien/planning';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaSpinner } from 'react-icons/fa';

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export function RecentInterventions() {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const technicienId = session?.user?.id;

  useEffect(() => {
    const fetchMaintenances = async () => {
      if (!technicienId) return;

      try {
        setLoading(true);
        const nextMaintenances = await getNextMaintenances(technicienId);
        const formattedMaintenances = nextMaintenances.map(maintenance => ({
          ...maintenance,
          date: formatDate(maintenance.date)
        }));
        setMaintenances(formattedMaintenances);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances:", error);
        setError("Impossible de charger les maintenances");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, [technicienId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <FaSpinner className="animate-spin mr-2" />
        <span>Chargement des maintenances...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  if (!maintenances.length) {
    return <p className="text-gray-500 p-4">Aucune maintenance à venir.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-medium">Date</TableCell>
            <TableCell className="font-medium">Client</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((plan) => (
            <TableRow
              key={plan.id}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => router.push(`/technicien/Planning/${plan.id}?type=maintenance`)}
            >
              <TableCell>{plan.date}</TableCell>
              <TableCell>{plan.client}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
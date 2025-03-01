import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { getRecentInterventions } from '@/actions/sav/analytic';
import { toast } from 'react-toastify';


export function RecentInterventions() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const data = await getRecentInterventions();
        setInterventions(data);
      } catch (error) {
        setError(error);
        toast.error("Erreur lors du chargement des interventions récentes");
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }


  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Technicien
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {interventions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="px-6 py-4 whitespace-nowrap text-center">
                <h1 className="text-sm font-medium text-gray-900">Aucune intervention récente</h1>
              </TableCell>
            </TableRow>
          ) : (
            interventions.map((intervention) => (
              <TableRow key={intervention.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {intervention.Technicien.nom} {intervention.Technicien.prenom}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-900">{intervention.Client.nom}</p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-900">
                    {new Date(intervention.dateIntervention).toLocaleDateString()}
                  </p>
                </TableCell>
              </TableRow>
            ))
          )}
          
        </TableBody>
      </Table>
    </div>
  );
}
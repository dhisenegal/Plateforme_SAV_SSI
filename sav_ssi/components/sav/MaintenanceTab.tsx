"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { getMaintenancesBySite } from '@/actions/sav/maintenance';

const MaintenanceTab = ({ id }: { id: number }) => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenances = async () => {
      setLoading(true);
      try {
        const maintenancesData = await getMaintenancesBySite(id);
        setMaintenances(maintenancesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3">
        Chargement en cours...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historique des Maintenances</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Prévue</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Technicien</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((maintenance) => (
            <TableRow key={maintenance.id} className="hover:bg-blue-100">
              <TableCell>{new Date(maintenance.dateMaintenance).toLocaleDateString()}</TableCell>
              <TableCell>{maintenance.typeMaintenance}</TableCell>
              <TableCell className={maintenance.statut === 'PLANIFIE' ? 'text-green-500' : maintenance.statut === 'TERMINE' ? 'text-red-500' : ''}>
                {maintenance.statut}
              </TableCell>
              <TableCell>{`${maintenance.Technicien.prenom} ${maintenance.Technicien.nom}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceTab;
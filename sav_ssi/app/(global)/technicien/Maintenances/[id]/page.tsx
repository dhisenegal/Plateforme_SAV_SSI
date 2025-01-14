'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MaintenancePage from '@/components/MaintenancePage';
import { fetchDetails } from '@/lib/fonctionas';

export default function Maintenance() {
  const params = useParams();
  const ID = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!ID) {
          throw new Error('ID manquant');
        }

        const fetchedData = await fetchDetails(ID, "maintenance");
        if (fetchedData.dateMaintenance) {
          fetchedData.dateMaintenance = new Date(fetchedData.dateMaintenance).toLocaleDateString();
        }
        setData(fetchedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ID]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return <MaintenancePage data={data} type="maintenance" />;
}
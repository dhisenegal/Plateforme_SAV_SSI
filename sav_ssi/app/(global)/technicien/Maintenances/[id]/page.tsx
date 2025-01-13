'use client';

import { fetchDetails } from '@/lib/fonctionas';
import MaintenancePage from '@/components/MaintenancePage';
import { useParams } from 'next/navigation';

export default function Maintenance() {
  const params = useParams();
  const ID = Array.isArray(params.id) ? params.id[0] : params.id;
  let data = null;
  let error = null;

  try {
    // Appel de la fonction fetchDetails pour récupérer les détails de l'intervention
    data = fetchDetails(ID, "maintenance");

    // Convertir les objets de date en chaînes de caractères
    if (data.dateMaintenance) {
      data.dateMaintenance = new Date(data.dateMaintenance).toLocaleDateString();
    }
   
  } catch (err) {
    error = err.message;
  }

  return <MaintenancePage  />;
}
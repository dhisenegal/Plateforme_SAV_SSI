import { fetchDetails } from '@/lib/fonctionas';
import MaintenancePage from '@/components/MaintenancePage';

export default async function Maintenance({ params }) {
  const { ID } = params;
  let data = null;
  let error = null;

  try {
    // Appel de la fonction fetchDetails pour récupérer les détails de l'intervention
    data = await fetchDetails(ID, "maintenance");

    // Convertir les objets de date en chaînes de caractères
    if (data.dateMaintenance) {
      data.dateMaintenance = new Date(data.dateMaintenance).toLocaleDateString();
    }
   
  } catch (err) {
    error = err.message;
  }

  return <MaintenancePage id={ID} data={data} error={error} />;
}
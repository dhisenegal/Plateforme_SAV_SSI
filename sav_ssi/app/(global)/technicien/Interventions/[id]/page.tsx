
import { fetchDetails } from '@/lib/fonctionas';
import InterventionPage from '@/components/InterventionPage';

export default async function Intervention({ params }) {
  const { ID } = params;
  let data = null;
  let error = null;

  try {
    // Appel de la fonction fetchDetails pour récupérer les détails de l'intervention
    data = await fetchDetails(ID, "intervention");

    // Convertir les objets de date en chaînes de caractères
    if (data.dateIntervention) {
      data.dateIntervention = new Date(data.dateIntervention).toLocaleDateString();
    }
    if (data.dateDeclaration) {
      data.dateDeclaration = new Date(data.dateDeclaration).toLocaleDateString();
    }
  } catch (err) {
    error = err.message;
  }

  return <InterventionPage id={ID} data={data} error={error} />;
}
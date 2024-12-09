import React from 'react';
import Link from 'next/link';
import {
  getClientName,
  getSystemeForIntervention,
  getSystemeForMaintenance,
  getEquipementForSysteme,
  formatDate,
  getDescription,
  getStatut,
} from '@/lib/fonction';

type DetailsPageProps = {
  clientName: string | null;
  siteName: string | null;
  systeme: string | null;
  equipements: any[];
  date: string | null;
  type: string;
  description: string | null;
  statut: string | null;
  error: string | null;
};

const DetailsPage: React.FC<DetailsPageProps> = ({
  clientName,
  siteName,
  systeme,
  equipements,
  date,
  type,
  description,
  statut,
  error,
}) => {
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-red-100 text-red-700 border border-red-300 rounded-md shadow-md">
        Erreur : {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-md shadow-lg">
      <h1 className="text-3xl font-semibold mb-4 text-gray-800">
        Détails de la {type === 'maintenance' ? 'maintenance' : 'l\'intervention'}
      </h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-medium w-1/3">
            Date de {type === 'maintenance' ? 'la maintenance' : 'l\'intervention'} :
          </p>
          <p className="text-gray-900 font-semibold w-2/3">{date || 'N/A'}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-medium w-1/3">Nom du client :</p>
          <p className="text-gray-900 font-semibold w-2/3">{clientName || 'N/A'}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-medium w-1/3">Site :</p>
          <p className="text-gray-900 font-semibold w-2/3">{siteName || 'N/A'}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-medium w-1/3">Système :</p>
          <p className="text-gray-900 font-semibold w-2/3">{systeme || 'N/A'}</p>
        </div>
        <div className="flex items-start">
          <p className="text-gray-700 font-medium w-1/3">Équipements associés :</p>
          <div className="text-gray-900 font-semibold w-2/3 flex flex-wrap gap-2">
            {equipements.length > 0 ? (
              equipements.map((equipement, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-300"
                >
                  {equipement.nom || 'Équipement sans nom'}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Aucun équipement trouvé</p>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-medium w-1/3">Description :</p>
          <p className="text-gray-900 font-semibold w-2/3">{description || 'N/A'}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-medium w-1/3">Statut :</p>
          <p className={`text-lg font-semibold w-2/3 ${statut ? 'text-green-700' : 'text-gray-500'}`}>
            {statut || 'N/A'}
          </p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <Link href={`/technicien/${type === 'maintenance' ? 'maintenance' : 'intervention'}`}>
          <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
            Commencer {type === 'maintenance' ? 'la maintenance' : 'l\'intervention'}
          </button>
        </Link>
        <Link href={`/technicien/Rapport/Fiche${type === 'maintenance' ? 'Maintenance' : 'Intervention'}`}>
          <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600">
            Rédiger la fiche {type === 'maintenance' ? 'de maintenance' : 'd\'intervention'}
          </button>
        </Link>
        <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600">
          Terminer {type === 'maintenance' ? 'la maintenance' : 'l\'intervention'}
        </button>
      </div>
    </div>
  );
};

export default async function Page({ params, searchParams }: { params: { id: string }, searchParams: { type: string } }) {
  try {
    const { id } = params;
    const { type } = searchParams;

    if (!id || !type) {
      throw new Error('ID ou type manquant');
    }

    let clientName = null;
    let siteName = null;
    let systeme = null;
    let equipements = [];
    let date = null;
    let description = null;
    let statut = null;

    if (type === 'intervention') {
      systeme = await getSystemeForIntervention(parseInt(id));
      const intervention = await prisma.intervention.findUnique({
        where: { id: parseInt(id) },
        include: {
          DemandeIntervention: {
            include: {
              Client: { select: { nom: true } },
              Site: { select: { nom: true } },
            },
          },
        },
      });

      if (intervention) {
        clientName = getClientName(intervention);
        siteName = intervention.DemandeIntervention?.Site?.nom || null;
        date = formatDate(intervention.dateIntervention);
        description = getDescription(intervention);
        statut = await getStatut(id, 'intervention');
        equipements = await getEquipementForSysteme(systeme.id);
      } else {
        throw new Error('Intervention non trouvée');
      }
    } else if (type === 'maintenance') {
      systeme = await getSystemeForMaintenance(parseInt(id));
      const maintenance = await prisma.maintenance.findUnique({
        where: { id: parseInt(id) },
        include: {
          Installation: {
            include: {console.log('Error:', error);
console.log('Client Name:', clientName);
console.log('Site Name:', siteName);
console.log('Systeme:', systeme);
console.log('Equipements:', equipements);
console.log('Date:', date);
console.log('Type:', type);
console.log('Description:', description);
console.log('Statut:', statut);
              Client: { select: { nom: true } },
              Site: { select: { nom: true } },
            },
          },
        },
      });

      if (maintenance) {
        clientName = getClientName(maintenance);
        siteName = maintenance.Installation?.Site?.nom || null;
        date = formatDate(maintenance.dateMaintenance);
        description = getDescription(maintenance);
        statut = await getStatut(id, 'maintenance');
        equipements = await getEquipementForSysteme(systeme.id);
      } else {
        throw new Error('Maintenance non trouvée');
      }
    } else {
      throw new Error('Type invalide');
    }

    return <DetailsPage clientName={clientName} siteName={siteName} systeme={systeme} equipements={equipements} date={date} type={type} description={description} statut={statut} error={null} />;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails :', error);
    return <DetailsPage clientName={null} siteName={null} systeme={null} equipements={[]} date={null} type="" description={null} statut={null} error="Erreur lors de la récupération des détails" />;
  }
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getExtincteursForSystem, getInstallationIdFromMaintenance } from '@/actions/technicien/planning';
import { FaEye } from 'react-icons/fa';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead 
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";

interface ExtinguisherProps {
  id: number; // ID de la maintenance
}

interface Extinguisher {
  idInstallationEquipement: number;
  number: string;
  location: string;
  status: string;
  idInstallation: number;
  extinguisher: {
    typePression: string;
    modeVerification: string;
    TypeExtincteur: {
      nom: string;
    }
  };
  details?: {
    DateFabrication: string;
    DatePremierChargement: string;
    DateDerniereVerification: string;
  }
}

// Composant StatusBadge
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'A_REPARER':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'A_CHANGER':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'OK':
        return 'OK';
      case 'A_REPARER':
        return 'À réparer';
      case 'A_CHANGER':
        return 'À changer';
      default:
        return status;
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyle()} px-2 py-1`}>
      {getStatusText()}
    </Badge>
  );
};

const ExtincteursPageContent: React.FC<ExtinguisherProps> = ({ id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extincteurs, setExtincteurs] = useState<Extinguisher[]>([]);
  const [installationId, setInstallationId] = useState<number | null>(null);
  
  const [userInfo] = useState({
    currentUser: 'Narou98',
    currentDate: '2025-01-30 11:25:55'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Récupération des données pour la maintenance ID:', id);
        
        // 1. Récupérer l'ID de l'installation
        const installationData = await getInstallationIdFromMaintenance(id);
        console.log('ID Installation récupéré:', installationData);
        
        if (!installationData) {
          throw new Error('Installation non trouvée');
        }
        
        // 2. Récupérer les extincteurs de l'installation
        const response = await getExtincteursForSystem(installationData);
        console.log('Réponse des extincteurs:', response);
        
        if (!response.success) {
          throw new Error(response.message || 'Échec de la récupération des extincteurs');
        }
        
        setInstallationId(installationData);
        setExtincteurs(response.data);

      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleValidateClick = (idInstallationEquipement: number) => {
    router.push(`/technicien/Maintenances/Extincteur/${idInstallationEquipement}?installationId=${installationId}&maintenanceId=${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>MOYENS DE SECOURS EXTINCTEURS ({installationId})</span>
        </CardTitle>
        <div className="text-sm text-gray-500">
          <p>Utilisateur: {userInfo.currentUser}</p>
          <p>Date d'inspection: {userInfo.currentDate}</p>
        </div>
      </CardHeader>
      <CardContent>
        {extincteurs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Type Pression</TableHead>
                  <TableHead>Mode Vérification</TableHead>
                  <TableHead>Date Fabrication</TableHead>
                  <TableHead>Dernier Contrôle</TableHead>
                  <TableHead className="w-16">Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extincteurs.map((extincteur) => (
                  <TableRow 
                    key={extincteur.idInstallationEquipement}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">{extincteur.number}</TableCell>
                    <TableCell>{extincteur.extinguisher.TypeExtincteur.nom}</TableCell>
                    <TableCell>{extincteur.location}</TableCell>
                    <TableCell>
                      <StatusBadge status={extincteur.status} />
                    </TableCell>
                    <TableCell>{extincteur.extinguisher.typePression}</TableCell>
                    <TableCell>{extincteur.extinguisher.modeVerification}</TableCell>
                    <TableCell>
                      {extincteur.details?.DateFabrication && 
                        formatDate(extincteur.details.DateFabrication)}
                    </TableCell>
                    <TableCell>
                      {extincteur.details?.DateDerniereVerification && 
                        formatDate(extincteur.details.DateDerniereVerification)}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleValidateClick(extincteur.idInstallationEquipement)}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        aria-label="Voir les détails"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun extincteur trouvé pour cette installation.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtincteursPageContent;
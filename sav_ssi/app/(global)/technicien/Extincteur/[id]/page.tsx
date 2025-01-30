'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getExtincteurDetails,updateMaintenanceActionExtincteur } from '@/actions/technicien/planning';
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ExtincteurDetails {
  id: number;
  DateFabrication: string;
  DatePremierChargement: string;
  DateDerniereVerification: string;
  idInstallationEquipement: number;
  InstallationEquipement: {
    id: number;
    Numero: string;
    Emplacement: string;
    statut: string;
    Equipement: {
      id: number;
      Extincteurs: Array<{
        id: number;
        typePression: string;
        modeVerification: string;
        chargeReference: string;
        TypeExtincteur: {
          id: number;
          nom: string;
        }
      }>
    }
  };
  maintenanceActions: Array<{
    id: number;
    idMaintenance: number;
    idActionMaintenanceExtincteur: number;
    idInstallationExtincteur: number;
    statut: boolean;
    observation: string;
    actionDetails: {
      id: number;
      libeleAction: string;
    }
  }>;
}

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

export default function ExtincteurPage() {
  const params = useParams();
  const router = useRouter();
  const idInstallationEquipement = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extincteurDetails, setExtincteurDetails] = useState<ExtincteurDetails | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});
  const [observations, setObservations] = useState<Record<number, string>>({});

  const [userInfo] = useState({
    currentUser: 'Narou98',
    currentDate: '2025-01-30 12:24:13'
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (!idInstallationEquipement) {
        setError("ID de l'installation équipement manquant");
        return;
      }
  
      try {
        setLoading(true);
        const response = await getExtincteurDetails(idInstallationEquipement);
        console.log("Détails de l'extincteur récupérés :", response); // Log des données récupérées
  
        if (!response.success || !response.data) {
          throw new Error(response.message || "Impossible de récupérer les détails de l'extincteur");
        }
  
        setExtincteurDetails(response.data);
  
        // Log de la structure des actions de maintenance
        console.log("Actions de maintenance :", response.data.maintenanceActions);
  
        if (response.data.maintenanceActions) {
          const initialStatus = {};
          const initialObservations = {};
          response.data.maintenanceActions.forEach(action => {
            initialStatus[action.id] = action.statut ? 'valide' : 'non-valide';
            initialObservations[action.id] = action.observation;
          });
          setSelectedStatus(initialStatus);
          setObservations(initialObservations);
        }
  
      } catch (err) {
        console.error('Erreur lors de la récupération des détails:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [idInstallationEquipement]);
  

  const handleStatusChange = (actionId: number, status: string) => {
    setSelectedStatus(prev => ({ ...prev, [actionId]: status }));
  };

  const handleObservationChange = (actionId: number, observation: string) => {
    setObservations(prev => ({ ...prev, [actionId]: observation }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleValidate = async () => {
    try {
      setIsSaving(true);
  
      if (!extincteurDetails?.maintenanceActions) {
        throw new Error("Aucune action de maintenance trouvée");
      }
  
      const actionUpdates = extincteurDetails.maintenanceActions.map(action => ({
        id: action.id,
        idMaintenance: action.idMaintenance,
        idActionMaintenanceExtincteur: action.idActionMaintenanceExtincteur,
        idInstallationExtincteur: action.idInstallationExtincteur,
        statut: selectedStatus[action.id] === 'valide',  // Vérifie si l'état est "validé"
        observation: observations[action.id] || ''  // Récupère l'observation correspondante
      }));
  
      // Appeler la fonction de mise à jour pour enregistrer les actions de maintenance dans la base de données
      const updateResponse = await updateMaintenanceActionExtincteur(actionUpdates);
  
      if (!updateResponse.success) {
        throw new Error(updateResponse.message || 'Erreur lors de la mise à jour des actions de maintenance');
      }
  
      setIsConfirmDialogOpen(false);
      router.back();  // Retourne à la page précédente après la validation
  
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setIsSaving(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg">Chargement des détails...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
        <Button
          onClick={() => router.back()}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white"
        >
          Retour
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Détails de l'extincteur
          </CardTitle>
         
        </CardHeader>
        <CardContent className="p-6">
          {extincteurDetails && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Numéro</h3>
                  <p className="text-gray-900 mt-1">
                    {extincteurDetails.InstallationEquipement.Numero}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Emplacement</h3>
                  <p className="text-gray-900 mt-1">
                    {extincteurDetails.InstallationEquipement.Emplacement}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Statut</h3>
                  <StatusBadge status={extincteurDetails.InstallationEquipement.statut} />
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Type</h3>
                  <p className="text-gray-900 mt-1">
                    {extincteurDetails.InstallationEquipement.Equipement.Extincteurs[0]?.TypeExtincteur.nom}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Type de pression</h3>
                  <p className="text-gray-900 mt-1">
                    {extincteurDetails.InstallationEquipement.Equipement.Extincteurs[0]?.typePression}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Mode de vérification</h3>
                  <p className="text-gray-900 mt-1">
                    {extincteurDetails.InstallationEquipement.Equipement.Extincteurs[0]?.modeVerification}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Date de fabrication</h3>
                  <p className="text-gray-900 mt-1">
                    {formatDate(extincteurDetails.DateFabrication)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Date du premier chargement</h3>
                  <p className="text-gray-900 mt-1">
                    {formatDate(extincteurDetails.DatePremierChargement)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-700">Dernière vérification</h3>
                  <p className="text-gray-900 mt-1">
                    {formatDate(extincteurDetails.DateDerniereVerification)}
                  </p>
                </div>
              </div>

              <div className="mt-8 mb-6">
                <h3 className="text-xl font-semibold mb-4">Liste des tâches de maintenance</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Tâche à vérifier</TableHead>
                      <TableHead className="w-1/3">Statut</TableHead>
                      <TableHead className="w-1/3">Observations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extincteurDetails.maintenanceActions?.map((action) => (
                      <TableRow key={action.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {action.actionDetails.libeleAction}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(action.id, 'valide')}
                              className="focus:outline-none"
                            >
                              <FaCheckCircle
                                className={`w-6 h-6 transition-colors ${
                                  selectedStatus[action.id] === 'valide'
                                    ? 'text-green-600'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(action.id, 'non-valide')}
                              className="focus:outline-none"
                            >
                              <FaTimesCircle
                                className={`w-6 h-6 transition-colors ${
                                  selectedStatus[action.id] === 'non-valide'
                                    ? 'text-red-600'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <textarea
                            className="w-full p-2 border rounded-md min-h-[80px] resize-none"
                            value={observations[action.id] || ''}
                            onChange={(e) => handleObservationChange(action.id, e.target.value)}
                            placeholder="Ajouter une observation..."
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  onClick={() => router.back()}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setIsConfirmDialogOpen(true)}
                  disabled={isSaving}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Valider l'inspection
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de validation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider l'inspection de cet extincteur ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
          <Button
              onClick={() => setIsConfirmDialogOpen(false)}
              variant="outline"
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Annuler
            </Button>
            <Button
              onClick={handleValidate}
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSaving ? 'Validation...' : 'Confirmer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
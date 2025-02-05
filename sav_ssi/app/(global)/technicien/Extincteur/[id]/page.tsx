'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getExtincteurDetails,updateMaintenanceActionExtincteur } from '@/actions/technicien/planning';
import { Image as PdfImage,  } from '@react-pdf/renderer';
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink,Svg, Path } from '@react-pdf/renderer';
import Link from 'next/link';
; // Adjust the import path as necessary

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

const CheckIcon = () => (
  <Svg viewBox="0 0 24 24" width={16} height={16}>
    <Path
      fill="#22C55E"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    />
  </Svg>
);

const CrossIcon = () => (
  <Svg viewBox="0 0 24 24" width={16} height={16}>
    <Path
      fill="#EF4444"
      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
    />
  </Svg>
);

const ExtincteurPDF = ({ extincteurDetails, selectedStatus, observations }: any) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Times-Roman',
      backgroundColor: '#ffffff',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: 5,
      paddingRight: 20,
      height: 100,
    },
    logoContainer: {
      marginRight: 10,
    },
    logo: {
      width: 150,
      height: 75,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 15,
      fontFamily: 'Helvetica-Bold',
      color: '#000000',
      marginLeft: 10,
    },
    separator: {
      width: 1,
      backgroundColor: '#000',
      marginRight: 10,
      height: '126%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    leftColumn: {
      width: '48%',
      padding: 5,
    },
    rightColumn: {
      width: '48%',
      padding: 5,
    },
    titleColumn: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5, // Espacement entre chaque label et valeur
    },
    valueColumn: {
      fontSize: 12,
      marginTop: 5,
    },
    infoRow: {
      flexDirection: 'row', // Aligne le label et la valeur sur la même ligne
      marginBottom: 5,
    },
    label: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#000',
      marginRight: 5, // Un peu d'espace entre le label et la valeur
    },
    value: {
      fontSize: 12,
      color: '#000',
    },
    table: {
      width: '100%',
      marginTop: 6,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#F9FAFB',
      borderWidth: 1,
      borderColor: '#000000',
    },
    tableRow: {
      flexDirection: 'row',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#000000',
      minHeight: 40,
    },
    tableCellHeader: {
      padding: 5,
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#000000',
    },
    tableCell: {
      padding: 8,
      fontSize: 11,
      color: '#000000',
    },
    cellTask: {
      flex: 2,
      borderRightWidth: 1,
      borderRightColor: '#000000',
    },
    cellObs: {
      flex: 3,
    },
    statusIconSuccess: {
      color: '#22C55E',
      fontSize: 16,
    },
    statusIconError: {
      color: '#EF4444',
      fontSize: 16,
    },
    cellStatus: {
      width: 50,
      borderRightWidth: 1,
      borderRightColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 10,
      color: '#777',
      padding: 5,
    },
  });
  
  // Format de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête avec logo et titre */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <PdfImage src="/logo.jpg" style={styles.logo} />
          </View>
          <View style={styles.separator} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>FICHE EXTINCTEUR</Text>
          </View>
        </View>
  
        {/* Détails de l'extincteur */}
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            {/* Utilisation de infoRow pour afficher sur une seule ligne */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Numéro:</Text>
              <Text style={styles.value}>{extincteurDetails?.InstallationEquipement.Numero}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Emplacement:</Text>
              <Text style={styles.value}>{extincteurDetails?.InstallationEquipement.Emplacement}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Statut:</Text>
              <Text style={styles.value}>{extincteurDetails?.InstallationEquipement.statut}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{extincteurDetails?.InstallationEquipement.Equipement.Extincteurs[0]?.TypeExtincteur.nom}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>En Service:</Text>
              <Text style={styles.value}>{(extincteurDetails?.HorsService)? "non" : "oui"}</Text>
            </View>
          </View>
  
          <View style={styles.rightColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date de fabrication:</Text>
              <Text style={styles.value}>{formatDate(extincteurDetails?.DateFabrication)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date du premier chargement:</Text>
              <Text style={styles.value}>{formatDate(extincteurDetails?.DatePremierChargement)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Dernière vérification:</Text>
              <Text style={styles.value}>{formatDate(extincteurDetails?.DateDerniereVerification)}</Text>
            </View>
           
          </View>
        </View>
  
        {/* Tâches de maintenance */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.cellTask]}>Tâches</Text>
            <Text style={[styles.tableCellHeader, styles.cellStatus]}>Statut</Text>
            <Text style={[styles.tableCellHeader, styles.cellObs]}>Observations</Text>
          </View>
  
          {extincteurDetails?.maintenanceActions?.map((action: any, index: number) => (
            <View key={action.id} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.cellTask]}>
                <Text>{action.actionDetails.libeleAction}</Text>
              </View>
              <View style={[styles.tableCell, styles.cellStatus]}>
                <View style={styles.iconContainer}>
                  {selectedStatus[action.id] === 'valide' ? <CheckIcon /> : <CrossIcon />}
                </View>
              </View>
              <View style={[styles.tableCell, styles.cellObs]}>
                <Text>{observations[action.id] || 'Aucune observation'}</Text>
              </View>
            </View>
          ))}
        </View>
  
        {/* Footer */}
        <Text style={styles.footer}>DHI - Solutions and Integrated Systems</Text>
      </Page>
    </Document>
  );
  
};



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
  const idMaintenance = parseInt(useSearchParams().get('maintenanceId') as string);
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
        const response = await getExtincteurDetails(idInstallationEquipement,idMaintenance);
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
      <div className='mb-5 flex justify-between'>
            <div>
              <Link href={`/technicien/Planning/${idMaintenance}?type=maintenance`}>
                Retour à la page de maintenance
              </Link>
            </div>
            <div>
                <PDFDownloadLink
                    document={<ExtincteurPDF extincteurDetails={extincteurDetails} selectedStatus={selectedStatus} observations={observations} />}
                    fileName="extincteur_details.pdf"
                      >
                  {({ loading }: { loading: boolean }) => (
                    <Button disabled={loading}>
                      {loading ? 'Génération du PDF...' : 'Télécharger PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>    
              </div>
            </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Fiche de l'extincteur
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
                  <h3 className="font-semibold text-gray-(00">Dernière vérification</h3>
                  <p className="text-gray-900 mt-1">
                    {formatDate(extincteurDetails.DateDerniereVerification)}
                  </p>
                </div>
              </div>

              <div className="mt-8 mb-6">
                
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
                              disabled
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
                              disabled
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
                            disabled
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              
            </>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
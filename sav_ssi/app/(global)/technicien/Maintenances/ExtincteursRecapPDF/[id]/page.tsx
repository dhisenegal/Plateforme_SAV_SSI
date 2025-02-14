'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getExtincteursForSystem, getInstallationIdFromMaintenance, getSiteByInstallation } from '@/actions/technicien/planning';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react'; // Assuming you use next-auth for session management

interface MaintenanceAction {
  id: number;
  statut: boolean;
  observation: string;
  maintenance: {
    numero: string;
    dateMaintenance: string | null;
    statut: string;
  };
  action: {
    id: number;
    libeleAction: string;
  };
}

interface Extinguisher {
  idInstallationExtincteur: number;
  idInstallationEquipement: number;
  number: string;
  location: string;
  status: string;
  extinguisher: {
    typePression: string;
    modeVerification: string;
    TypeExtincteur: {
      nom: string;
    };
  };
  details?: {
    DateFabrication: string;
    DatePremierChargement: string;
    DateDerniereVerification: string;
  };
  maintenanceActions: MaintenanceAction[];
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: 1,
    borderColor: '#000000',
    paddingBottom: 10,
  },
  logoContainer: {
    width: '20%',
  },
  logo: {
    width: 120,
    height: 60,
  },
  titleContainer: {
    width: '60%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  infoLeft: {
    width: '50%',
  },
  infoRight: {
    width: '50%',
    alignItems: 'flex-end',
  },
  infoText: {
    fontSize: 12,
    marginBottom: 3,
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
  },
  extincteurSection: {
    marginBottom: 5,
    padding: 10,
    border: 1,
    borderColor: '#000000',
    borderRadius: 5,
    backgroundColor: '#F9FAFB',
  },
  extincteurHeader: {
    backgroundColor: '#E5E7EB',
    padding: 8,
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#000000',
  },
  extincteurInfo: {
    flex: 1,
    padding: 5,
  },
  actionsTable: {
    margin: 8,
  },
  actionTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#D1D5DB',
    padding: 6,
    marginBottom: 5,
  },
  actionHeaderCell: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  actionRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#E5E7EB',
    padding: 4,
  },
  actionCell: {
    fontSize: 9,
  },
  actionNameColumn: {
    width: '30%',
  },
  statusColumn: {
    width: '10%',
  },
  observationColumn: {
    width: '60%',
  },
  footer: {
    marginTop: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signatureBlock: {
    width: '45%',
    borderTop: 1,
    borderColor: '#000000',
    paddingTop: 10,
  },
  signatureText: {
    fontSize: 10,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },
});

const ExtincteursRecapPDF = ({ extincteurs, siteName, maintenanceDate, technicianName }: { extincteurs: Extinguisher[], siteName: string, maintenanceDate: string, technicianName: string }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getUniqueActions = (actions: MaintenanceAction[]) => {
    const uniqueActionsMap = new Map();
    
    actions.forEach(action => {
      const key = action.action.libeleAction;
      if (!uniqueActionsMap.has(key)) {
        uniqueActionsMap.set(key, action);
      }
    });

    return Array.from(uniqueActionsMap.values());
  };

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image src="/logo.jpg" style={styles.logo} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>FICHE RÉCAPITULATIVE DES EXTINCTEURS</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoLeft}>
            <Text style={styles.infoText}>Technicien: {technicianName}</Text>
            <Text style={styles.infoText}>Client: {siteName}</Text>
          </View>
          <View style={styles.infoRight}>
            <Text style={styles.infoText}>Date de Maintenance: {formatDate(maintenanceDate)}</Text>
          </View>
        </View>

        {extincteurs.map((extincteur, index) => {
          const uniqueActions = getUniqueActions(extincteur.maintenanceActions);
          
          return (
            <View key={index} style={styles.extincteurSection} wrap={false}>
              <View style={styles.extincteurHeader}>
                <View style={[styles.extincteurInfo, { width: '25%' }]}>
                  <Text style={[styles.infoText, styles.boldText]}>
                    Numéro: {extincteur.number}
                  </Text>
                  <Text style={styles.infoText}>
                    Type: {extincteur.extinguisher.TypeExtincteur.nom}
                  </Text>
                </View>
                <View style={[styles.extincteurInfo, { width: '25%' }]}>
                  <Text style={styles.infoText}>
                    Emplacement: {extincteur.location}
                  </Text>
                  <Text style={styles.infoText}>
                    Statut: {extincteur.status}
                  </Text>
                </View>
                <View style={[styles.extincteurInfo, { width: '25%' }]}>
                  <Text style={styles.infoText}>
                    Type Pression: {extincteur.extinguisher.typePression}
                  </Text>
                  <Text style={styles.infoText}>
                    Mode Vérification: {extincteur.extinguisher.modeVerification}
                  </Text>
                </View>
                <View style={[styles.extincteurInfo, { width: '25%' }]}>
                  <Text style={styles.infoText}>
                    Fabrication: {extincteur.details?.DateFabrication ? 
                      formatDate(extincteur.details.DateFabrication) : '-'}
                  </Text>
                  <Text style={styles.infoText}>
                    Dernier contrôle: {extincteur.details?.DateDerniereVerification ? 
                      formatDate(extincteur.details.DateDerniereVerification) : '-'}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsTable}>
                <View style={styles.actionTableHeader}>
                  <Text style={[styles.actionHeaderCell, styles.actionNameColumn]}>Action</Text>
                  <Text style={[styles.actionHeaderCell, styles.statusColumn]}>Statut</Text>
                  <Text style={[styles.actionHeaderCell, styles.observationColumn]}>Observation</Text>
                </View>
                
                {uniqueActions.map((action, actionIndex) => (
                  <View key={actionIndex} style={styles.actionRow}>
                    <Text style={[styles.actionCell, styles.actionNameColumn]}>
                      {action.action.libeleAction}
                    </Text>
                    <Text style={[styles.actionCell, styles.statusColumn]}>
                      {action.statut ? 'OK' : 'NOK'}
                    </Text>
                    <Text style={[styles.actionCell, styles.observationColumn]}>
                      {action.observation || '-'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.footer}>
          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureText}>VISA Technicien</Text>
            </View>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureText}>VISA Client</Text>
            </View>
          </View>
          <Text style={styles.footerText}>DHI - Solutions and Integrated Systems</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function ExtincteursRecapPDFPage() {
  const params = useParams();
  const { data: session } = useSession();
  const id = parseInt(params.id as string);
  const [extincteurs, setExtincteurs] = useState<Extinguisher[]>([]);
  const [siteName, setSiteName] = useState<string>('');
  const [maintenanceDate, setMaintenanceDate] = useState<string>('');
  const [technicianName, setTechnicianName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const installationId = await getInstallationIdFromMaintenance(id);
        const response = await getExtincteursForSystem(installationId);
        const siteResponse = await getSiteByInstallation(installationId);

        if (response.success) {
          setExtincteurs(response.data);
          setMaintenanceDate(response.data.length > 0 ? response.data[0].maintenanceActions[0].maintenance.dateMaintenance : '');
        }

        if (siteResponse && typeof siteResponse === 'object' && 'nom' in siteResponse) {
          setSiteName(siteResponse.nom);
        }

        if (session && session.user && session.user.prenom && session.user.nom) {
          setTechnicianName(`${session.user.prenom} ${session.user.nom}`);
        }
          
         else {
          setTechnicianName('');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, session]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <PDFDownloadLink
        document={<ExtincteursRecapPDF extincteurs={extincteurs} siteName={siteName} maintenanceDate={maintenanceDate} technicianName={technicianName} />}
        fileName="recap_extincteurs.pdf"
      >
        {({ loading }) => (
          <Button disabled={loading}>
            {loading ? 'Génération du PDF...' : 'Télécharger le PDF récapitulatif'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
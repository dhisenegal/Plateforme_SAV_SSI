'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formatDate1, formatDateTime } from '@/lib/fonction';
import Image from 'next/image';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Svg, Path } from '@react-pdf/renderer';
import { Image as PdfImage,  } from '@react-pdf/renderer';
import { fetchDetails, fetchMaintenanceActions, updateMaintenanceActions } from '@/lib/fonctionas';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Ajout des composants SVG personnalisés
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
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row', // Aligne le logo et le titre horizontalement
    alignItems: 'center', // Aligne verticalement au centre
    padding: 10, // Espacement à l'intérieur du bord
    marginBottom: 20, // Espacement après le header
    borderWidth: 1, // Bordure autour du bloc logo + titre
    borderColor: '#000000', // Couleur de la bordure
    borderRadius: 5, // Coins arrondis pour un effet plus esthétique
    paddingRight: 20, // Un peu plus d'espace à droite
    height: 100, // Définit la hauteur du bloc (logo + titre + bordure)
  },
  logoContainer: {
    marginRight: 10, // Espacement entre le logo et le titre
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
    marginLeft: 10, // Espacement entre le trait vertical et le titre
    alignItems: 'center',
  },
  separator: {
    width: 1, // Largeur du trait
    backgroundColor: '#000', // Couleur du trait
    marginRight: 10, // Espacement entre le logo et le trait
    height: '126%', // Hauteur du trait égale à la hauteur du parent (bloc contenant le logo et le titre)
  },
  smallTextContainer: {
    marginTop: 10, // Espace avant le texte
    fontSize: 8, // Taille de texte petite
    lineHeight: 12, // Espacement entre les lignes
    color: '#000', // Couleur du texte
    textAlign: 'center', // Centrer le texte
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoGroup: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row', // Assurez-vous que label et valeur sont sur la même ligne
    marginBottom: 5, // Réduit l'espacement entre chaque ligne
  },
  label: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    width: 'auto', // Permet au label de ne pas occuper tout l'espace
    marginRight: 5, // Espacement direct après le label
    padding: 0, // Supprime tout espacement interne
  },
  value: {
    fontSize: 12,
    marginLeft: 0, // Pas de marge à gauche de la valeur
    padding: 0, // Pas de padding pour réduire l'espace
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
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
  signatureSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginBottom: 10,
  },
  statusIconSuccess: {
    color: '#22C55E',  // Vert
    fontSize: 16,
  },
  statusIconError: {
    color: '#EF4444',  // Rouge
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
    padding: 5
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
});

const MaintenancePDF = ({ data, actions }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Conteneur avec le logo, le séparateur vertical et le titre */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <PdfImage src="/logo.jpg" style={styles.logo} />
        </View>

        {/* Trait vertical séparateur */}
        <View style={styles.separator} />

        {/* Titre "Fiche de Maintenance" */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>FICHE DE MAINTENANCE</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.value}>
                   <Text>FMDet-S07</Text>
                   <Text>Version: 02</Text>
                   <Text>Date de révision:</Text>
                   <Text> 01-03-2022</Text>
         </View>
      </View>

      {/* Nouveau séparateur sous le titre */}
     

      {/* Troisième partie du cadran */}
      

      <View style={styles.infoContainer}>
        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Client : </Text>
            <Text style={styles.value}>{data.clientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact : </Text>
            <Text style={styles.value}>{data.siteName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Téléphone : </Text>
            <Text style={styles.value}>{data.numero}</Text>
          </View>
        </View>

        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date Prévu: </Text>
            <Text style={styles.value}>{formatDate1(data.datePlanifiee)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date et Heure Début : </Text>
            <Text style={styles.value}>{formatDateTime(data.dateMaintenance)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date et Heure Fin : </Text>
            <Text style={styles.value}>{formatDateTime(data.dateFinMaint)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{(data.systeme)}</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCellHeader, styles.cellTask]}>Taches</Text>
          <Text style={[styles.tableCellHeader, styles.cellStatus]}>Statut</Text>
          <Text style={[styles.tableCellHeader, styles.cellObs]}>Observations</Text>
        </View>

        {actions.map((action) => (
          <View key={action.action_id} style={styles.tableRow}>
            <View style={[styles.tableCell, styles.cellTask]}>
              <Text>{action.libeleAction}</Text>
            </View>
            <View style={[styles.tableCell, styles.cellStatus]}>
              <View style={styles.iconContainer}>
                {action.statut ? <CheckIcon /> : <CrossIcon />}
              </View>
            </View>
            <View style={[styles.tableCell, styles.cellObs]}>
              <Text>{action.observation || 'ras'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>VISA Technicien :</Text>
          <Text style={styles.value}>{data.technicienName}</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>VISA Client :</Text>
          <Text style={styles.value}>{data.clientName}</Text>
        </View>
      </View>

       <Text style={styles.footer}>DHI - Solutions and Integrated Systems </Text>
    </Page>
  </Document>
);


const formatDate = (dateTime: string | undefined): string => {
  if (!dateTime || dateTime === 'N/A') return 'N/A'; // Vérifie si la valeur est 'N/A' ou undefined

  // Si la date est au format "DD/MM/YYYY", on la convertit en "YYYY-MM-DD"
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateTime)) {
    const [day, month, year] = dateTime.split('/');
    dateTime = `${year}-${month}-${day}`; // Conversion vers "YYYY-MM-DD"
  }

  const date = new Date(dateTime);

  // Vérifiez si la date est valide
  if (isNaN(date.getTime())) {
    console.error("Date invalide:", dateTime);
    return 'N/A';
  }

  try {
    // Formatage de la date
    const formattedDate = new Intl.DateTimeFormat('fr-SN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);

    // Formatage de l'heure
    const formattedTime = new Intl.DateTimeFormat('fr-SN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Format 24 heures
    }).format(date);

    // Combinaison de la date et de l'heure
    return `${formattedDate} ${formattedTime}`;
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return 'N/A';
  }
};
const formatHeure = (dateTime: string | undefined): string => {
  if (!dateTime) return 'N/A';
  try {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('fr-SN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Dakar',
      hour12: false
    }).format(date);
  } catch (error) {
    console.error("Erreur lors du formatage de l'heure:", error);
    return 'N/A';
  }
};

const MaintenancePage = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [data, setData] = useState<MaintenanceData | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        const [maintenanceData, actionsData] = await Promise.all([
          fetchDetails(id, "maintenance"),
          fetchMaintenanceActions(id)
        ]);

        if (!isMounted) return;

        setData({
          ...maintenanceData,
          dateMaintenance: maintenanceData.dateMaintenance 
            ? new Date(maintenanceData.dateMaintenance)
            : ''
        });
        setActions(actionsData);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
          console.error('Erreur de chargement:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 mb-10">
      <div className="w-full flex justify-end gap-4 mb-4 px-4">
        {data && actions.length > 0 && (
          <PDFDownloadLink
            document={<MaintenancePDF data={data} actions={actions} />}
            fileName="fiche-maintenance.pdf"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors cursor-pointer"
          >
            {({ loading }) => loading ? 'Génération...' : 'Exporter en PDF'}
          </PDFDownloadLink>
        )}
      </div>

      <div className="w-[210mm] p-6 border rounded-lg shadow-lg bg-white">
        {data && (
          <div id="pdf-content" className="space-y-6">
            <div className="flex justify-start mb-8">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={200}
                height={100}
                priority
              />
            </div>
            
            <h1 className="text-2xl font-Helvetica-Bold text-center mb-8">
              FICHE DE MAINTENANCE
            </h1>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <p><strong>Client :</strong> {data.clientName || 'N/A'}</p>
                <p><strong>Contact :</strong> {data.siteName || 'N/A'}</p>
                <p><strong>Téléphone :</strong> {data.numero || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Date Prévu:</strong> {(formatDate1(data.datePlanifiee)|| '')}</p>
                <p><strong>Date et Heure Début :</strong> {formatDateTime(data.dateMaintenance || 'N/A' )}</p>
                <p><strong>Date et Heure Fin :</strong> {formatDateTime(data.dateFinMaint || 'N/A')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{data.systeme}</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-3 text-left">Taches</th>
                      <th className="border p-3 text-center w-24">Statut</th>
                      <th className="border p-3 text-left">Observations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((action) => (
                      <tr key={action.action_id} className="hover:bg-gray-50">
                        <td className="border p-3">{action.libeleAction}</td>
                        <td className="border p-3 text-center">
                          <button
                          className="hover:opacity-75 transition-opacity"
                          title={action.statut ? "Marquer comme non fait" : "Marquer comme fait"}
                            onClick={() => handleStatusChange(action.action_id)}
                          disabled>
                            {action.statut ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <FaTimesCircle className="text-red-500" />
                            )}
                          </button>
                        </td>
                        <td className="border p-3">
                          <textarea
                          value={action.observation}
                          onChange={(e) => handleObservationChange(action.action_id, e.target.value)}
                          className="w-full min-h-[80px] p-2 border rounded resize-y"
                          placeholder="Ajouter une observation"
                          disabled
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 pt-8 border-t">
              <div>
                <p className="font-semibold mb-2">VISA Technicien :</p>
                <p className="mt-2 text-sm text-center">{data.technicienName}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">VISA Client :</p>
                <p className="mt-2 text-sm text-center">{data.clientName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
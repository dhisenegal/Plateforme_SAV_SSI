'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getExtincteursForSystem, getInstallationIdFromMaintenance } from '@/actions/technicien/planning';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";

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
}

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
    width: '12.5%',
  },
  tableCell: {
    padding: 8,
    fontSize: 11,
    color: '#000000',
    width: '12.5%',
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
});

const ExtincteursRecapPDF = ({ extincteurs }: { extincteurs: Extinguisher[] }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Document>
      <Page size={{ width: 841.89, height: 595.28 }} style={styles.page}>
        {/* En-tête avec logo et titre */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image src="/logo.jpg" style={styles.logo} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>FICHE RÉCAPITULATIVE DES EXTINCTEURS</Text>
          </View>
        </View>

        {/* Tableau des extincteurs */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>Numéro</Text>
            <Text style={styles.tableCellHeader}>Type</Text>
            <Text style={styles.tableCellHeader}>Emplacement</Text>
            <Text style={styles.tableCellHeader}>Statut</Text>
            <Text style={styles.tableCellHeader}>Type Pression</Text>
            <Text style={styles.tableCellHeader}>Mode Vérification</Text>
            <Text style={styles.tableCellHeader}>Date Fabrication</Text>
            <Text style={styles.tableCellHeader}>Dernier Contrôle</Text>
          </View>

          {extincteurs.map((extincteur, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{extincteur.number}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{extincteur.extinguisher.TypeExtincteur.nom}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{extincteur.location}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{extincteur.status}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{extincteur.extinguisher.typePression}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{extincteur.extinguisher.modeVerification}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{extincteur.details?.DateFabrication && formatDate(extincteur.details.DateFabrication)}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{extincteur.details?.DateDerniereVerification && formatDate(extincteur.details.DateDerniereVerification)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Section de signature */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>VISA Technicien :</Text>
            <Text style={styles.value}>[Nom du Technicien]</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>VISA Client :</Text>
            <Text style={styles.value}>[Nom du Client]</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>DHI - Solutions and Integrated Systems</Text>
      </Page>
    </Document>
  );
};

export default function ExtincteursRecapPDFPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [extincteurs, setExtincteurs] = useState<Extinguisher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const installationId = await getInstallationIdFromMaintenance(id);
        const response = await getExtincteursForSystem(installationId);
        if (response.success) {
          setExtincteurs(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des extincteurs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <PDFDownloadLink
        document={<ExtincteursRecapPDF extincteurs={extincteurs} />}
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
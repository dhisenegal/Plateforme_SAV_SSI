'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDetails } from "@/lib/fonctionas";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Image as PdfImage } from '@react-pdf/renderer';
import Image from "next/image";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  logoContainer: {
    width: 150
  },
  logo: {
    width: 100,
    height: 50
  },
  reference: {
    padding: 4,
    borderWidth: 1,
    borderColor: '#000000',
    fontSize: 10
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  formContainer: {
    gap: 8
  },
  row: {
    flexDirection: 'row',
    gap: 40
  },
  leftColumn: {
    flex: 1
  },
  rightColumn: {
    flex: 1
  },
  field: {
    marginBottom: 10
  },
  label: {
    fontSize: 11,
    marginBottom: 2
  },
  dotLine: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#000000',
    height: 20
  },
  garantieSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  checkbox: {
    width: 12,
    height: 12,
    border: 1,
    borderColor: '#000000',
    marginHorizontal: 5
  },
  multiLine: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#000000',
    minHeight: 60
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40
  },
  signatureBlock: {
    width: '45%'
  },
  signatureBox: {
    height: 60,
    borderWidth: 1,
    borderColor: '#000000',
    marginTop: 10
  },
  checked: {
  backgroundColor: '#000000'
},
});

const InterventionPDF = ({ data }: { data: InterventionData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <PdfImage src="/logo.jpg" style={styles.logo} />
          <Text style={{ fontSize: 8 }}>Solutions and Integrated Systems</Text>
        </View>
        <View>
          <Text style={styles.reference}>FMC-S19-MASE19</Text>
        </View>
      </View>

      <Text style={styles.title}>FICHE D'INTERVENTION</Text>

      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <View style={styles.field}>
              <Text style={styles.label}>Client : {data.clientName || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Adresse : {data.adresse || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Téléphone : {data.telephoneContact || 'N/A'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Système : {data.systeme || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.field}>
              <Text style={styles.label}>Date d'intervention : {formatDate(data.Heureint)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Heure d'intervention : {formatHeure(data.Heureint)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Durée d'intervention : {data.dureeHeure || 'N/A'} Hrs</Text>
            </View>
          </View>
        </View>

        <View style={styles.garantieSection}>
          <Text style={styles.label}>Matériel sous garantie :</Text>
          <Text>OUI</Text>
          <View style={[styles.checkbox, data.sousGarantie === 1 && styles.checked]} />
          <Text>NON</Text>
          <View style={[styles.checkbox, data.sousGarantie === 0 && styles.checked]} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date de déclaration de panne : {formatDate(data.dateDeclaration)}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type de panne déclarée :</Text>
          <Text>{data.description || 'N/A'}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Diagnostics / Observations :</Text>
          <Text>{data.diagnostics || 'N/A'}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Travaux réalisés / Pièces Fournies :</Text>
          <Text>{data.travauxRealises || 'N/A'}</Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.label}>Technicien :</Text>
            <Text>{data.technicienName || 'N/A'}</Text>
            <Text style={styles.label}>Signature :</Text>
            <View style={styles.signatureBox} />
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.label}>Nom Client :</Text>
            <Text>{data.clientName || 'N/A'}</Text>
            <Text style={styles.label}>Signature :</Text>
            <View style={styles.signatureBox} />
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
interface InterventionData {
  clientName?: string;
  adresse?: string;
  telephoneContact?: string;
  systeme?: string;
  Heureint?: string; // Changé pour correspondre au nom du champ dans la BDD
  dureeHeure?: string;
  sousGarantie?: number;
  dateDeclaration?: string;
  description?: string;
  diagnostics?: string;
  travauxRealises?: string;
  technicienName?: string;
}

const formatHeure = (dateTime: string | undefined): string => {
  if (!dateTime) return 'N/A';
  try {
    // Créer un objet Date à partir de la chaîne de date
    const date = new Date(dateTime);
    
    // Formater l'heure en utilisant la locale 'fr-SN' et le fuseau horaire de Dakar
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


const formatDate = (dateTime: string | undefined): string => {
  if (!dateTime) return 'N/A';
  try {
    return new Date(dateTime).toLocaleDateString("SN", {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return 'N/A';
  }
};

const InterventionPage = () => {
  const [data, setData] = useState<InterventionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDetails(id, "intervention");
        console.log('Données reçues:', result);
        console.log('Valeur de sousGarantie:', result.sousGarantie);
        console.log('Type de sousGarantie:', typeof result.sousGarantie);
        
        // Assurons-nous que sousGarantie est un nombre
        const processedResult = {
          ...result,
          sousGarantie: Number(result.sousGarantie)
        };
        
        setData(processedResult);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center mt-10">
  <div className="w-full flex justify-end gap-4 mb-4 px-4">
        {data && (
          <PDFDownloadLink
            document={<InterventionPDF data={data} />}
            fileName="fiche-intervention.pdf"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors cursor-pointer"
          >
            {({ loading }) => loading ? 'Génération...' : 'Exporter en PDF'}
          </PDFDownloadLink>
        )}
      </div>
      <div className="w-[210mm] p-4 border rounded shadow bg-white">
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!data && !error && <p className="text-gray-500 mt-2">Chargement des données...</p>}
        {!data && error && <p className="text-red-500 mt-2">Erreur lors du chargement des données.</p>}

        {data && (
          <div id="pdf-content" className="mt-4 p-4 bg-white rounded">
            <div className="mb-6">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={200}
                height={100}
              />
            </div>
            <h2 className="text-center text-xl font-bold">Fiche d'intervention</h2>
            <div className="flex justify-between mb-4">
              <div>
                <p><strong>Client :</strong> {data.clientName || 'N/A'}</p>
                <p><strong>Adresse :</strong> {data.adresse || 'N/A'}</p>
                <p><strong>Téléphone :</strong> {data.telephoneContact || 'N/A'}</p>
                <p><strong>Système :</strong> {data.systeme || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Date Intervention :</strong> {formatDate(data.Heureint)}</p>
                <p><strong>Heure Intervention :</strong> {formatHeure(data.Heureint)}</p>
                <p><strong>Durée Intervention (Hrs):</strong> {data.dureeHeure || 'N/A'}</p>
              </div>
            </div>
            <div>
          {/* Ajout de debug directement dans le rendu */}
          <div style={{ display: 'none' }}>
            Debug sousGarantie: {JSON.stringify({
              value: data.sousGarantie,
              type: typeof data.sousGarantie,
              isZero: data.sousGarantie === 0,
              isOne: data.sousGarantie === 1
            })}
          </div>

          <div className="flex items-center mb-4">
            <p className="mr-2"><strong>Matériel sous garantie :</strong></p>
            <label className="mr-2 flex items-center">
              Oui
              <input
                type="checkbox"
                checked={Number(data.sousGarantie) === 1}
                readOnly
                className="ml-1"
                disabled
              />
            </label>
            <label className="flex items-center">
              Non
              <input
                type="checkbox"
                checked={Number(data.sousGarantie) === 0}
                readOnly
                className="ml-1"
                disabled
              />
            </label>
          </div>
              <p><strong>Date de Déclaration :</strong> {formatDate(data.dateDeclaration)}</p>
              <p><strong>Type de Panne déclarée :</strong> {data.description || 'N/A'}</p>
              <p><strong>Diagnostic / Observations :</strong> {data.diagnostics || 'N/A'}</p>
              <p><strong>Travaux Réalisés/ Pièce Fournies :</strong> {data.travauxRealises || 'N/A'}</p>
            </div>
            <div className="flex justify-between mb-4">
              <div>
                <p><strong>Technicien :</strong> {data.technicienName || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Nom client :</strong> {data.clientName || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterventionPage;
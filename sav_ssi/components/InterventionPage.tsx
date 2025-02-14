'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDetails } from "@/lib/fonctionas";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Image as PdfImage } from '@react-pdf/renderer';
import { formatDateTime } from "@/lib/fonction";
import Image from "next/image";
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  logoContainer: {
    width: 120
  },
  logo: {
    width: '100%',
    height: 'auto'
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8
  },
  label: {
    fontSize: 12,
    fontWeight: '900', // Plus gras
    color: '#000', // Noir foncé
    marginRight: 5,
  },
  value: {
    fontSize: 12,
    color: '#555',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  checkbox: {
    width: 12,
    height: 12,
    border: 1,
    borderColor: '#000',
    marginRight: 5,
  },
  checked: {
    backgroundColor: '#000'
  },
  checkboxLabel: {
    fontSize: 12,
    marginLeft: 5,
    color: '#555',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  signatureBlock: {
    width: '45%'
  },
  signatureBox: {
    height: 60,
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 10
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
  clientAndInterventionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20
  },
  clientColumn: {
    width: '48%'
  },
  interventionColumn: {
    width: '48%'
  },
  sameCard: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'
  },
  labelValueContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  sectionWithSpacing: {
    marginBottom: 10,
  },
  diagnosticsObservationsCard: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'
  },
  typePanneCard: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  },
  labelOnNewLine: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  rectangleFrame: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10, // Ajuste pour ajouter du padding horizontal
    paddingVertical: 5, // Ajuste le padding vertical
    marginBottom: 10,
    alignSelf: 'center', // Centre le cadre automatiquement
  }
});

const InterventionPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <PdfImage src="/logo.jpg" style={styles.logo} />
        </View>
        {/* FMC-S19-MASE19 avec cadre rectangle noir ajusté */}
        <View style={styles.rectangleFrame}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>FMC-S19-MASE19</Text>
        </View>
      </View>

      <Text style={styles.title}>FICHE D'INTERVENTION</Text>

      {/* Informations du Client et Détails de l'Intervention alignés sur la même ligne */}
      <View style={styles.clientAndInterventionContainer}>
        <View style={styles.clientColumn}>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Client :</Text>
              <Text style={styles.value}>{data.clientName || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Adresse :</Text>
              <Text style={styles.value}>{data.adresse || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Téléphone :</Text>
              <Text style={styles.value}>{data.telephoneContact || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.interventionColumn}>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Date et heure Début  :</Text>
              <Text style={styles.value}>{(formatDateTime(data.dateIntervention))}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date et heure Fin :</Text>
              <Text style={styles.value}>{(formatDateTime(data.dateFinInt))}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Nouveau cadran pour système, matériel sous garantie et déclaration de panne */}
      <View style={styles.sameCard}>
        <View style={styles.sectionWithSpacing}>
          <View style={styles.row}>
            <Text style={styles.label}>Système :</Text>
            <Text style={styles.value}>{data.systeme || 'N/A'}</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Text style={styles.label}>Matériel sous garantie :</Text>
            <View style={[styles.checkbox, data.sousGarantie === 1 ? styles.checked : {}]} />
            <Text style={styles.checkboxLabel}>Oui</Text>
            <View style={[styles.checkbox, data.sousGarantie === 0 ? styles.checked : {}]} />
            <Text style={[styles.checkboxLabel, { marginLeft: 10 }]}>Non</Text>
          </View>
        </View>

        {/* Déclaration de panne après "Matériel sous garantie" */}
        <View style={styles.row}>
          <Text style={styles.label}>Déclaration de panne :</Text>
          <Text style={styles.value}>{formatDateTime(data.dateDeclaration)}</Text>
        </View>
      </View>

      {/* Nouveau cadran séparé pour "Type de panne déclarée" sur une nouvelle ligne */}
      <View style={styles.typePanneCard}>
        <View style={styles.labelOnNewLine}>
          <Text style={styles.label}>Type de panne déclarée :</Text>
          <Text style={styles.value}>{data.description || 'N/A'}</Text>
        </View>
      </View>

      {/* Diagnostics / Observations Section, avec information sur nouvelle ligne */}
      <View style={styles.diagnosticsObservationsCard}>
        <View style={styles.labelOnNewLine}>
          <Text style={styles.label}>Diagnostics / Observations :</Text>
          <Text style={styles.value}>{data.diagnostics || 'N/A'}</Text>
        </View>
      </View>

      {/* Travaux Réalisés / Pièces Fournies Section, sur nouvelle ligne également */}
      <View style={styles.diagnosticsObservationsCard}>
        <View style={styles.labelOnNewLine}>
          <Text style={styles.label}>Travaux Réalisés / Pièces Fournies :</Text>
          <Text style={styles.value}>{data.travauxRealises || 'N/A'}</Text>
        </View>
      </View>

      {/* Signatures Section */}
      <View style={styles.signatureSection}>
        <View style={styles.signatureBlock}>
          <Text style={styles.label}>Technicien :</Text>
          <Text style={styles.value}>{data.technicienName || 'N/A'}</Text>
          <Text style={styles.label}>Signature :</Text>
          <View style={styles.signatureBox} />
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.label}>Nom du Client :</Text>
          <Text style={styles.value}>{data.clientName || 'N/A'}</Text>
          <Text style={styles.label}>Signature :</Text>
          <View style={styles.signatureBox} />
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>DHI - Solutions and Integrated Systems </Text>
    </Page>
  </Document>
);

interface InterventionData {
  clientName?: string;
  adresse?: string;
  telephoneContact?: string;
  systeme?: string;
  dateIntervention?: string;
  dureeHeure?: string;
  dateFinInt?: string;
  sousGarantie?: number;
  dateDeclaration?: string;
  description?: string;
  diagnostics?: string;
  travauxRealises?: string;
  technicienName?: string;
}


const InterventionPage = () => {
  const [data, setData] = useState<InterventionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDetails(id, "intervention");
        setData({
          ...result,
          sousGarantie: Number(result.sousGarantie)
        });
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py
            
            -2 rounded transition-colors cursor-pointer"
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
          <div id="pdf-content" className="mt-4 p-4 bg-white rounded shadow-lg">
            <div className="mb-6">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={200}
                height={100}
              />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Fiche d'intervention</h2>
            <div className="flex justify-between mb-4">
              <div className="w-1/2">
                <p><strong>Client :</strong> {data.clientName || 'N/A'}</p>
                <p><strong>Adresse :</strong> {data.adresse || 'N/A'}</p>
                <p><strong>Téléphone :</strong> {data.telephoneContact || 'N/A'}</p>
                <p><strong>Système :</strong> {data.systeme || 'N/A'}</p>
              </div>
              <div className="w-1/2">
                <p><strong>Date et heure Début  :</strong> {(formatDateTime(data.dateIntervention))}</p>
                <p><strong>Date et heure Fin:</strong> {(formatDateTime(data.dateFinInt))}</p>
                <p><strong>Durée Intervention (Hrs):</strong> {data.dureeHeure || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <strong>Matériel sous garantie :</strong>
                <div className="flex ml-4">
                  <div className="mr-2">
                    <input
                      type="checkbox"
                      checked={Number(data.sousGarantie) === 1}
                      disabled
                      className="mr-2"
                    /> Oui
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={Number(data.sousGarantie) === 0}
                      disabled
                      className="mr-2"
                    /> Non
                  </div>
                </div>
              </div>
              <p><strong>Date de Déclaration :</strong> {formatDateTime(data.dateDeclaration)}</p>
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

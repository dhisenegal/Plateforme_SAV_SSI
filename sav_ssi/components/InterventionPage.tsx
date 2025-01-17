'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDetails } from "@/lib/fonctionas";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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


  const exportToPDF = () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('export.pdf');
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
  <div className="mb-6 flex w-full">
    <button onClick={exportToPDF} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded ml-auto mr-20">
      Exporter
    </button>
  </div>
      <div className="w-[210mm] p-4 border rounded shadow bg-white">
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!data && !error && <p className="text-gray-500 mt-2">Chargement des données...</p>}
        {!data && error && <p className="text-red-500 mt-2">Erreur lors du chargement des données.</p>}

        {data && (
          <div id="pdf-content" className="mt-4 p-4 bg-white rounded">
            <div className="mb-6">
              <img
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
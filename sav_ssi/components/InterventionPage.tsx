'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDetails } from "@/lib/fonctionas";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { checkGarantieStatus } from "@/lib/fonction"; // Importer la fonction de garantie

const InterventionPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [garantieStatus, setGarantieStatus] = useState(null); // Statut de la garantie (1 ou 0)
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDetails(id, "intervention");
        
        if (result.dateIntervention) {
          result.dateIntervention = new Date(result.dateIntervention).toLocaleDateString();
        }

        // Vérification du statut de la garantie à l'aide de la fonction checkGarantieStatus
        const status = await checkGarantieStatus(result.idInstallationEq); // Utilisez le bon champ pour l'ID de l'installation
        setGarantieStatus(status); // Mettre à jour l'état de la garantie

        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  };

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
      <div className="w-full flex justify-end mb-4 pr-4">
        <button onClick={exportToPDF} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
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
                <p><strong>Date Intervention :</strong> {data.dateIntervention}</p>
                <p><strong>Heure Intervention :</strong> {data.heureIntervention || 'N/A'}</p>
                <p><strong>Durée Intervention :</strong> {data.dureeHeure || 'N/A'}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <p className="mr-2"><strong>Matériel sous garantie :</strong></p>
                <label className="mr-2">
                  Oui
                  <input
                    type="checkbox"
                    checked={garantieStatus === 1} // Coche "Oui" si la garantie est active
                    readOnly
                    className="ml-1"
                  />
                </label>
                <label>
                  Non
                  <input
                    type="checkbox"
                    checked={garantieStatus === 0} // Coche "Non" si la garantie n'est pas active
                    readOnly
                    className="ml-1"
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
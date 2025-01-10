'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDetails } from "@/lib/fonctionas";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from "next/image";

const MaintenancePage = ({ id: initialId, data: initialData, error: initialError }) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(initialError);
  const { id: paramId } = useParams();
  const id = initialId || paramId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDetails(id, "maintenance");
        
        if (result.dateMaintenance) {
          result.dateMaintenance = new Date(result.dateMaintenance).toLocaleDateString();
        }

        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    if (!initialData && id) {
      fetchData();
    }
  }, [id, initialData]);

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
              <Image
                src="/logo.jpg" 
                alt="Logo" 
                width={200} 
                height={100}
              />
            </div>
            <h2 className="text-center text-xl font-bold">Fiche de Maintenance</h2>
            <div className="flex justify-between mb-4">
              <div>
                <p><strong>Client :</strong> {data.clientName || 'N/A'}</p>
                <p><strong>Contact :</strong> {data.adresse || 'N/A'}</p>
                <p><strong>Téléphone :</strong> {data.telephoneContact || 'N/A'}</p>
                <p><strong>Système :</strong> {data.systeme || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Date Intervention :</strong> {formatDate(data.dateMaintenance)}</p>
                <p><strong>Heure Début :</strong> {data.heureDebut || 'N/A'}</p>
                <p><strong>Heure fin  :</strong> {data.heureFin || 'N/A'}</p>
              </div>
            </div>
            <div>
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

export default MaintenancePage;
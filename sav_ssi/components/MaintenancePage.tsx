'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import Image from 'next/image';
import { fetchDetails, fetchMaintenanceActions, updateMaintenanceActions } from '@/lib/fonctionas';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface Action {
  action_id: number;
  libeleAction: string;
  statut: boolean;
  observation: string;
  idAction: number;
}

interface MaintenanceData {
  id: number;
  clientName: string;
  siteName: string;
  systeme: string;
  datePlanifiee: string;
  description: string;
  technicienName: string;
  idInstallation: number;
  dateMaintenance: string;
  heureDebut: string;
  heureFin: string;
  adresse: string;
  telephoneContact: string;
}

const MaintenancePage = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [data, setData] = useState<MaintenanceData | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
            ? new Date(maintenanceData.dateMaintenance).toLocaleDateString()
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

  const handleStatusChange = (actionId: number) => {
    setActions(prevActions =>
      prevActions.map(action =>
        action.action_id === actionId
          ? { ...action, statut: !action.statut }
          : action
      )
    );
  };

  const handleObservationChange = (actionId: number, observation: string) => {
    setActions(prevActions =>
      prevActions.map(action =>
        action.action_id === actionId
          ? { ...action, observation }
          : action
      )
    );
  };

  const handleSubmit = async () => {
    if (!id || saving) return;

    try {
      setSaving(true);
      await updateMaintenanceActions(id, actions);
      alert('Modifications enregistrées avec succès');
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
      console.error('Erreur de sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4">
        <View>
          <Text>Fiche de Maintenance</Text>
          <Text>Client: {data?.clientName}</Text>
          <Text>Date: {data?.dateMaintenance}</Text>
          {/* Add more fields as necessary */}
        </View>
      </Page>
    </Document>
  );

  const exportToPDF = () => {
    return (
      <PDFDownloadLink document={<MyDocument />} fileName="fiche-maintenance.pdf">
        {({ loading, error }) => {
          if (loading) return 'Loading document...';
          if (error) return 'Error loading document';
          return 'Exporter en PDF';
        }}
      </PDFDownloadLink>
    );
  };

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
        <button 
          onClick={handleSubmit} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          disabled={saving}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {exportToPDF()}
      </div>

      <div className="w-[210mm] p-6 border rounded-lg shadow-lg bg-white">
        {data && (
          <div id="pdf-content" className="space-y-6">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={200}
                height={100}
                priority
              />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-8">
              Fiche de Maintenance
            </h1>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <p><strong>Client :</strong> {data.clientName || 'N/A'}</p>
                <p><strong>Contact :</strong> {data.siteName || 'N/A'}</p>
                <p><strong>Téléphone :</strong> {data.telephoneContact || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Date :</strong> {data.dateMaintenance || 'N/A'}</p>
                <p><strong>Heure Début :</strong> {data.heureDebut || 'N/A'}</p>
                <p><strong>Heure Fin :</strong> {data.heureFin || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Liste des vérifications</h2>
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

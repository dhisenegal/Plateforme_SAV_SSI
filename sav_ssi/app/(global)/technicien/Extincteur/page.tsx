'use client';

import { useEffect, useState } from 'react';
import { countExtincteursForSystem, getExtincteursForSystem, getInstallationIdFromMaintenance } from '@/actions/technicien/planning'; // Importation des fonctions
import { FaEye } from 'react-icons/fa'; // Importation de l'icône "eye"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'; // Importation des composants de table

const ExtincteursPageContent = () => {
  const [installationId, setInstallationId] = useState<number | null>(null); // State pour l'ID d'installation
  const [totalExtincteurs, setTotalExtincteurs] = useState<number>(0);
  const [extincteurs, setExtincteurs] = useState<any[]>([]);

  useEffect(() => {
    // Récupérer l'ID de l'installation à partir de la fonction serveur
    const fetchInstallationId = async () => {
      const fetchedInstallationId = await getInstallationIdFromMaintenance();
      setInstallationId(fetchedInstallationId); // Mettre à jour l'ID d'installation
    };

    fetchInstallationId();
  }, []); // Ce useEffect se déclenche une seule fois au chargement de la page

  useEffect(() => {
    // Effectuer les appels API seulement lorsque l'ID de l'installation est disponible
    if (installationId !== null) {
      const fetchData = async () => {
        // Récupérer le nombre total d'extincteurs pour l'installation
        const total = await countExtincteursForSystem(2);
        setTotalExtincteurs(total);

        // Récupérer les extincteurs spécifiques et les afficher
        const extincteursList = await getExtincteursForSystem(2);
        setExtincteurs(extincteursList);
      };

      fetchData();
    }
  }, [installationId]); // Ce useEffect se déclenche lorsque l'ID de l'installation est mis à jour

  // Fonction pour afficher les détails de l'extincteur
  const handleDetailsClick = (extincteurId: number) => {
    alert(`Détails de l'extincteur ID: ${extincteurId}`); // Ceci peut être remplacé par une action réelle (par exemple, un modal)
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {installationId !== null ? (
        <>
          <h1 style={{ fontSize: '20px' }}>
             Nombre d'extincteurs: {totalExtincteurs}
          </h1>
          <h2 style={{ fontSize: '18px' }}>Moyens de secours Extincteur :</h2>

          {extincteurs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Charge</TableHead>
                  <TableHead>Mode Vérif.</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extincteurs.map((extincteur) => (
                  <TableRow key={extincteur.id} className="cursor-pointer hover:bg-blue-100">
                    <TableCell>{extincteur.type}</TableCell>
                    <TableCell>{extincteur.charge}</TableCell>
                    <TableCell>{extincteur.modeVerification}</TableCell>
                    <TableCell className="flex justify-center">
                      <button
                        onClick={() => handleDetailsClick(extincteur.id)}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '4px 4px',
                          cursor: 'pointer',
                          borderRadius: '50%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <FaEye style={{ fontSize: '16px' }} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Aucun extincteur trouvé pour cette installation.</p>
          )}
        </>
      ) : (
        <p>Chargement de l'installation...</p> // Affiche un message de chargement tant que l'ID n'est pas récupéré
      )}
    </div>
  );
};

export default ExtincteursPageContent;

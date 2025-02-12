"use client";

import * as XLSX from 'xlsx';

// Fonction utilitaire pour formater la date
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

// Fonction pour exporter les maintenances vers Excel
export const exportMaintenancesToExcel = (maintenances, fileName = 'planning-maintenances.xlsx') => {
  // Préparer les données pour l'export
  const data = maintenances.map(maintenance => ({
    'Client': maintenance.Contact.Client.nom,
    'Site': maintenance.Site.nom,
    'Date Planifiée': formatDate(maintenance.datePlanifiee),
    'Système': maintenance.Installation.Systeme.nom,
    'Technicien': `${maintenance.Technicien.prenom} ${maintenance.Technicien.nom}`,
  }));

  // Créer un nouveau classeur
  const workbook = XLSX.utils.book_new();
  
  // Convertir les données en feuille de calcul
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 30 }, // Client
    { wch: 30 }, // Site
    { wch: 15 }, // Date Planifiée
    { wch: 25 }, // Système
    { wch: 25 } // Technicien
  ];
  worksheet['!cols'] = colWidths;

  // Ajouter la feuille au classeur
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning');

  // Sauvegarder le fichier
  XLSX.writeFile(workbook, fileName);
};
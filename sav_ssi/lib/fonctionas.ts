// lib/fetchDetails.ts
"use server";

import prisma  from '@/lib/prisma'; // Assurez-vous d'importer Prisma si nécessaire
import {
  getClientName,
  getSystemeForIntervention,
  getSystemeForMaintenance,
  formatDate,
  getDescription,
  getStatut,
  getGarantieStatus,
} from './fonction';



export async function fetchDetails(id, type) {
  if (!id || !type) {
    throw new Error('ID ou type manquant');
  }

  try {
    const parsedId = parseInt(id);

    if (type === 'intervention') {
      const intervention = await prisma.intervention.findUnique({
        where: { id: parsedId },
        include: {
          Client: { select: { nom: true } },
          Site: { select: { nom: true } },
          Systeme: { select: { nom: true } },
          Technicien: { select: { prenom: true } },
        },
      });

      if (!intervention) {
        throw new Error('Intervention non trouvée');
      }

      // Extraire les champs nécessaires
      return {
        id: intervention.id,
        statut: intervention.statut,
        description: intervention.typePanneDeclare,
        dateDeclaration: intervention.dateDeclaration,
        clientName: intervention.Client?.nom || null,
        siteName: intervention.Site?.nom || null,
        systeme: intervention.Systeme?.nom || null,
        diagnostics: intervention.diagnostics,
        travauxRealises: intervention.travauxRealises,
        pieceFournies: intervention.pieceFournies,
        dateIntervention: intervention.dateIntervention,
        dureeHeure: intervention.dureeHeure,
        numero: intervention.numero,
        ficheInt: intervention.ficheInt,
        prenomContact: intervention.prenomContact,
        telephoneContact: intervention.telephoneContact,
        adresse: intervention.adresse,
        datePlanifiee: intervention.datePlanifiee,
        technicienName: intervention.Technicien?.prenom || null,
      };
    } else if (type === 'maintenance') {
      const maintenance = await prisma.maintenance.findUnique({
        where: { id: parsedId },
        include: {
          Installation: {
            include: {
              Client: { select: { nom: true } },
              Site: { select: { nom: true } },
              Systeme: { select: { nom: true } },  // Inclure le système ici
            },
          },
        },
      });

      if (!maintenance) {
        throw new Error('Maintenance non trouvée');
      }

      return {
        id: maintenance.id,
        statut: maintenance.statut,
        clientName: maintenance.Installation?.Client?.nom || null,
        siteName: maintenance.Installation?.Site?.nom || null,
        datePlanifiee: maintenance.dateMaintenance,
        systeme: maintenance.Installation?.Systeme?.nom || null, // Accéder au système lié à l'installation
        description:maintenance.description,
        idInstallation: maintenance?.idInstallation,
      };
    } else {
      throw new Error('Type invalide');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails :', error);
    throw new Error('Erreur lors de la récupération des détails');
  }
}

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



export async function fetchDetails(id: number, type: string) {
  let clientName = null;
  let siteName = null;
  let systeme = null;
  let date = null;
  let description = null;
  let statut = null;
  let garantieStatus = null;
  let dateDeclarationPanne = null;
  let diagnostic = null;
  let travauxRealises = null;

  try {
    if (!id || !type) {
      throw new Error('ID ou type manquant');
    }

    if (type === 'intervention') {
      systeme = await getSystemeForIntervention(parseInt(id));
      garantieStatus = await getGarantieStatus(systeme.id);

      const intervention = await prisma.intervention.findUnique({
        where: { id: parseInt(id) },
        include: {
          DemandeIntervention: {
            include: {
              Client: { select: { nom: true } },
              Site: { select: { nom: true } },
            },
          },
        },
      });

      if (intervention) {
        clientName = getClientName(intervention);
        siteName = intervention.DemandeIntervention?.Site?.nom || null;
        date = formatDate(intervention.dateIntervention);
        description = getDescription(intervention);
        statut = await getStatut(id, 'intervention');
        dateDeclarationPanne = formatDate(intervention.DemandeIntervention?.dateDeclaration);
        diagnostic = intervention.DemandeIntervention?.diagnostic || null;
        travauxRealises = intervention.DemandeIntervention?.travauxRealises || null;
      } else {
        throw new Error('Intervention non trouvée');
      }
    } else if (type === 'maintenance') {
      systeme = await getSystemeForMaintenance(parseInt(id));
      garantieStatus = await getGarantieStatus(systeme.id);

      const maintenance = await prisma.maintenance.findUnique({
        where: { id: parseInt(id) },
        include: {
          Installation: {
            include: {
              Client: { select: { nom: true } },
              Site: { select: { nom: true } },
            },
          },
        },
      });

      if (maintenance) {
        clientName = getClientName(maintenance);
        siteName = maintenance.Installation?.Site?.nom || null;
        date = formatDate(maintenance.dateMaintenance);
        description = getDescription(maintenance);
        statut = await getStatut(id, 'maintenance');
        dateDeclarationPanne = formatDate(maintenance.Installation?.dateDeclaration);
        diagnostic = maintenance.Installation?.diagnostic || null;
        travauxRealises = maintenance.Installation?.travauxRealises || null;
      } else {
        throw new Error('Maintenance non trouvée');
      }
    } else {
      throw new Error('Type invalide');
    }

    return { clientName, siteName, systeme, date, description, statut, garantieStatus, dateDeclarationPanne, diagnostic, travauxRealises };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails :', error);
    throw new Error('Erreur lors de la récupération des détails');
  }
}

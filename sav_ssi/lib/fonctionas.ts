"use server";

import prisma from '@/lib/prisma';

export async function fetchDetails(id, type) {
  if (!id || !type) {
    throw new Error('ID ');
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
              Systeme: { select: { nom: true } },
            },
          },
          Technicien: {
            select: {
              prenom: true,
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
        datePlanifiee: maintenance.datePlanifiee,
        systeme: maintenance.Installation?.Systeme?.nom || null,
        description: maintenance.description,
        idInstallation: maintenance?.idInstallation,
        technicienName: maintenance.Technicien?.prenom || null,
      };
    } else {
      throw new Error('Type invalide');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails :', error);
    throw new Error('Erreur lors de la récupération des détails');
  }
}


export async function fetchCurrentAction(systemId) {
  if (!systemId) {
    throw new Error('ID du système manquant');
  }

  try {
    const parsedId = parseInt(systemId);

    const actions = await prisma.actionMaintenance.findMany({
      where: { idSysteme: parsedId },
    });

    return actions.map(action => ({
      action_id: action.id,
      libeleAction: action.libeleAction,
      statut: false,
      observation: '',
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des actions :', error);
    throw new Error('Erreur lors de la récupération des actions');
  }
}

export async function updateMaintenanceActions(maintenanceId: string, actions: any[]) {
  if (!maintenanceId || !actions) {
    throw new Error('Données manquantes pour la mise à jour');
  }

  try {
    const parsedId = parseInt(maintenanceId);

    const updatePromises = actions.map(action => 
      prisma.maintenanceAction.update({
        where: {
          id: action.action_id
        },
        data: {
          statut: action.statut,
          observation: action.observation
        }
      })
    );

    await Promise.all(updatePromises);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des actions :', error);
    throw new Error('Erreur lors de la mise à jour des actions');
  }
}

export async function fetchMaintenanceActions(idMaintenance) {
  if (!idMaintenance) {
    throw new Error('ID de maintenance manquant');
  }

  try {
    const parsedId = parseInt(idMaintenance);

    const maintenanceActions = await prisma.maintenanceAction.findMany({
      where: { idMaintenance: parsedId },
      include: {
        Action: {
          select: {
            libeleAction: true,
          },
        },
      },
    });

    return maintenanceActions.map(action => ({
      action_id: action.id,
      libeleAction: action.Action.libeleAction,
      statut: action.statut,
      observation: action.observation,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des actions de maintenance :', error);
    throw new Error('Erreur lors de la récupération des actions de maintenance');
  }
}
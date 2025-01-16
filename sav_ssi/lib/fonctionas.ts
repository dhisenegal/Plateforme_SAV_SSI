"use server";

import prisma from '@/lib/prisma';

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
        sousGarantie: intervention.sousGarantie,
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

export async function updateMaintenanceActions(maintenanceId: string, actions: any[]) {
  if (!maintenanceId || !actions) {
    throw new Error('Données manquantes pour la mise à jour');
  }

  try {
    const parsedId = parseInt(maintenanceId);

    // Récupérer d'abord toutes les actions existantes pour cette maintenance
    const existingActions = await prisma.maintenanceAction.findMany({
      where: { 
        idMaintenance: parsedId 
      },
      orderBy: {
        id: 'asc'
      }
    });

    // Grouper les actions existantes par idAction pour trouver les doublons
    const actionsByIdAction = existingActions.reduce((acc, action) => {
      if (!acc[action.idAction]) {
        acc[action.idAction] = [];
      }
      acc[action.idAction].push(action);
      return acc;
    }, {});

    // Utiliser une transaction pour s'assurer que toutes les opérations sont atomiques
    await prisma.$transaction(async (tx) => {
      // 1. Supprimer les doublons si ils existent
      for (const idAction in actionsByIdAction) {
        const actionsForId = actionsByIdAction[idAction];
        if (actionsForId.length > 1) {
          // Garder la première action et supprimer les autres
          const [keepAction, ...duplicatesToDelete] = actionsForId;
          await tx.maintenanceAction.deleteMany({
            where: {
              id: {
                in: duplicatesToDelete.map(a => a.id)
              }
            }
          });
        }
      }

      // 2. Mettre à jour les actions restantes
      const updatePromises = actions.map(action => {
        const existingAction = existingActions.find(ea => 
          ea.idAction === action.idAction && 
          ea.idMaintenance === parsedId
        );

        if (existingAction) {
          return tx.maintenanceAction.update({
            where: {
              id: existingAction.id
            },
            data: {
              statut: action.statut,
              observation: action.observation
            }
          });
        }
        return null;
      });

      await Promise.all(updatePromises.filter(p => p !== null));
    });

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

    // Get all actions with duplicates
    const allActions = await prisma.maintenanceAction.findMany({
      where: { 
        idMaintenance: parsedId 
      },
      include: {
        Action: {
          select: {
            libeleAction: true,
            id: true
          },
        },
      },
      orderBy: {
        id: 'desc' // Most recent first
      }
    });

    // Group by idAction to find duplicates
    const actionsByIdAction = allActions.reduce((acc, action) => {
      if (!acc[action.idAction]) {
        acc[action.idAction] = [];
      }
      acc[action.idAction].push(action);
      return acc;
    }, {});

    // Delete older duplicates and keep most recent
    await prisma.$transaction(async (tx) => {
      for (const idAction in actionsByIdAction) {
        const actions = actionsByIdAction[idAction];
        if (actions.length > 1) {
          const [keep, ...duplicates] = actions; // Keep most recent (first due to desc order)
          await tx.maintenanceAction.deleteMany({
            where: {
              id: {
                in: duplicates.map(d => d.id)
              }
            }
          });
        }
      }
    });

    // Return latest actions only
    return Object.values(actionsByIdAction).map(actions => {
      const latest = actions[0]; // Most recent action
      return {
        action_id: latest.id,
        libeleAction: latest.Action.libeleAction,
        statut: latest.statut,
        observation: latest.observation,
        idAction: latest.idAction
      };
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des actions:', error);
    throw new Error('Erreur lors de la récupération des actions');
  }
}
'use server';

import prisma from "@/lib/prisma";

import {
  getPlanning,
  formatDate,
  getClientName,
  getType,
  getDateMaintenanceOrIntervention
} from '@/actions/technicien/planning';

export const getNextInterventionsAndMaintenances = async (technicienId: number) => {
  try {
    // Récupération des données du planning depuis la base de données
    const planning = await getPlanning();

    // Filtrer les plans pour le technicien spécifique et trier par date
    const upcomingPlans = planning
      .filter(plan => plan.technicienId && plan.technicienId === technicienId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.dateDeclaration).getTime())
      .slice(0, 3); // Prendre les trois premiers

    // Ajouter les informations dynamiques pour chaque élément du planning
    const planningWithDetails = await Promise.all(
      upcomingPlans.map(async (plan) => {
        const clientName = await getClientName(plan); // Récupération du nom du client
        const type = await getType(plan); // Récupération du type (intervention ou maintenance)
        const date = await getDateMaintenanceOrIntervention(plan.id, type.toLowerCase()); // Récupération de la date
        const formattedDate = await formatDate(date); // Formater la date
        return { ...plan, client: clientName, date: formattedDate, type };
      })
    );

    return planningWithDetails;
  } catch (error) {
    console.error("Erreur lors de la récupération des prochaines interventions et maintenances :", error);
    return [];
  }
};


export default getNextInterventionsAndMaintenances;
export async function getInterventionsActives(technicienId: number) {
  try {
    const count = await prisma.intervention.count({
      where: {
        idTechnicien: technicienId,
        statut: { in: ["EN_COURS", "PLANIFIE", "SUSPENDU"] },
      },
    });
    console.log("Nombre d'interventions actives:", count);
    return count; // Retourne le nombre total d'interventions actives
  } catch (error) {
    console.log("Erreur lors de la récupération des interventions actives:", error);
    throw error;
  }
}

export async function getMaintenancesActives(technicienId: number) {
  try {
    const count = await prisma.maintenance.count({
      where: {
        idTechnicien: technicienId,
        statut: { in: ["EN_COURS", "PLANIFIE", "SUSPENDU"] },
      },
    });
    console.log("Nombre de maintenances actives:", count);
    return count; // Retourne le nombre total de maintenances actives
  } catch (error) {
    console.log("Erreur lors de la récupération des maintenances actives:", error);
    throw error;
  }
}

export async function getInterventionsHorsDelai(technicienId :number) {
  const now = new Date();
  
  // Get current overdue interventions
  const currentCount = await prisma.intervention.count({
      where: {
          idTechnicien: technicienId,
          AND: [
              {
                  OR: [
                      // Case 1: Intervention has occurred but was done after 48h
                      {
                          dateIntervention: {
                              equals: null
                          },
                          dateDeclaration: {
                              lt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
                          }
                      },
                      // Case 2: No intervention yet and 48h have passed since declaration
                      {
                          dateIntervention: null,
                          dateDeclaration: {
                              lt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
                          }
                      }
                  ]
              },
              {
                  NOT: {
                      statut: "TERMINE"
                  }
              }
          ]
      }
  });
  return currentCount;
}




export async function getInterventionsEtMaintenancesDuMois(technicienId: number) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = await prisma.$queryRaw`
    SELECT m.client, m.typeMaintenance AS type, m.datePlanifiee
    FROM maintenance m
    WHERE m.datePlanifiee BETWEEN ${startOfMonth} AND ${endOfMonth}
    UNION
    SELECT i.prenomContact AS client, 'INTERVENTION' AS type, i.datePlanifiee
    FROM intervention i
    WHERE i.datePlanifiee BETWEEN ${startOfMonth} AND ${endOfMonth}
  `;

  return result;
}
/*export async function getMaintenanceHorsDelai(technicienId :number) {
  const now = new Date();
  
  // Get current overdue maintenance
  const currentCount = await prisma.maintenance.count({
      where: {
          idTechnicien: technicienId,
          AND: [
              {
                  OR: [
                      // Case 1: Intervention has occurred but was done after 48h
                      {
                          dateMaintenance: {
                              not: undefined
                          },
                          datePlanifiee: {
                              lt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
                          }
                      },
                      // Case 2: No intervention yet and 48h have passed since declaration
                      {
                          dateMaintenance: null,
                          datePlanifiee: {
                              lt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
                          }
                      }
                  ]
              },
              {
                  NOT: {
                      statut: "TERMINE"
                  }
              }
          ]
      }
  });
  return currentCount;
}*/
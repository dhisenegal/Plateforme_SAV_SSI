'use server';

import prisma from "@/lib/prisma";


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

export async function getInterventionsHorsDelai(technicienId: number) {
  const maintenant = new Date();
  const delaiMax = new Date();
  delaiMax.setHours(delaiMax.getHours() - 48); // Retrait de 48h

  const interventionsHorsDelai = await prisma.intervention.findMany({
    where: {
      idTechnicien: technicienId, // Filtre par technicien connecté
      dateDeclaration: {
        not: undefined, // Vérifie que la date planifiée existe
        lte: delaiMax, // Date planifiée est passée de plus de 48h
      },
      statut: {
        not: "TERMINE", // Exclut les interventions terminées
      },
    },
  });
  const nbreInterventionHorsDelai = interventionsHorsDelai.length;
  return nbreInterventionHorsDelai; // Retourne le nombre d'interventions hors délai
}
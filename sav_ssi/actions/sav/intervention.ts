"use server";

import { prisma } from "@/prisma";
import { Intervention } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

// Récupérer toutes les interventions
export const getInterventions = async (
  page: number,
  pageSize: number,
  search: string,
  status?: string,
  technicianId?: string,
  clientId?: string,
  startDate?: string,
  endDate?: string,
  horsDelai?: string
) => {
  const where = {
    AND: [
      { statut: status ? { equals: status } : undefined },
      { idTechnicien: technicianId ? { equals: parseInt(technicianId) } : undefined },
      { idClient: clientId ? { equals: parseInt(clientId) } : undefined },
      { horsDelai: horsDelai === "true" ? true : undefined },
      {
        dateIntervention: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        }
      }
    ]
  };

  const [interventions, total] = await prisma.$transaction([
    prisma.intervention.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        Technicien: true,
        Client: true,
        Site: true,
        Systeme: true
      },
      orderBy: {
        dateIntervention: 'desc'
      }
    }),
    prisma.intervention.count({ where }),
  ]);

  return { interventions, total };
};

// Créer une nouvelle intervention
export const createIntervention = async (data: {
  typePanneDeclare: string;
  dateDeclaration: Date;
  prenomContact: string;
  telephoneContact: string;
  adresse: string;
  numero: number | null;
  statut: string;
  datePlanifiee?: Date;
  idTechnicien?: number;
  idClient: number;
  idSite: number;
  idSysteme: number;
}): Promise<Intervention> => {
  // Construire l'objet de données de base
  const interventionData = {
    typePanneDeclare: data.typePanneDeclare,
    dateDeclaration: data.dateDeclaration,
    prenomContact: data.prenomContact,
    telephoneContact: data.telephoneContact,
    adresse: data.adresse,
    numero: data.numero,
    statut: data.statut || "NON_PLANIFIE",
    datePlanifiee: data.datePlanifiee || null,
    Client: { connect: { id: data.idClient } },
    Site: { connect: { id: data.idSite } },
    Systeme: { connect: { id: data.idSysteme } },
  };

  // Ajouter le technicien seulement s'il est fourni
  if (data.idTechnicien) {
    interventionData["Technicien"] = { connect: { id: data.idTechnicien } };
  }

  return await prisma.intervention.create({
    data: interventionData,
    include: {
      Technicien: true,
      Client: true,
      Site: true,
      Systeme: true
    }
  });
};


export const updateIntervention = async (
  id: number,
  data: Partial<Intervention>
) => {
  return await prisma.intervention.update({
    where: { id },
    data,
    include: {
      Technicien: true,
      Client: true,
      Site: true,
      Systeme: true
    }
  });
};


export const deleteIntervention = async (id: number) => {
  return await prisma.intervention.delete({
    where: { id }
  });
};

export async function getOverdueInterventionsCount() {
  try {
    // Get current overdue interventions
    const interventions = await prisma.intervention.findMany({
      where: {
        AND: [
          {
            dateIntervention: { not: null },
            dateDeclaration: { not: null }
          }
        ]
      }
    });

    // Filtrer les interventions hors délai
    const currentOverdueCount = interventions.filter(isInterventionOverdue).length;

    // Calculer pour le mois dernier
    const lastMonth = {
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1))
    };

    const lastMonthInterventions = await prisma.intervention.findMany({
      where: {
        AND: [
          {
            dateIntervention: { not: null },
            dateDeclaration: {
              gte: lastMonth.start,
              lte: lastMonth.end
            }
          }
        ]
      }
    });

    const lastMonthOverdueCount = lastMonthInterventions.filter(isInterventionOverdue).length;

    // Calculer le pourcentage de changement
    const percentageChange = lastMonthOverdueCount > 0
      ? ((currentOverdueCount - lastMonthOverdueCount) / lastMonthOverdueCount) * 100
      : 0;

    return {
      count: currentOverdueCount,
      percentageChange: Number(percentageChange.toFixed(1))
    };
  } catch (error) {
    console.error("Error counting overdue interventions:", error);
    throw new Error("Failed to count overdue interventions");
  }
}

// Fonction pour mettre à jour le commentaire (justification) d'une intervention
export async function updateInterventionComment(id: number, comment: string) {
  try {
    const updatedIntervention = await prisma.intervention.update({
      where: { id },
      data: {
        commentaire: comment,
      },
    });
    return updatedIntervention;
  } catch (error) {
    console.error("Error updating intervention comment:", error);
    throw new Error("Failed to update intervention comment");
  }
}
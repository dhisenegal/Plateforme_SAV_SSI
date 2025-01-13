"use server";

import { prisma } from "@/prisma";
import { Intervention } from "@prisma/client";

// Récupérer toutes les interventions
export const getInterventions = async (
  page: number,
  pageSize: number,
  search: string,
  status?: string,
  technicianId?: string,
  clientId?: string,
  startDate?: string,
  endDate?: string
) => {
  const where = {
    AND: [
      
      { statut: status ? { equals: status } : undefined },
      { idTechnicien: technicianId ? { equals: parseInt(technicianId) } : undefined },
      { idClient: clientId ? { equals: parseInt(clientId) } : undefined },
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
    prisma.intervention.count(),
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
    statut: data.statut || "NON PLANIFIE",
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
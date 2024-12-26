"use server";

import { prisma } from "@/prisma";
import { Intervention, DemandeIntervention } from "@prisma/client";

// Récupérer toutes les demandes d'intervention
export const getAllDemandesIntervention = async (): Promise<DemandeIntervention[]> => {
  return await prisma.demandeIntervention.findMany();
};

// Créer une nouvelle demande d'intervention
export const createDemandeIntervention = async (data: {
  typePanneDeclare: string;
  dateDeclaration: Date;
  idClient: number;
  idSite: number;
  idInstallation: number;
}): Promise<DemandeIntervention> => {
  return await prisma.demandeIntervention.create({
    data,
  });
};

// Récupérer les installations par site
export const getInstallationsBySite = async (siteId: number) => {
  return await prisma.installation.findMany({
    where: { idSite: siteId },
    include: {
      Systeme: true,
    },
  });
};

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
      {
        OR: [
          { diagnostics: { contains: search } },
          { travauxRealises: { contains: search } },
          { numero: { equals: !isNaN(parseInt(search)) ? parseInt(search) : undefined } }
        ]
      },
      { statut: status ? { equals: status } : undefined },
      { idTechnicien: technicianId ? { equals: parseInt(technicianId) } : undefined },
      {
        DemandeIntervention: {
          idClient: clientId ? { equals: parseInt(clientId) } : undefined,
        }
      },
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
        Contact: {
          include: {
            Utilisateur: true
          }
        },
        DemandeIntervention: {
          include: {
            Client: true,
            Site: true
          }
        }
      },
      orderBy: {
        dateIntervention: 'desc'
      }
    }),
    prisma.intervention.count({ where })
  ]);

  return { interventions, total };
};

export const getInterventionById = async (id: number) => {
  return await prisma.intervention.findUnique({
    where: { id },
    include: {
      Technicien: true,
      Contact: {
        include: {
          Utilisateur: true
        }
      },
      DemandeIntervention: {
        include: {
          Client: true,
          Site: true,
          Installation: {
            include: {
              Systeme: true
            }
          }
        }
      }
    }
  });
};

export const createIntervention = async (data: {
  diagnostics: string;
  travauxRealises: string;
  pieceFournies: string;
  dateIntervention: Date;
  dureeHeure: number;
  numero: number;
  ficheInt: string;
  idTechnicien: number;
  idContact: number;
  idDemandeIntervention: number;
}) => {
  return await prisma.intervention.create({
    data: {
      ...data,
      statut: 'PROGRAMME'
    },
    include: {
      Technicien: true,
      Contact: {
        include: {
          Utilisateur: true
        }
      },
      DemandeIntervention: {
        include: {
          Client: true,
          Site: true
        }
      }
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
      Contact: {
        include: {
          Utilisateur: true
        }
      },
      DemandeIntervention: {
        include: {
          Client: true,
          Site: true
        }
      }
    }
  });
};

export const deleteIntervention = async (id: number) => {
  return await prisma.intervention.delete({
    where: { id }
  });
};
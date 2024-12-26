"use server";

import { prisma } from "@/prisma";
import { Contrat, Client, Site } from "@prisma/client";

// Récupérer tous les contrats avec pagination
export const getAllContrats = async (page: number, pageSize: number): Promise<{ contrats: Contrat[], total: number }> => {
  const [contrats, total] = await prisma.$transaction([
    prisma.contrat.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        Site: {
          include: {
            Client: true,
          },
        },
      },
    }),
    prisma.contrat.count(),
  ]);

  return { contrats, total };
};

// Récupérer tous les clients
export const getAllClients = async (): Promise<Client[]> => {
  return await prisma.client.findMany();
};

// Récupérer les sites par client ID
export const getSitesByClientId = async (clientId: number): Promise<Site[]> => {
  return await prisma.site.findMany({
    where: { idClient: clientId },
  });
};

// Créer un nouveau contrat
export const createContrat = async (data: {
  nom: string;
  dateDebut: Date;
  dateFin: Date | null;
  periodicite: string;
  typeContrat: string;
  pieceMainDoeuvre: boolean;
  idSite: number;
}): Promise<Contrat> => {
  try {
    return await prisma.contrat.create({
      data,
      include: {
        Site: {
          include: {
            Client: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("Erreur lors de la création du contrat:", error);
    throw new Error("Erreur lors de la création du contrat");
  }
};

// Mettre à jour un contrat
export const updateContrat = async (id: number, data: {
  nom?: string;
  dateDebut?: Date;
  dateFin?: Date | null;
  periodicite?: string;
  typeContrat?: string;
  pieceMainDoeuvre?: boolean;
  idSite?: number;
}): Promise<Contrat> => {
  try {
    return await prisma.contrat.update({
      where: { id },
      data,
      include: {
        Site: {
          include: {
            Client: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contrat:", error);
    throw new Error("Erreur lors de la mise à jour du contrat");
  }
};

// Supprimer un contrat
export const deleteContrat = async (id: number): Promise<Contrat> => {
  try {
    return await prisma.contrat.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du contrat:", error);
    throw new Error("Erreur lors de la suppression du contrat");
  }
};
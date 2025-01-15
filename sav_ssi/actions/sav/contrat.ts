"use server";

import { prisma } from "@/prisma";
import { Contrat, Client, Site } from "@prisma/client";

// Récupérer tous les contrats avec pagination
export const getAllContrats = async (
  page: number, 
  pageSize: number,
  whereClause: Record<string> = {}
): Promise<{ contrats: Contrat[], total: number }> => {
  const [contrats, total] = await prisma.$transaction([
    prisma.contrat.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: whereClause,
      include: {
        Site: {
          include: {
            Client: true,
          },
        },
      },
    }),
    prisma.contrat.count({
      where: whereClause
    }),
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

export const renewContrat = async (
  id: number,
  data: {
    nom: string;
    periodicite: string;
    typeContrat: string;
    pieceMainDoeuvre: boolean;
    nombreAnnees: number;
  }
): Promise<Contrat> => {
  if (!id || !data) {
    throw new Error("Données de renouvellement invalides");
  }

  try {
    // Récupérer le contrat existant
    const existingContract = await prisma.contrat.findUnique({
      where: { id },
    });

    if (!existingContract) {
      throw new Error("Contrat non trouvé");
    }

    // Calculer les nouvelles dates
    const dateDebut = new Date();
    const dateFin = new Date();
    dateFin.setFullYear(dateFin.getFullYear() + data.nombreAnnees);

    // Mettre à jour le contrat
    return await prisma.contrat.update({
      where: { id },
      data: {
        nom: data.nom,
        dateDebut,
        dateFin,
        periodicite: data.periodicite,
        typeContrat: data.typeContrat,
        pieceMainDoeuvre: data.pieceMainDoeuvre
      },
      include: {
        Site: {
          include: {
            Client: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors du renouvellement du contrat:", error);
    throw new Error("Erreur lors du renouvellement du contrat");
  }
};
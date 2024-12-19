"use server";

import { prisma } from "@/prisma";
import { Contrat, Client, Site } from "@prisma/client";

// Récupérer tous les contrats
export const getAllContrats = async (): Promise<Contrat[]> => {
  return await prisma.contrat.findMany({
    include: {
      Site: {
        include: {
          Client: true,
        },
      },
    },
  });
};

// Récupérer un contrat par ID
export const getContratById = async (id: number): Promise<Contrat | null> => {
  return await prisma.contrat.findUnique({
    where: { id },
    include: {
      Site: {
        include: {
          Client: true,
        },
      },
    },
  });
};

// Créer un contrat
export const createContrat = async (data: {
  nom: string;
  dateDebut: Date;
  dateFin: Date | null;
  periodicite: string;
  typeContrat: string;
  termeContrat: string;
  idSite: number;
}): Promise<Contrat> => {
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
};

// Mettre à jour un contrat
export const updateContrat = async (id: number, data: {
  nom?: string;
  dateDebut?: Date;
  dateFin?: Date | null;
  periodicite?: string;
  typeContrat?: string;
  termeContrat?: string;
  idSite?: number;
}): Promise<Contrat> => {
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
};

// Supprimer un contrat
export const deleteContrat = async (id: number): Promise<Contrat> => {
  return await prisma.contrat.delete({
    where: { id },
  });
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
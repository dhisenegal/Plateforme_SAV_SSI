"use server";

import { prisma } from "@/prisma";
import { Client, Contrat, Site } from "@prisma/client";

// Récupérer tous les clients
export const getAllClients = async (): Promise<Client[]> => {
  return await prisma.client.findMany();
};

// Récupérer tous les contrats
export const getAllContrats = async (): Promise<Contrat[]> => {
  return await prisma.contrat.findMany();
};

// Récupérer tous les sites
export const getAllSites = async (): Promise<Site[]> => {
  return await prisma.site.findMany({
    include: {
      Client: true,
      Contrats: true,
    },
  });
};

// Créer un nouveau site
export const createSite = async (data: {
  nom: string;
  adresse: string;
  idClient: number;
}): Promise<Site> => {
  return await prisma.site.create({
    data,
    include: {
      Client: true,
      Contrats: true,
    },
  });
};

// Mettre à jour un site
export const updateSite = async (id: number, data: {
  nom?: string;
  adresse?: string;
  idClient?: number;
}): Promise<Site> => {
  return await prisma.site.update({
    where: { id },
    data: {
      nom: data.nom,
      adresse: data.adresse,
      Client: data.idClient ? { connect: { id: data.idClient } } : undefined,
    },
    include: {
      Client: true,
      Contrats: true,
    },
  });
};

// Supprimer un site
export const deleteSite = async (id: number): Promise<Site> => {
  return await prisma.site.delete({
    where: { id },
  });
};
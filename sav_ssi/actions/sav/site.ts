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

// Récupérer tous les sites avec pagination
export const getAllSites = async (page: number, pageSize: number): Promise<{ sites: Site[], total: number }> => {
  const [sites, total] = await prisma.$transaction([
    prisma.site.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        Client: true,
        Contrats: true,
      },
    }),
    prisma.site.count(),
  ]);

  return { sites, total };
};

// Récupérer les détails d'un site
export const getSiteDetails = async (siteId: number): Promise<Site | null> => {
  return await prisma.site.findUnique({
    where: { id: siteId },
    select: {
      nom: true,
      adresse: true,
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
// Récupérer les installations par site
export const getInstallationsBySite = async (siteId: number) => {
  return await prisma.installation.findMany({
    where: { idSite: siteId },
  });
};

// Récupérer les sites par client
export const getSitesByClient = async (clientId: number) => {
  return await prisma.site.findMany({
    where: { idClient: clientId },
  });
};
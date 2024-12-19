"use server";

import { prisma } from "@/prisma";
import { Equipement, InstallationEquipement } from "@prisma/client";

// Récupérer tous les équipements
export const getAllEquipements = async (): Promise<Equipement[]> => {
  return await prisma.equipement.findMany();
};

// Récupérer les équipements associés à un site spécifique
export const getEquipementsBySiteId = async (siteId: number): Promise<InstallationEquipement[]> => {
  return await prisma.installationEquipement.findMany({
    where: {
      Installation: {
        idSite: siteId,
      },
    },
    include: {
      Equipement: true,
      Installation: true,
    },
  });
};

// Créer une nouvelle installation d'équipement
export const createInstallationEquipement = async (data: {
  idEquipement: number;
  quantite: number;
  dateInstallation: string; // Utiliser string pour la date
  idSite: number;
  observations: string;
}): Promise<InstallationEquipement> => {
  // Récupérer l'ID du client et l'ID du système associés au site
  const site = await prisma.site.findUnique({
    where: { id: data.idSite },
    include: {
      Client: true,
      Systeme: true,
    },
  });

  if (!site) {
    throw new Error(`Le site avec l'ID "${data.idSite}" n'existe pas.`);
  }

  const idClient = site.Client.id;
  const idSysteme = site.Systeme.id;

  const installation = await prisma.installation.create({
    data: {
      observations: data.observations,
      dateInstallation: new Date(data.dateInstallation), // Convertir en Date
      idSite: data.idSite,
      idClient: idClient, // Utiliser l'ID du client récupéré
      idSysteme: idSysteme, // Utiliser l'ID du système récupéré
    },
  });

  return await prisma.installationEquipement.create({
    data: {
      idEquipement: data.idEquipement,
      quantite: data.quantite,
      dateInstallation: new Date(data.dateInstallation), // Convertir en Date
      idInstallation: installation.id,
      statut: 'ok'
    },
    include: {
      Equipement: true,
      Installation: true,
    },
  });
};

// Mettre à jour une installation d'équipement
export const updateInstallationEquipement = async (id: number, data: {
  idEquipement?: number;
  quantite?: number;
  dateInstallation?: string; // Utiliser string pour la date
  observations?: string;
}): Promise<InstallationEquipement> => {
  return await prisma.installationEquipement.update({
    where: { id },
    data: {
      ...data,
      dateInstallation: data.dateInstallation ? new Date(data.dateInstallation) : undefined, // Convertir en Date si fourni
    },
    include: {
      Equipement: true,
      Installation: true,
    },
  });
};

// Supprimer une installation d'équipement
export const deleteInstallationEquipement = async (id: number): Promise<InstallationEquipement> => {
  return await prisma.installationEquipement.delete({
    where: { id },
  });
};
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
  dateInstallation: string;
  idSite: number;
  idSysteme: number;
  observations: string;
}): Promise<InstallationEquipement> => {
  try {
    // Vérifier si le site existe
    const site = await prisma.site.findUnique({
      where: { id: data.idSite },
      include: { Client: true }
    });
    
    if (!site) throw new Error("Site non trouvé");
    
    // Vérifier si une installation existe déjà pour ce site et ce système
    let installation = await prisma.installation.findFirst({
      where: {
        idSite: data.idSite,
        idSysteme: data.idSysteme
      }
    });
    
    // Si pas d'installation, en créer une nouvelle
    if (!installation) {
      installation = await prisma.installation.create({
        data: {
          observations: data.observations,
          dateInstallation: new Date(data.dateInstallation),
          idSite: data.idSite,
          idClient: site.Client.id,
          idSysteme: data.idSysteme
        }
      });
    }
    
    // Créer l'équipement d'installation
    const installationEquipement = await prisma.installationEquipement.create({
      data: {
        idEquipement: data.idEquipement,
        quantite: data.quantite,
        dateInstallation: new Date(data.dateInstallation),
        idInstallation: installation.id,
        statut: 'ok'
      },
      include: {
        Equipement: true,
        Installation: true
      }
    });
    
    return installationEquipement;
  } catch (error) {
    console.error("Erreur création installation équipement:", error);
    throw error;
  }
};
// Mettre à jour une installation d'équipement
export const updateInstallationEquipement = async (id: number, data: {
  idEquipement?: number;
  quantite?: number;
  dateInstallation?: string;
  observations?: string;
}): Promise<InstallationEquipement> => {
  try {
    return await prisma.installationEquipement.update({
      where: { id },
      data: {
        idEquipement: data.idEquipement,
        quantite: data.quantite,
        dateInstallation: data.dateInstallation ? new Date(data.dateInstallation) : undefined,
        Installation: data.observations ? {
          update: {
            observations: data.observations
          }
        } : undefined
      },
      include: {
        Equipement: true,
        Installation: true,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'installation équipement:", error);
    throw error;
  }
};

// Supprimer une installation d'équipement
export const deleteInstallationEquipement = async (id: number): Promise<InstallationEquipement> => {
  return await prisma.installationEquipement.delete({
    where: { id },
  });
};
"use server";

import { prisma } from "@/prisma";
import { Equipement, InstallationEquipement, EnumStatut_Statut_Equipement } from "@prisma/client";

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

// Créer une nouvelle installation d'équipement avec garantie
// Interface pour les données d'extincteur
interface ExtincteurData {
  dateFabrication: Date;
  datePremierChargement?: Date;
  dateDernierChargement?: Date;
}

// Interface pour les données d'installation
interface InstallationEquipementData {
  idEquipement: number;
  quantite: number;
  dateInstallation: Date;
  idSite: number;
  idSysteme: number;
  observations: string;
  Emplacement?: string;
  HorsService?: boolean;
  Commentaires?: string;
  Numero?: string;
  extincteurData?: ExtincteurData; // Données spécifiques aux extincteurs
}

export const createInstallationEquipement = async (
  data: InstallationEquipementData
): Promise<InstallationEquipement> => {
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

    const installationDate = new Date(data.dateInstallation);
    const garantieEndDate = new Date(installationDate);
    garantieEndDate.setFullYear(garantieEndDate.getFullYear() + 1);
    
    // Créer l'équipement d'installation avec garantie dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Vérifier le type de système
      const systeme = await tx.systeme.findUnique({
        where: { id: data.idSysteme },
      });

      const installationEquipement = await tx.installationEquipement.create({
        data: {
          idEquipement: data.idEquipement,
          Emplacement: data.Emplacement,
          HorsService: data.HorsService,
          Commentaires: data.Commentaires,
          Numero: data.Numero,
          dateInstallation: installationDate,
          idInstallation: installation.id,
          statut: 'OK',
          estGaranti: true,
        },
        include: {
          Equipement: true,
          Installation: true,
          InstallationExtincteur: true
        }
      });

      // Si c'est un système d'extincteurs et qu'on a les données nécessaires
      if (systeme?.nom === "MOYENS DE SECOURS EXTINCTEURS" && data.extincteurData) {
        await tx.installationExtincteur.create({
          data: {
            idInstallationEquipement: installationEquipement.id,
            DateFabrication: data.extincteurData.dateFabrication,
            DatePremierChargement: data.extincteurData.datePremierChargement || data.extincteurData.dateFabrication,
            DateDerniereVerification: data.extincteurData.dateDernierChargement || data.extincteurData.dateFabrication,
          }
        });
      }

      // Créer la garantie
      await tx.garantie.create({
        data: {
          dateDebutGarantie: installationDate,
          dateFinGarantie: garantieEndDate,
          idInstallationEq: installationEquipement.id
        }
      });

      return installationEquipement;
    });
    
    return result;
  } catch (error) {
    console.error("Erreur création installation équipement:", error);
    throw error;
  }
};
// Mettre à jour une installation d'équipement
interface UpdateInstallationEquipementData {
  idEquipement?: number;
  Emplacement?: string;
  HorsService?: boolean;
  Commentaires?: string;
  Numero?: string;
  dateInstallation?: string;
  statut?: string;
  extincteurData?: ExtincteurData;
}

export const updateInstallationEquipement = async (
  id: number, 
  data: UpdateInstallationEquipementData
): Promise<InstallationEquipement> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Récupérer l'installation équipement existante avec son installation
      const existingEquipement = await tx.installationEquipement.findUnique({
        where: { id },
        include: {
          Installation: {
            include: { Systeme: true }
          },
          InstallationExtincteur: true
        }
      });

      if (!existingEquipement) {
        throw new Error("Installation équipement non trouvée");
      }

      // Mettre à jour l'installation équipement
      const updatedEquipement = await tx.installationEquipement.update({
        where: { id },
        data: {
          idEquipement: data.idEquipement,
          Emplacement: data.Emplacement,
          HorsService: data.HorsService,
          Commentaires: data.Commentaires,
          Numero: data.Numero,
          dateInstallation: data.dateInstallation ? new Date(data.dateInstallation) : undefined,
          statut: data.statut as EnumStatut_Statut_Equipement
        },
        include: {
          Equipement: true,
          Installation: true,
          InstallationExtincteur: true
        }
      });

      // Si c'est un système d'extincteurs et qu'on a des données d'extincteur
      if (existingEquipement.Installation.Systeme.nom === "MOYENS DE SECOURS EXTINCTEURS" && data.extincteurData) {
        if (existingEquipement.InstallationExtincteur && existingEquipement.InstallationExtincteur.length > 0) {
          // Mettre à jour l'extincteur existant
          await tx.installationExtincteur.update({
            where: { id: existingEquipement.InstallationExtincteur[0].id },
            data: {
              DateFabrication: data.extincteurData.dateFabrication || undefined,
              DatePremierChargement: data.extincteurData.datePremierChargement || undefined,
              DateDerniereVerification: data.extincteurData.dateDernierChargement || undefined
            }
          });
        } else {
          // Créer un nouvel extincteur si aucun n'existe
          await tx.installationExtincteur.create({
            data: {
              idInstallationEquipement: id,
              DateFabrication: data.extincteurData.dateFabrication,
              DatePremierChargement: data.extincteurData.datePremierChargement || data.extincteurData.dateFabrication,
              DateDerniereVerification: data.extincteurData.dateDernierChargement || data.extincteurData.dateFabrication
            }
          });
        }
      }

      return updatedEquipement;
    });

    return result;
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
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
      Equipement: {
        select: {
          id: true,
          nom: true,
        }
      },
      Installation: true,
    },
  });
};


// Créer une nouvelle installation d'équipement avec garantie
export const createInstallation = async (data: {
  idSysteme: number;
  dateInstallation: string;
  observations?: string;
  siteId: number;
  equipments: Array<{
    idEquipement: number;
    quantite: number;
  }>;
}) => {
  try {
    // Récupérer le client associé au site
    const site = await prisma.site.findUnique({
      where: { id: data.siteId },
      include: { Client: true }
    });

    if (!site) throw new Error("Site non trouvé");

    // Créer l'installation
    const installation = await prisma.installation.create({
      data: {
        observations: data.observations,
        dateInstallation: new Date(data.dateInstallation),
        idSite: data.siteId,
        idClient: site.Client.id,
        idSysteme: data.idSysteme
      }
    });

    // Créer les installations d'équipements avec garantie
    const installationEquipments = await Promise.all(
      data.equipments.map(async (equip) => {
        const installationDate = new Date(data.dateInstallation);
        const garantieEndDate = new Date(installationDate);
        garantieEndDate.setFullYear(garantieEndDate.getFullYear() + 1);

        return prisma.$transaction(async (tx) => {
          const installationEquipement = await tx.installationEquipement.create({
            data: {
              idEquipement: equip.idEquipement,
              quantite: equip.quantite,
              dateInstallation: installationDate,
              idInstallation: installation.id,
              statut: 'ok',
              estGaranti: true
            }
          });

          await tx.garantie.create({
            data: {
              dateDebutGarantie: installationDate,
              dateFinGarantie: garantieEndDate,
              idInstallationEq: installationEquipement.id
            }
          });

          return installationEquipement;
        });
      })
    );

    return { installation, installationEquipments };
  } catch (error) {
    console.error("Erreur création installation:", error);
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

export const deleteInstallationEquipement = async (id: number): Promise<void> => {
  try {
    // Get the installation ID before deleting
    const equipmentToDelete = await prisma.installationEquipement.findUnique({
      where: { id },
      select: {
        idInstallation: true
      }
    });

    if (!equipmentToDelete) {
      throw new Error("Équipement non trouvé");
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Delete associated garanties
      await tx.garantie.deleteMany({
        where: { idInstallationEq: id }
      });

      // Delete the installation equipment
      await tx.installationEquipement.delete({
        where: { id }
      });

      // Check if this was the last equipment for this installation
      const remainingEquipments = await tx.installationEquipement.count({
        where: {
          idInstallation: equipmentToDelete.idInstallation
        }
      });

      // If no equipment remains, delete the installation
      if (remainingEquipments === 0) {
        await tx.installation.delete({
          where: {
            id: equipmentToDelete.idInstallation
          }
        });
      }
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};

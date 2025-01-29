"use server";

import { prisma } from "@/prisma";
import { Maintenance } from "@prisma/client";

// Mettre à jour le statut de la maintenance
export const updateMaintenanceStatus = async (id: number, statut: string): Promise<Maintenance> => {
  const maintenance = await prisma.maintenance.update({
    where: { id },
    data: { statut },
  });

  return maintenance;
};

// Mettre à jour une maintenance
export const updateMaintenance = async (id: number, data: {
  numero?: string;
  description?: string;
  dateMaintenance?: Date;
  statut?: string;
  typeMaintenance?: string;
  idTechnicien?: number;
}): Promise<Maintenance> => {
  return await prisma.maintenance.update({
    where: { id },
    data,
  });
};

export const getAllMaintenances = async (
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = '',
  dateDebut?: string,
  dateFin?: string,
  statut?: string
): Promise<{ maintenances: Maintenance[], total: number }> => {
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      {
        OR: [
          { Contact: { Client: { nom: { contains: searchQuery } } } },
          { Site: { nom: { contains: searchQuery } } },
          { Installation: { Systeme: { nom: { contains: searchQuery } } } },
        ]
      },
      ...(dateDebut ? [{
        datePlanifiee: {
          gte: new Date(dateDebut)
        }
      }] : []),
      ...(dateFin ? [{
        datePlanifiee: {
          lte: new Date(dateFin)
        }
      }] : []),
      ...(statut && statut !== 'all' ? [{
        statut: statut
      }] : [])
    ]
  };

  const [total, maintenances] = await Promise.all([
    prisma.maintenance.count({ where }),
    prisma.maintenance.findMany({
      skip,
      take: pageSize,
      where,
      include: {
        Technicien: true,
        Contact: {
          include: {
            Client: true,
          },
        },
        Site: true,
        Installation: {
          include: {
            Systeme: true,
          },
        },
      },
    })
  ]);

  return { maintenances, total };
};

export const getMaintenancesById = async (id: number): Promise<Maintenance> => {
  return await prisma.maintenance.findUnique({
    where: { id },
    include: {
      Technicien: true,
      Contact: {
        include: {
          ContactSites: true,
          Client: true,
          Utilisateur: true,
        },
      },
      Installation: {
        include: {
          Systeme: true,
        },
      },
      Site: true,
    },
  });
};

export const planifierMaintenanceGlobal = async (data: {
  numero: string;
  datePlanifiee: string;
  description: string;
  statut: string;
  typeMaintenance: string;
  idClient: number;
  idSite: number;
  idTechnicien: number;
  idContact: number;
  idInstallation: number;
}): Promise<any> => {
  return await prisma.$transaction(async (tx) => {
    // Vérifier l'installation et récupérer le système
    const installation = await tx.installation.findUnique({
      where: { id: data.idInstallation },
      include: {
        Systeme: true,
        EquipementsInstallation: {
          include: {
            InstallationExtincteur: true,
            Equipement: {
              include: {
                Extincteurs: true
              }
            }
          }
        }
      }
    });

    if (!installation) {
      throw new Error("Installation non trouvée");
    }

    // Créer la maintenance
    const maintenance = await tx.maintenance.create({
      data: {
        numero: data.numero,
        datePlanifiee: new Date(data.datePlanifiee),
        description: data.description,
        statut: "PLANIFIE",
        typeMaintenance: data.typeMaintenance,
        idSite: data.idSite,
        idTechnicien: data.idTechnicien,
        idContact: data.idContact,
        idInstallation: data.idInstallation,
      },
    });

    // Si c'est un système d'extincteurs
    if (installation.Systeme.nom === "MOYENS DE SECOURS EXTINCTEURS") {
      // Récupérer les actions spécifiques aux extincteurs
      const actionsExtincteur = await tx.actionMaintenanceExtincteur.findMany();

      // Pour chaque équipement installé
      for (const equipInstalle of installation.EquipementsInstallation) {
        // Vérifier si l'équipement a un extincteur associé
        if (equipInstalle.InstallationExtincteur && equipInstalle.InstallationExtincteur[0]?.id) {
          // Créer les actions de maintenance pour cet extincteur spécifique
          await Promise.all(
            actionsExtincteur.map(action =>
              tx.maintenanceActionExtincteur.create({
                data: {
                  idMaintenance: maintenance.id,
                  idActionMaintenanceExtincteur: action.id,
                  idInstallationExtincteur: equipInstalle.InstallationExtincteur[0].id,
                  statut: false,
                  observation: ""
                }
              })
            )
          );
        }
      }
    } else {
      // Pour les autres systèmes, utiliser le processus standard
      const actions = await tx.actionMaintenance.findMany({
        where: { idSysteme: installation.idSysteme },
      });

      await Promise.all(
        actions.map(action =>
          tx.maintenanceAction.create({
            data: {
              statut: false,
              observation: "",
              idMaintenance: maintenance.id,
              idAction: action.id,
            },
          })
        )
      );
    }

    return maintenance;
  });
};
export const getMaintenancesBySite = async (siteId: number): Promise<Maintenance[]> => {
  const maintenances = await prisma.maintenance.findMany({
    where: { idSite: siteId },
    include: {
      Technicien: true,
      Contact: true,
      Installation: {
        include: {
          Systeme: true,
        },
      },
    },
  });

  return maintenances;
};

export const planifierMaintenance = async (data: {
  numero: string;
  dateMaintenance: string;
  description: string;
  statut: string;
  typeMaintenance: string;
  idSite: number;
  idTechnicien: number;
  idContact: number;
  idInstallation: number;
}): Promise<any> => {
  console.log("Données reçues pour la planification de la maintenance:", JSON.stringify(data, null, 2));

  const site = await prisma.site.findUnique({
    where: { id: data.idSite },
  });
  console.log("Site trouvé:", JSON.stringify(site, null, 2));
  if (!site) {
    throw new Error(`Site with ID ${data.idSite} does not exist.`);
  }

  const technicien = await prisma.utilisateur.findUnique({
    where: { id: data.idTechnicien },
  });
  console.log("Technicien trouvé:", JSON.stringify(technicien, null, 2));
  if (!technicien) {
    throw new Error(`Technicien with ID ${data.idTechnicien} does not exist.`);
  }

  const contact = await prisma.contact.findUnique({
    where: { id: data.idContact },
  });
  console.log("Contact trouvé:", JSON.stringify(contact, null, 2));
  if (!contact) {
    throw new Error(`Contact with ID ${data.idContact} does not exist.`);
  }

  // Vérifier si l'installation existe
  const installation = await prisma.installation.findUnique({
    where: { id: data.idInstallation },
  });
  console.log("Installation trouvée:", JSON.stringify(installation, null, 2));
  if (!installation) {
    throw new Error(`Installation with ID ${data.idInstallation} does not exist.`);
  }

  // Créer la maintenance et les actions associées dans une transaction
  const result = await prisma.$transaction(async (tx) => {
    // Créer la maintenance
    const maintenance = await tx.maintenance.create({
      data: {
        numero: data.numero,
        dateMaintenance: new Date(data.dateMaintenance),
        description: data.description,
        statut: "PLANIFIE",
        typeMaintenance: data.typeMaintenance,
        idSite: data.idSite,
        idTechnicien: data.idTechnicien,
        idContact: data.idContact,
        idInstallation: data.idInstallation,
      },
    });
    console.log("Maintenance créée:", JSON.stringify(maintenance, null, 2));

    // Récupérer les actions de maintenance pour le système associé à l'installation
    const actions = await tx.actionMaintenance.findMany({
      where: { idSysteme: installation.idSysteme },
    });
    console.log("Actions de maintenance trouvées:", JSON.stringify(actions, null, 2));

    // Créer les MaintenanceAction pour chaque action de maintenance
    const maintenanceActions = await Promise.all(
      actions.map((action) =>
        tx.maintenanceAction.create({
          data: {
            statut: false,
            observation: "",
            idMaintenance: maintenance.id,
            idAction: action.id,
          },
        })
      )
    );
    console.log("MaintenanceActions créées:", JSON.stringify(maintenanceActions, null, 2));

    return { maintenance, maintenanceActions };
  });

  return result;
};

// Ajouter un commentaire à une maintenance
export const ajouterCommentaireMaintenance = async (data: {
  idMaintenance: number;
  idUtilisateur: number;
  commentaire: string;
}) => {
  return await prisma.commentaireMaintenance.create({
    data: {
      idMaintenance: data.idMaintenance,
      idUtilisateur: data.idUtilisateur,
      commentaire: data.commentaire,
    },
    include: {
      Utilisateur: true,
    },
  });
};

// Récupérer les commentaires d'une maintenance
export const getCommentairesMaintenance = async (idMaintenance: number) => {
  return await prisma.commentaireMaintenance.findMany({
    where: {
      idMaintenance,
    },
    include: {
      Utilisateur: true,
    },
    orderBy: {
      dateCommentaire: 'desc',
    },
  });
};

export const updateMaintenanceWithComment = async (
  maintenanceId: number,
  data: {
    datePlanifiee: string;
    description: string;
    idTechnicien: number;
    commentaireModification: string;
  }
) => {
  return await prisma.$transaction(async (tx) => {
    // Mettre à jour la maintenance
    const maintenance = await tx.maintenance.update({
      where: { id: maintenanceId },
      data: {
        datePlanifiee: new Date(data.datePlanifiee),
        description: data.description,
        idTechnicien: parseInt(data.idTechnicien.toString())
      }
    });

    // Ajouter le commentaire de modification
    await tx.commentaireMaintenance.create({
      data: {
        idMaintenance: maintenanceId,
        idUtilisateur: data.idUtilisateur,
        commentaire: `[Modification du planning] ${data.commentaireModification}`
      }
    });

    return maintenance;
  });
};
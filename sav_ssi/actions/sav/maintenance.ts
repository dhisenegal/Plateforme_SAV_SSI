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
        dateMaintenance: {
          gte: new Date(dateDebut)
        }
      }] : []),
      ...(dateFin ? [{
        dateMaintenance: {
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
  console.log("Données reçues pour la planification de la maintenance:", JSON.stringify(data, null, 2));

  const client = await prisma.client.findUnique({
    where: { id: data.idClient },
  });

  console.log("Client trouvé:", JSON.stringify(client, null, 2));

  if (!client) {
    throw new Error(`Client with ID ${data.idClient} does not exist.`);
  }

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
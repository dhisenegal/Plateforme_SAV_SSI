"use server";

import { prisma } from "@/prisma";
import { Maintenance } from "@prisma/client";

// Planifier une nouvelle maintenance
export const planifierMaintenance = async (data: {
  numero: string;
  dateMaintenance: string;
  description: string;
  statut: string;
  typeMaintenance: string;
  idSite: number;
  idTechnicien: number;
  idContact: number;
  idInstallation: number; // Ajouter l'ID de l'installation
}): Promise<Maintenance> => {
  console.log("Données reçues pour la planification de la maintenance:", JSON.stringify(data, null, 2));

  // Vérifier si le site existe
  const site = await prisma.site.findUnique({
    where: { id: data.idSite },
  });

  console.log("Site trouvé:", JSON.stringify(site, null, 2));

  if (!site) {
    throw new Error(`Site with ID ${data.idSite} does not exist.`);
  }

  // Vérifier si le technicien existe
  const technicien = await prisma.utilisateur.findUnique({
    where: { id: data.idTechnicien },
  });

  console.log("Technicien trouvé:", JSON.stringify(technicien, null, 2));

  if (!technicien) {
    throw new Error(`Technicien with ID ${data.idTechnicien} does not exist.`);
  }

  // Vérifier si le contact existe
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

  const maintenance = await prisma.maintenance.create({
    data: {
      numero: data.numero,
      dateMaintenance: new Date(data.dateMaintenance),
      description: data.description,
      statut: data.statut,
      typeMaintenance: data.typeMaintenance,
      idSite: data.idSite,
      idTechnicien: data.idTechnicien,
      idContact: data.idContact,
      idInstallation: data.idInstallation, // Inclure l'ID de l'installation
    },
  });

  console.log("Maintenance créée:", JSON.stringify(maintenance, null, 2));

  return maintenance;
};

// Récupérer les maintenances par site
export const getMaintenancesBySite = async (siteId: number): Promise<Maintenance[]> => {
  const maintenances = await prisma.maintenance.findMany({
    where: { idSite: siteId },
    include: {
      Technicien: true,
      Contact: true,
    },
  });

  return maintenances;
};

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


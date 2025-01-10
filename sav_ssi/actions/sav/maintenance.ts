"use server";

import { prisma } from "@/prisma";
import { Maintenance } from "@prisma/client";

// Planifier une nouvelle maintenance avec sa première planification
export const planifierMaintenanceGlobal = async (data: {
  numero: string;
  dateMaintenance: string;
  description: string;
  typeMaintenance: string;
  idClient: number;
  idSite: number;
  idTechnicien: number;
  idContact: number;
  idInstallation: number;
}): Promise<Maintenance> => {
  return await prisma.$transaction(async (prisma) => {
    // Créer la maintenance
    const maintenance = await prisma.maintenance.create({
      data: {
        numero: data.numero,
        description: data.description,
        statut: "PLANIFIE",
        typeMaintenance: data.typeMaintenance,
        idSite: data.idSite,
        idTechnicien: data.idTechnicien,
        idContact: data.idContact,
        idInstallation: data.idInstallation,
      },
    });

    // Créer la planification prévisionnelle initiale
    await prisma.planification.create({
      data: {
        date: new Date(data.dateMaintenance),
        previsionnel: true,
        effectif: false,
        idMaintenance: maintenance.id,
      },
    });

    return maintenance;
  });
};

// Replanifier une maintenance
export const replanifierMaintenance = async (
  maintenanceId: number,
  nouvelleDate: Date
): Promise<Planification> => {
  return await prisma.planification.create({
    data: {
      date: nouvelleDate,
      previsionnel: false,
      effectif: false,
      idMaintenance: maintenanceId,
    },
  });
};

// Marquer une planification comme effectuée
export const marquerMaintenanceEffectuee = async (
  planificationId: number
): Promise<Planification> => {
  return await prisma.planification.update({
    where: { id: planificationId },
    data: { effectif: true },
  });
};

// Obtenir l'historique des planifications d'une maintenance
export const getPlanificationsParMaintenance = async (
  maintenanceId: number
): Promise<Planification[]> => {
  return await prisma.planification.findMany({
    where: { idMaintenance: maintenanceId },
    orderBy: { createdAt: 'desc' },
  });
};

// Obtenir toutes les maintenances avec leur dernière planification
export const getAllMaintenances = async (
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = '',
  dateDebut?: string,
  dateFin?: string,
  statut?: string
): Promise<{ maintenances: any[], total: number }> => {
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
      ...(statut && statut !== 'all' ? [{ statut: statut }] : [])
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
        Planifications: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        Planifications: {
          _count: 'desc'
        }
      }
    })
  ]);

  // Filtrage par date après récupération des données
  const filteredMaintenances = maintenances.filter(maintenance => {
    const lastPlanification = maintenance.Planifications[0];
    if (!lastPlanification) return true;
    
    const planificationDate = new Date(lastPlanification.date);
    const debutDate = dateDebut ? new Date(dateDebut) : null;
    const finDate = dateFin ? new Date(dateFin) : null;

    return (!debutDate || planificationDate >= debutDate) &&
           (!finDate || planificationDate <= finDate);
  });

  return {
    maintenances: filteredMaintenances,
    total: dateDebut || dateFin ? filteredMaintenances.length : total
  };
};


// Mettre à jour le statut de la maintenance
export const updateMaintenanceStatus = async (id: number, statut: string): Promise<Maintenance> => {
  const maintenance = await prisma.maintenance.update({
    where: { id },
    data: { statut },
  });

  return maintenance;
};


// Récupérer les maintenances par site
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
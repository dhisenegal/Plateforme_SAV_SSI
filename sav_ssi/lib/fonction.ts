import prisma from "@/lib/prisma";

/**
 * Récupère les équipements associés à un système.
 * @param systemeId - L'identifiant du système.
 * @returns Une liste d'équipements.
 */

// Récupère le nom et le prénom d'un technicien
export const getTechnicienById = async (roleId) => {
  try {
    const technicien = await prisma.utilisateur.findFirst({
      where: {
        idRole: roleId,
        Role: {
          nom: 'technicien',
        },
      },
      select: {
        nom: true,
        prenom: true,
      },
    });
    return technicien ? `${technicien.prenom} ${technicien.nom}` : 'Technicien inconnu';
  } catch (error) {
    console.error('Erreur lors de la récupération du nom du technicien :', error);
    return 'Erreur';
  }
};

// Récupérer la prochaine intervention
export async function getNextIntervention() {
  return await prisma.intervention.findFirst({
    include: {
      DemandeIntervention: {
        select: {
          statut: true,
          typePanneDeclare: true,
          Client: { select: { nom: true } },
        },
      },
    },
    orderBy: { dateIntervention: "asc" },
  });
}

// Récupérer la prochaine maintenance
export async function getNextMaintenance() {
  return await prisma.maintenance.findFirst({
    include: {
      Installation: {
        select: {
          Client: { select: { nom: true } },
        },
      },
    },
    orderBy: { dateMaintenance: "asc" },
  });
}

// Récupérer toutes les interventions
export async function getAllInterventions() {
  return await prisma.intervention.findMany({
    include: {
      DemandeIntervention: {
        select: { statut: true, Client: { select: { nom: true } } },
      },
    },
  });
}

// Fonction pour récupérer toutes les interventions et maintenances triées par date
export const getPlanning = async () => {
  try {
    const interventions = await prisma.intervention.findMany({
      include: {
        DemandeIntervention: {
          select: {
            statut: true,
            typePanneDeclare: true,
            Client: {
              select: {
                nom: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateIntervention: "asc",
      },
    });

    const maintenances = await prisma.maintenance.findMany({
      include: {
        Installation: {
          select: {
            Client: {
              select: {
                nom: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateMaintenance: "asc",
      },
    });

    const planning = [...interventions, ...maintenances].sort((a, b) => {
      const dateA = new Date(a.dateIntervention || a.dateMaintenance);
      const dateB = new Date(b.dateIntervention || b.dateMaintenance);
      return dateA - dateB;
    });

    const uniquePlanning = [];
    const seen = new Set();

    for (const item of planning) {
      const identifier = `${item.id}-${item.dateIntervention || item.dateMaintenance}`;
      if (!seen.has(identifier)) {
        seen.add(identifier);
        uniquePlanning.push(item);
      }
    }

    return uniquePlanning;
  } catch (error) {
    console.error("Erreur lors de la récupération des données de planning :", error);
    throw error;
  }
};

// Fonction pour formater la date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Fonction pour récupérer le client
export const getClientName = (item) => {
  return item.DemandeIntervention
    ? item.DemandeIntervention.Client.nom
    : item.Installation?.Client.nom || "N/A";
};

// Fonction pour récupérer la description
export const getDescription = (item) => {
  if (item.DemandeIntervention) {
    // Cas d'une intervention
    return item.DemandeIntervention.typePanneDeclare;
  } else if (item.description) {
    // Cas d'une maintenance
    return item.description;
  } else {
    // Cas où aucune description n'est trouvée
    return 'Description non disponible';
  }
};

// Fonction pour déterminer le type (intervention ou maintenance)
export const getType = (item) => {
  return item.DemandeIntervention ? "Intervention" : "Maintenance";
};

// Fonction pour récupérer le statut d'une intervention ou d'une maintenance
export const getStatut = async (id, type) => {
  try {
    if (type === 'intervention') {
      const intervention = await prisma.intervention.findUnique({
        where: { id: parseInt(id) },
        include: {
          DemandeIntervention: {
            select: {
              statut: true, // Sélectionne le statut de la demande d'intervention
            },
          },
        },
      });

      if (intervention && intervention.DemandeIntervention) {
        return intervention.DemandeIntervention.statut || 'Statut non défini';
      } else {
        throw new Error('Intervention ou statut non trouvé');
      }
    } else if (type === 'maintenance') {
      const maintenance = await prisma.maintenance.findUnique({
        where: { id: parseInt(id) },
        select: {
          statut: true, // Sélectionne le statut de la maintenance
        },
      });

      if (maintenance) {
        return maintenance.statut || 'Statut non défini';
      } else {
        throw new Error('Maintenance ou statut non trouvé');
      }
    } else {
      throw new Error('Type invalide');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du statut :', error);
    return 'Erreur lors de la récupération du statut';
  }
};

export const getSystemeForIntervention = async (idIntervention) => {
  try {
    const intervention = await prisma.intervention.findUnique({
      where: { id: idIntervention },
      include: {
        DemandeIntervention: {
          include: {
            Installation: {
              select: {
                Systeme: { select: { nom: true } }, // Remplacez `nom` par les colonnes nécessaires
              },
            },
          },
        },
      },
    });
    return (
      intervention?.DemandeIntervention?.Installation?.Systeme?.nom ||
      "Système inconnu"
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du système pour l'intervention :", error);
    return "Erreur";
  }
};

export const getSystemeForMaintenance = async (idMaintenance) => {
  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: idMaintenance },
      include: {
        Installation: {
          select: {
            Systeme: { select: { nom: true } }, // Remplacez `nom` par les colonnes nécessaires
          },
        },
      },
    });
    return maintenance?.Installation?.Systeme?.nom || "Système inconnu";
  } catch (error) {
    console.error("Erreur lors de la récupération du système pour la maintenance :", error);
    return "Erreur";
  }
};

export async function getEquipementForSysteme(systemeId: number) {
  try {
    const equipements = await prisma.equipement.findMany({
      where: { systemeId },
    });
    return equipements;
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements :', error);
    throw new Error('Impossible de récupérer les équipements');
  }
}

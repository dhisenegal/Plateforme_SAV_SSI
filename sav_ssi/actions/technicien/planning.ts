'use server';

import prisma from "@/lib/prisma";




// Fonction pour mettre à jour le statut de l'intervention
export const updateInterventionStatus = async (id: number, statut: string) => {
  try {
    const result = await prisma.intervention.update({
      where: { id: id },
      data: {
        statut: statut,
      },
    });
    return result;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de l\'intervention :', error);
    throw new Error('Erreur lors de la mise à jour du statut de l\'intervention');
  }
};
// Fonction pour mettre à jour une intervention
export const updateIntervention = async (id: number, diagnostics: string, travauxRealises: string) => {
  try {
    const result = await prisma.intervention.update({
      where: { id: id },
      data: {
        diagnostics: diagnostics,
        travauxRealises: travauxRealises,
      },
    });
    return result;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'intervention :', error);
    throw new Error('Erreur lors de la mise à jour de l\'intervention');
  }
};

export const getSiteByInstallation = async (installationId: number) => {
    try {
      const installation = await prisma.installation.findUnique({
        where: {
          id: installationId,
        },
        include: {
          Site: { // Inclut le site associé à l'installation
            select: {
              id: true,
              nom: true, // Assurez-vous que le champ 'nom' est correct dans la table 'Site'
              adresse: true, // Ajoutez d'autres champs si nécessaire
            },
          },
        },
      });
      if (installation && installation.Site) {
        return installation.Site;
      } else {
        return 'Site non trouvé pour cette installation';
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du site :', error);
      return 'Erreur lors de la récupération du site';
    }
  };  

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
  export const formatDate = async (date) => {
    // Simuler un délai (par exemple pour un appel API ou un traitement externe)
    await new Promise((resolve) => setTimeout(resolve, 10)); // 10 ms de délai pour simuler une action asynchrone
  
    // Formater la date
    return new Date(date).toLocaleDateString("fr", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  
  
  // Fonction pour récupérer le client
  export const getClientName = async (item) => {
    // Simuler un délai asynchrone (par exemple, un appel API)
    await new Promise((resolve) => setTimeout(resolve, 10)); // Attente de 10 ms pour simuler un traitement
  
    return item.DemandeIntervention
      ? item.DemandeIntervention.Client.nom
      : item.Installation?.Client.nom || "N/A";
  };
  
  // Fonction pour récupérer la description
  export const getDescription = async (item) => {
    // Simuler un délai asynchrone (par exemple, un appel API)
    await new Promise((resolve) => setTimeout(resolve, 10)); // Attente de 10 ms pour simuler un traitement
  
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
  export const getType = async (item) => {
    // Simuler un délai asynchrone si nécessaire
    await new Promise((resolve) => setTimeout(resolve, 10)); // Attente de 100 ms pour simuler un traitement
  
    return item.DemandeIntervention ? "Intervention" : "Maintenance";
  };
  
  
  // Fonction pour récupérer le statut d'une intervention ou d'une maintenance
  export const getStatut = async (id, type) => {
    try {
      if (type === 'intervention') {
        const intervention = await prisma.intervention.findUnique({
          where: { id: parseInt(id) },
          select: {
            statut: true, // Sélectionne directement le statut de l'intervention
          },
        });
  
        if (intervention) {
          return intervention.statut || 'Statut non défini';
        } else {
          throw new Error('Intervention non trouvée');
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
          throw new Error('Maintenance non trouvée');
        }
      } else {
        throw new Error('Type invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du statut :', error);
      return 'Erreur lors de la récupération du statut';
    }
  };
  
  //Fonction pour récupérer le système pour une intervention donnée
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
  
  // Fonction pour récupérer les équipements pour une maintenance donnée
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
  
  // Fonction pour récupérer les équipements pour un système donné
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
  // Fonction pour récupérer la date d'une maintenance ou d'une intervention
export const getDateMaintenanceOrIntervention = async (id, type) => {
  try {
    if (type === 'maintenance') {
      // Récupère la maintenance avec l'ID donné
      const maintenance = await prisma.maintenance.findUnique({
        where: { id: id }, // Recherche par ID
        select: {
          dateMaintenance: true, // Sélectionne uniquement la date de maintenance
        },
      });

      // Retourne la date ou un message par défaut si elle n'existe pas
      return maintenance?.dateMaintenance || "Date inconnue";
    } else if (type === 'intervention') {
      // Récupère l'intervention avec l'ID donné
      const intervention = await prisma.intervention.findUnique({
        where: { id: id }, // Recherche par ID
        select: {
          dateIntervention: true, // Sélectionne uniquement la date d'intervention
        },
      });

      // Retourne la date ou un message par défaut si elle n'existe pas
      return intervention?.dateIntervention || "Date inconnue";
    } else {
      throw new Error('Type invalide');
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la date :", error);
    return "Erreur";
  }
};
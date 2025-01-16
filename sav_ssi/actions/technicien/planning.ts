'use server';

import prisma from "@/lib/prisma";
import { Main } from "next/document";


export const getEtatUrgence = async (id: number, type: string) => {
  try {
    if (type === 'intervention') {
      const intervention = await prisma.intervention.findUnique({
        where: { id },
        select: { urgent: true }
      });
      return intervention?.urgent ? 1 : 0;
    }
    return 0;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'état d\'urgence:', error);
    return 0;
  }
};

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
export const updateMaintenanceStatus = async (id: number, statut: string) => {
  try {
    const result = await prisma.maintenance.update({
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

interface Action {
  idAction: number;
  statut: boolean;
  observation: string;
}

export const updateMaintenanceAction = async (MaintenanceId: number, actions: Action[]): Promise<any> => {
  try {
    // Validation des données
    if (!Array.isArray(actions) || actions.length === 0) {
      throw new Error('Les actions sont requises');
    }

    // Vérifier que toutes les actions ont les propriétés requises
    actions.forEach((action: Action) => {
      if (!action.idAction || typeof action.statut !== 'boolean' || typeof action.observation !== 'string') {
        throw new Error('Format d\'action invalide');
      }
    });

    console.log('Actions to insert:', actions); // Debugging line

    const result = await prisma.$transaction(
      actions.map((action: Action) =>
        prisma.maintenanceAction.create({
          data: {
            statut: action.statut,
            observation: action.observation || '',
            idMaintenance: MaintenanceId,
            idAction: action.idAction,
          },
        })
      )
    );

    console.log('Insertion result:', result); // Debugging line
    return result;
  } catch (error) {
    console.log('Erreur lors de la mise à jour des actions de maintenance :', error);
    throw error; // Propager l'erreur avec plus de détails
  }
};
// Fonction pour mettre à jour une intervention
export const updateIntervention = async (id: number, diagnostics: string, travauxRealises: string, dateIntervention: Date, dureeHeure: number ) => {
  try {
    const result = await prisma.intervention.update({
      where: { id: id },
      data: {
        diagnostics: diagnostics,
        travauxRealises: travauxRealises,
        dateIntervention:dateIntervention,
        dureeHeure: dureeHeure,
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
    try {
      return await prisma.intervention.findFirst({
        select: {
          id: true,
          statut: true,
          typePanneDeclare: true,
          datePlanifiee: true,
          diagnostics: true,
          travauxRealises: true,
          pieceFournies: true,
          Client: {
            select: {
              nom: true, // Récupère uniquement le nom du client
            },
          },
        },
        where: {
          datePlanifiee: {
            not: null, // S'assurer que la date planifiée n'est pas nulle
          },
        },
        orderBy: {
          datePlanifiee: "asc", // Trier par date planifiée croissante
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la prochaine intervention :", error);
      throw error;
    }
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
  export async function getAllInterventionsByTechnician(idTechnicien) {
    try {
      return await prisma.intervention.findMany({
        where: {
          idTechnicien: idTechnicien, // Filtre par ID du technicien
        },
        select: {
          id: true,
          statut: true,
          typePanneDeclare: true,
          dateDeclaration: true,
          dateIntervention: true,
          datePlanifiee: true,
          idClient: true,
          diagnostics: true,
          travauxRealises: true,
          pieceFournies: true,
          Client: {
            select: {
              nom: true, // Récupère uniquement le nom du client
            },
          },
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des interventions :", error);
      throw error;
    }
  }
  
  // Fonction pour récupérer toutes les interventions et maintenances triées par date

  
  export const getPlanning = async (technicienId) => {
    try {
      const interventions = await prisma.intervention.findMany({
        where: {
          idTechnicien: technicienId
        },
        
        select: {
          id: true,
          statut: true,
          typePanneDeclare: true,
          dateDeclaration: true,
          dateIntervention: true,
          datePlanifiee: true,
          diagnostics: true,
          travauxRealises: true,
          pieceFournies: true,
          dureeHeure: true,
          numero: true,
          ficheInt: true,
          prenomContact: true,
          telephoneContact: true,
          adresse: true,
          Client: {
            select: {
              nom: true,
            },
          },
        },
        orderBy: {
          datePlanifiee: "asc",
        },
      
      });
  
      const maintenances = await prisma.maintenance.findMany({
        where: {
          idTechnicien: technicienId
        },
        
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
      console.log(maintenances);

      // Fusionner interventions et maintenances, puis trier par date
      const planning = [...interventions, ...maintenances].sort((a, b) => {
        const dateA = new Date(a.datePlanifiee || a.dateMaintenance);
        const dateB = new Date(b.datePlanifiee || b.dateMaintenance);
        return dateA - dateB;
      });
  
      // Supprimer les doublons
      const uniquePlanning = [];
      const seen = new Set();
  
      for (const item of planning) {
        const identifier = `${item.id}-${item.datePlanifiee || item.dateMaintenance}`;
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
    try {
        await new Promise((resolve) => setTimeout(resolve, 10)); // Simulation d'attente

        if (item.Client?.nom) {
            return item.Client.nom; // Cas intervention
        } else if (item.Installation?.Client?.nom) {
            return item.Installation.Client.nom; // Cas maintenance
        }

        return "N/A"; // Si aucun nom trouvé
    } catch (error) {
        console.error("Erreur lors de la récupération du nom du client :", error);
        throw error;
    }
};

  
  // Fonction pour récupérer la description
export const getDescription = async (item) => {
  try {
    // Simuler un délai asynchrone (par exemple, un appel API)
    await new Promise((resolve) => setTimeout(resolve, 10)); // Attente de 10 ms pour simuler un traitement

    if (item.typePanneDeclare) {
      // Cas d'une intervention avec type de panne déclarée
      return item.typePanneDeclare;
    } else if (item.description) {
      // Cas d'une maintenance avec description
      return item.description;
    } else {
      // Cas où aucune description n'est trouvée
      return "Description non disponible";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la description :", error);
    throw error;
  }
};

  
  
 // Fonction pour déterminer le type (intervention ou maintenance)
export const getType = async (item) => {
  try {
    // Simuler un délai asynchrone si nécessaire
    await new Promise((resolve) => setTimeout(resolve, 10)); // Attente de 10 ms pour simuler un traitement

    // Vérifie si l'item correspond à une intervention
    if (item.typePanneDeclare) {
      return "Intervention";
    }

    // Sinon, considère que c'est une maintenance
    if (item.description) {
      return "Maintenance";
    }

    // Si aucune information n'est disponible
    return "Type inconnu";
  } catch (error) {
    console.error("Erreur lors de la détermination du type :", error);
    throw error;
  }
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
  
 
// Fonction pour récupérer le système pour une intervention donnée
export const getSystemeForIntervention = async (idIntervention) => {
  try {
    // Recherche de l'intervention et récupération du système directement
    const intervention = await prisma.intervention.findUnique({
      where: { id: idIntervention },
      include: {
        Systeme: { select: { nom: true } }, // Remplacez `nom` par les colonnes nécessaires
      },
    });

    // Retourne le nom du système ou un message par défaut
    return intervention?.Systeme?.nom || "Système inconnu";
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
      if (type === "maintenance") {
        // Récupère la maintenance avec l'ID donné
        const maintenance = await prisma.maintenance.findUnique({
          where: { id: id }, // Recherche par ID
          select: {
            datePlanifiee: true, // Sélectionne uniquement la date de maintenance
          },
        });
  
        // Retourne la date ou un message par défaut si elle n'existe pas
        return maintenance?.datePlanifiee || "Date inconnue";
      } else if (type === "intervention") {
        // Récupère l'intervention avec l'ID donné
        const intervention = await prisma.intervention.findUnique({
          where: { id: id }, // Recherche par ID
          select: {
            datePlanifiee: true, // Sélectionne uniquement la date planifiée
          },
        });
  
        // Retourne la date ou un message par défaut si elle n'existe pas
        return intervention?.datePlanifiee || "Date inconnue";
      } else {
        throw new Error("Type invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la date :", error);
      return "Erreur";
    }
  };
  



export const formatStatut = async (statut) => {
  // Simuler une opération asynchrone comme un appel API avec un délai
  return new Promise((resolve) => {
    setTimeout(() => {
      // Remplace les underscores par des espaces et met tout en majuscules
      resolve(statut.replace('_', ' ').toUpperCase());
    }, 1000);
  });
}
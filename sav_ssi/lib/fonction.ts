import prisma from "@/lib/prisma";

/**
 * Récupère les équipements associés à un système.
 * @param installationId - L'identifiant de l'installation.
 * @param systemeId - L'identifiant du système.
 * @returns Une liste d'équipements.
  * @param id - L'identifiant de l'intervention ou de la maintenance.
 * @param type - Le type de la tâche ('intervention' ou 'maintenance').
 * @param idInstallationEq - L'identifiant de l'installation de l'équipement.
 * @param nouveauStatut - Le nouveau statut à appliquer.
 */

// Sauvegarder les infos pour une intervention ou une maintenance
export const saveInfos = async (id, type, data) => {
  try {
    if (type === 'intervention') {
      await prisma.intervention.update({
        where: { id: Number(id) },
        data: { ...data }, // Met à jour les champs fournis dans data
      });
    } else if (type === 'maintenance') {
      await prisma.maintenance.update({
        where: { id: Number(id) },
        data: { ...data },
      });
    } else {
      throw new Error('Type invalide');
    }
    console.log(`Infos sauvegardées pour ${type} avec succès.`);
    return { success: true };
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des infos :`, error);
    return { success: false, error: error.message };
  }
};

// Valider une intervention ou une maintenance (statut à 'Validé')
export const validateOperation = async (id, type) => {
  return await updateStatut(id, type, 'Termine');
};

export const updateDiagnosticForIntervention = async (id: string | number, nouveauDiagnostic: string) => {
  try {
    // Récupérer le diagnostic actuel (facultatif si vous voulez afficher ou utiliser le diagnostic actuel avant la mise à jour)
    const intervention = await prisma.intervention.findUnique({
      where: { id: Number(id) },
      select: { diagnostics: true }, // On récupère uniquement le champ "diagnostics"
    });

    if (!intervention) {
      throw new Error("Intervention non trouvée");
    }

    console.log("Diagnostic actuel : ", intervention.diagnostics);

    // Mettre à jour le diagnostic dans la table intervention
    await prisma.intervention.update({
      where: { id: Number(id) },
      data: {
        diagnostics: nouveauDiagnostic, // Mise à jour du diagnostic
      },
    });

    console.log("Diagnostic mis à jour avec succès");
    return nouveauDiagnostic; // Retourne le nouveau diagnostic
  } catch (error) {
    console.error('Erreur lors de la mise à jour du diagnostic :', error);
    throw new Error('Impossible de mettre à jour le diagnostic');
  }
};

// Fonction pour récupérer la date de déclaration de la panne à partir de la table DemandeIntervention
export async function getDateDeclarationPanne(idIntervention: number): Promise<string | null> {
  try {
    // Requête pour récupérer la date de déclaration de la panne
    const demandeIntervention = await prisma.demandeIntervention.findUnique({
      where: { id: idIntervention },
      select: { dateDeclaration: true }, // On sélectionne uniquement la date de déclaration
    });

    if (demandeIntervention && demandeIntervention.dateDeclaration) {
      // Retourner la date de déclaration sous un format lisible
      return demandeIntervention.dateDeclaration.toISOString(); // Vous pouvez ajuster ce format selon vos besoins
    }

    return null; // Retourne null si aucune date n'est trouvée
  } catch (error) {
    console.error('Erreur lors de la récupération de la date de déclaration de la panne:', error);
    return null;
  }
}
export const getGarantieStatus = async (idInstallationEq: number) => {
  try {
    const garantie = await prisma.garantie.findFirst({
      where: {
        idInstallationEq: idInstallationEq,
      },
      select: {
        dateDebutGarantie: true,
        dateFinGarantie: true,
      },
    });

    if (!garantie) {
      return "Aucune garantie trouvée pour cette installation";
    }

    const now = new Date();
    const { dateDebutGarantie, dateFinGarantie } = garantie;

    if (now >= new Date(dateDebutGarantie) && now <= new Date(dateFinGarantie)) {
      return "Installation sous garantie";
    } else {
      return "Garantie expirée ou non encore active";
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la garantie :", error);
    return "Erreur lors de la vérification de la garantie";
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

export const getGarantieByInstallation = async (idInstallationEq: number) => {
  try {
    const garantie = await prisma.garantie.findFirst({
      where: {
        idInstallationEq: idInstallationEq,
      },
      select: {
        dateDebutGarantie: true,
        dateFinGarantie: true,
      },
    });

    if (garantie) {
      return garantie;
    } else {
      return 'Aucune garantie trouvée pour cette installation';
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la garantie :', error);
    return 'Erreur lors de la récupération de la garantie';
  }
};
export const getNumeroTelephoneDuContact = async (idContact: number) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: idContact,
      },
      include: {
        Utilisateur: { // Inclut les informations de l'utilisateur associées
          select: {
            numero: true, // Sélectionne uniquement le numéro de téléphone
          },
        },
      },
    });

    if (contact && contact.Utilisateur) {
      return contact.Utilisateur.numero || 'Numéro non trouvé';
    } else {
      return 'Contact ou numéro non trouvé';
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du numéro de téléphone du contact :', error);
    return 'Erreur lors de la récupération du numéro';
  }
};

export async function updateStatut(id: string | number, type: 'intervention' | 'maintenance', nouveauStatut: string) {
  try {
    if (type === 'intervention') {
      await prisma.intervention.update({
        where: { id: Number(id) },
        data: {
          statut: nouveauStatut, // Assurez-vous que 'statut' est un champ dans votre table
        },
      });
    } else if (type === 'maintenance') {
      await prisma.maintenance.update({
        where: { id: Number(id) },
        data: {
          statut: nouveauStatut, // Assurez-vous que 'statut' est un champ dans votre table
        },
      });
    }
    console.log(`Statut de ${type} mis à jour avec succès.`);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de ${type}:`, error);
    throw new Error(`Impossible de mettre à jour le statut de ${type}`);
  }
}
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

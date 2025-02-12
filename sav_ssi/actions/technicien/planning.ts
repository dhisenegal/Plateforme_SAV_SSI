'use server';

import prisma from "@/lib/prisma";

export async function getMaintenanceActionsForExtincteurs(maintenanceId: number) {
  try {
    if (!maintenanceId) {
      throw new Error("L'ID de la maintenance est requis");
    }

    console.log('Récupération des actions de maintenance pour maintenance ID:', maintenanceId);

    const maintenanceActions = await prisma.maintenanceActionExtincteur.findMany({
      where: {
        idMaintenance: maintenanceId
      },
      include: {
        ActionMaintenanceExtincteur: true,
        InstallationExtincteur: {
          include: {
            InstallationEquipement: {
              include: {
                Equipement: {
                  include: {
                    Extincteurs: {
                      include: {
                        TypeExtincteur: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!maintenanceActions.length) {
      return {
        success: false,
        message: 'Aucune action de maintenance trouvée pour cette maintenance',
        data: []
      };
    }

    const formattedData = maintenanceActions.map(action => ({
      id: action.id,
      idMaintenance: action.idMaintenance,
      idActionMaintenanceExtincteur: action.idActionMaintenanceExtincteur,
      idInstallationExtincteur: action.idInstallationExtincteur,
      statut: action.statut,
      observation: action.observation,
      actionDetails: {
        id: action.ActionMaintenanceExtincteur.id,
        libeleAction: action.ActionMaintenanceExtincteur.libeleAction
      },
      extincteur: {
        idInstallationEquipement: action.InstallationExtincteur.InstallationEquipement.id,
        number: action.InstallationExtincteur.InstallationEquipement.Numero || '',
        location: action.InstallationExtincteur.InstallationEquipement.Emplacement || '',
        status: action.InstallationExtincteur.InstallationEquipement.statut,
        typePression: action.InstallationExtincteur.InstallationEquipement.Equipement.Extincteurs[0]?.typePression || '',
        modeVerification: action.InstallationExtincteur.InstallationEquipement.Equipement.Extincteurs[0]?.modeVerification || '',
        typeExtincteur: action.InstallationExtincteur.InstallationEquipement.Equipement.Extincteurs[0]?.TypeExtincteur?.nom || '',
        details: {
          DateFabrication: action.InstallationExtincteur.DateFabrication.toISOString(),
          DatePremierChargement: action.InstallationExtincteur.DatePremierChargement.toISOString(),
          DateDerniereVerification: action.InstallationExtincteur.DateDerniereVerification.toISOString()
        }
      }
    }));

    console.log('Données formatées:', formattedData);

    return {
      success: true,
      data: formattedData,
      message: null
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des actions de maintenance:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Échec de la récupération des actions de maintenance',
      data: []
    };
  }
}

// Fonction pour récupérer les détails d'un extincteur spécifique
export async function getExtincteurDetails(installationEquipementId: number,
  maintenanceId: number
) {
  try {
    if (!installationEquipementId) {
      throw new Error("L'ID de l'installation équipement est requis");
    }

    console.log('Récupération des détails pour InstallationEquipement ID:', installationEquipementId);

    const extincteurDetails = await prisma.installationExtincteur.findFirst({
      where: {
        idInstallationEquipement: installationEquipementId,
      },
      include: {
        InstallationEquipement: {
          include: {
            Equipement: {
              include: {
                Extincteurs: {
                  include: {
                    TypeExtincteur: true
                  }
                }
              }
            }
          }
        },
        MaintenanceActionExtincteur: {
          where: {
            idMaintenance: maintenanceId
          },
          include: {
            ActionMaintenanceExtincteur: true
          }
        }
      }
    });

    if (!extincteurDetails) {
      return {
        success: false,
        message: "Détails de l'extincteur non trouvés",
        data: null
      };
    }

    // Formater les dates en ISO string pour la cohérence
    const formattedData = {
      id: extincteurDetails.id,
      idInstallationEquipement: extincteurDetails.idInstallationEquipement,
      DateFabrication: extincteurDetails.DateFabrication.toISOString(),
      DatePremierChargement: extincteurDetails.DatePremierChargement.toISOString(),
      DateDerniereVerification: extincteurDetails.DateDerniereVerification.toISOString(),
      InstallationEquipement: {
        id: extincteurDetails.InstallationEquipement.id,
        Numero: extincteurDetails.InstallationEquipement.Numero,
        Emplacement: extincteurDetails.InstallationEquipement.Emplacement,
        statut: extincteurDetails.InstallationEquipement.statut,
        HorsService: extincteurDetails.InstallationEquipement.HorsService,
        Equipement: {
          id: extincteurDetails.InstallationEquipement.Equipement.id,
          Extincteurs: extincteurDetails.InstallationEquipement.Equipement.Extincteurs.map(ext => ({
            id: ext.id,
            typePression: ext.typePression,
            modeVerification: ext.modeVerification,
            chargeReference: ext.chargeReference || '',
            TypeExtincteur: {
              id: ext.TypeExtincteur.id,
              nom: ext.TypeExtincteur.nom
            }
          }))
        }
      },
      maintenanceActions: extincteurDetails.MaintenanceActionExtincteur.map(action => ({
        id: action.id,
        idMaintenance: action.idMaintenance,
        idActionMaintenanceExtincteur: action.idActionMaintenanceExtincteur,
        idInstallationExtincteur: action.idInstallationExtincteur,
        statut: action.statut,
        observation: action.observation,
        actionDetails: {
          id: action.ActionMaintenanceExtincteur.id,
          libeleAction: action.ActionMaintenanceExtincteur.libeleAction
        }
      }))
    };

    console.log('Détails formatés:', formattedData);

    return {
      success: true,
      data: formattedData,
      message: null,
      userInfo: {
        currentUser: 'Narou98',
        currentDate: '2025-01-30 12:12:29'
      }
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur lors de la récupération des détails de l'extincteur",
      data: null
    };
  }
}
export async function updateMaintenanceActionExtincteur(
  actions: MaintenanceActionExtincteurUpdate[]
) {
  try {
    console.log('Mise à jour des actions de maintenance:', actions);

    // Vérification des données
    if (!Array.isArray(actions) || actions.length === 0) {
      throw new Error('Aucune action à mettre à jour');
    }

    // Mise à jour de toutes les actions en une seule transaction
    const updateResults = await prisma.$transaction(
      actions.map(action => 
        prisma.maintenanceActionExtincteur.upsert({
          where: {
            id: action.id,
          },
          update: {
            statut: action.statut,
            observation: action.observation,
          },
          create: {
            idMaintenance: action.idMaintenance,
            idActionMaintenanceExtincteur: action.idActionMaintenanceExtincteur,
            idInstallationExtincteur: action.idInstallationExtincteur,
            statut: action.statut,
            observation: action.observation,
          },
        })
      )
    );

    console.log('Résultats de la mise à jour:', updateResults);

    return {
      success: true,
      message: 'Actions de maintenance mises à jour avec succès',
      data: updateResults,
      userInfo: {
        currentUser: 'Narou98',
        currentDate: '2025-01-30 12:18:19'
      }
    };

  } catch (error) {
    console.error('Erreur lors de la mise à jour des actions:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour des actions de maintenance',
      data: null,
      userInfo: {
        currentUser: 'Narou98',
        currentDate: '2025-01-30 12:18:19'
      }
    };
  }
}
// Fonction pour récupérer tous les extincteurs d'une installation
export async function getExtincteursForSystem(installationId: number) {
  try {
    if (!installationId) {
      throw new Error("L'ID de l'installation est requis");
    }

    console.log('Récupération des extincteurs pour installation:', installationId);

    const installationEquipements = await prisma.installationEquipement.findMany({
      where: {
        idInstallation: installationId,
        Equipement: {
          Extincteurs: {
            some: {}
          }
        }
      },
      include: {
        Equipement: {
          include: {
            Extincteurs: {
              include: {
                TypeExtincteur: true
              }
            }
          }
        },
        InstallationExtincteur: {
          include: {
            MaintenanceActionExtincteur: {
              include: {
                ActionMaintenanceExtincteur: true,
                Maintenance: {
                  select: {
                    dateMaintenance: true,
                    numero: true,
                    statut: true
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('Équipements trouvés:', installationEquipements.length);

    if (!installationEquipements.length) {
      return {
        success: false,
        message: 'Aucun extincteur trouvé pour cette installation',
        data: []
      };
    }

    const formattedData = installationEquipements.map(equipment => ({
      idInstallationEquipement: equipment.id,
      idInstallationExtincteur: equipment.InstallationExtincteur[0]?.id,
      idInstallation: equipment.idInstallation,
      number: equipment.Numero || '',
      location: equipment.Emplacement || '',
      status: equipment.statut,
      extinguisher: {
        typePression: equipment.Equipement.Extincteurs[0]?.typePression || '',
        modeVerification: equipment.Equipement.Extincteurs[0]?.modeVerification || '',
        TypeExtincteur: {
          nom: equipment.Equipement.Extincteurs[0]?.TypeExtincteur?.nom || ''
        }
      },
      details: equipment.InstallationExtincteur[0] ? {
        DateFabrication: equipment.InstallationExtincteur[0].DateFabrication.toISOString(),
        DatePremierChargement: equipment.InstallationExtincteur[0].DatePremierChargement.toISOString(),
        DateDerniereVerification: equipment.InstallationExtincteur[0].DateDerniereVerification.toISOString()
      } : null,
      maintenanceActions: equipment.InstallationExtincteur[0]?.MaintenanceActionExtincteur.map(action => ({
        id: action.id,
        statut: action.statut,
        observation: action.observation,
        maintenance: {
          numero: action.Maintenance.numero,
          dateMaintenance: action.Maintenance.dateMaintenance?.toISOString(),
          statut: action.Maintenance.statut
        },
        action: {
          id: action.ActionMaintenanceExtincteur.id,
          libeleAction: action.ActionMaintenanceExtincteur.libeleAction
        }
      })) || []
    }));

    console.log('Données formatées:', formattedData);

    return {
      success: true,
      data: formattedData,
      message: null
    };

  } catch (error) {
    console.error('Erreur dans getExtincteursForSystem:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Échec de la récupération des extincteurs',
      data: []
    };
  }
}

export async function countExtincteursForSystem(installationId: number) {
  const installation = await prisma.installation.findUnique({
    where: { id: installationId },
    include: {
      Systeme: true
    }
  });

  // If not a fire extinguisher system, return 0
  if (!installation?.Systeme?.nom.toUpperCase().includes('MOYENS DE SECOURS EXTINCTEURS')) {
    return 0;
  }

  const count = await prisma.installationExtincteur.count({
    where: {
      InstallationEquipement: {
        idInstallation: installationId
      }
    }
  });

  return count;
}
  
export async function getInstallationIdFromMaintenance(idMaintenance: number) {
  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { 
        id: idMaintenance 
      },
      select: {
        idInstallation: true // Sélectionner directement idInstallation
      }
    });

    if (!maintenance || !maintenance.idInstallation) {
      throw new Error("Installation non trouvée pour cette maintenance");
    }

    return maintenance.idInstallation;
  } catch (error) {
    console.error('Erreur dans getInstallationIdFromMaintenance:', error);
    throw error;
  }
}

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
interface UpdateInterventionData {
  diagnostics: string;
  travauxRealises: string;
  dureeHeure: number;
  dateIntervention: Date;
  dateFinInt: Date;
}


export const updateIntervention = async (id: number, data: UpdateInterventionData) => {
  try {
    // Ajoutez un log pour vérifier les données avant la mise à jour
    console.log('Données envoyées à updateIntervention:', data);

    const result = await prisma.intervention.update({
      where: { id: id },
      data: {
        diagnostics: data.diagnostics,
        travauxRealises: data.travauxRealises,
        dureeHeure: data.dureeHeure,
        dateIntervention: data.dateIntervention,
        dateFinInt: data.dateFinInt,
      },
    });
    return result;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'intervention :', error);
    throw new Error('Erreur lors de la mise à jour de l\'intervention');
  }
};  

export const updateMaintenance = async (id: number, data: UpdateMaintenanceData) => {
  try {
    // Ajoutez un log pour vérifier les données avant la mise à jour
    console.log('Données envoyées à updateMaintenance:', data);

    const result = await prisma.maintenance.update({
      where: { id: id }, // Utilisation de l'id de la maintenance pour la mise à jour
      data: {
        dateMaintenance: data.dateMaintenance, // Mise à jour de l'heure de début
        dateFinMaint: data.dateFinMaint, // Mise à jour de l'heure de fin
      },
    });

    return result;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la maintenance :', error);
    throw new Error('Erreur lors de la mise à jour de la maintenance');
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
  
  // Constants for pagination
 
  
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
        
        dureeHeure: true,
        numero: true,
        
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
  
  export const fetchDetails = async (id: number, type: string) => {
    try {
      if (type === "intervention") {
        const intervention = await prisma.intervention.findUnique({
          where: { id },
          select: {
            Client: { select: { nom: true } },
            Systeme: { select: { nom: true } },
            datePlanifiee: true,
            statut: true,
            urgent: true,
          },
        });
  
        if (!intervention) {
          throw new Error("Intervention non trouvée");
        }
  
        return {
          clientName: intervention.Client.nom,
          systeme: intervention.Systeme.nom,
          datePlanifiee: intervention.datePlanifiee,
          statut: intervention.statut,
          urgent: intervention.urgent,
        };
      } else if (type === "maintenance") {
        const maintenance = await prisma.maintenance.findUnique({
          where: { id },
          select: {
            Installation: {
              select: {
                Client: { select: { nom: true } },
                Systeme: { select: { nom: true } },
              },
            },
            datePlanifiee: true,
            statut: true,
          },
        });
  
        if (!maintenance) {
          throw new Error("Maintenance non trouvée");
        }
  
        return {
          clientName: maintenance.Installation.Client.nom,
          systeme: maintenance.Installation.Systeme.nom,
          datePlanifiee: maintenance.datePlanifiee,
          statut: maintenance.statut,
          urgent: false, // Maintenances are not urgent by default
        };
      } else {
        throw new Error("Type invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      throw error;
    }
  };
  
  export const getType = async (item) => {
    try {
     
      await new Promise((resolve) => setTimeout(resolve, 10)); 
  
  
      if (item.typePanneDeclare) {
        return "intervention";
      }

      if (item.description) {
        return "maintenance";
      }
  
      return "Type inconnu";
    } catch (error) {
      console.error("Erreur lors de la détermination du type :", error);
      throw error;
    }
  };
// Fonction pour récupérer le statut d'une intervention ou d'une maintenance
  export const getStatut = async (id: number, type: string) => {
    try {
      if (type === 'intervention') {
        const intervention = await prisma.intervention.findUnique({
          where: { id },
          select: {
            statut: true,
          },
        });
  
        if (intervention) {
          return intervention.statut || 'Statut non défini';
        } else {
          throw new Error('Intervention non trouvée');
        }
      } else if (type === 'maintenance') {
        const maintenance = await prisma.maintenance.findUnique({
          where: { id },
          select: {
            statut: true,
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
  
  export const formatHeure = async (date: string | undefined): Promise<string> => {
    // Simuler un délai asynchrone (si nécessaire pour votre cas d'usage)
    await new Promise(resolve => setTimeout(resolve, 10));
  
    if (!date) return 'N/A';
    
    try {
      const dateObj = new Date(date);
      
      const heureFormatee = new Intl.DateTimeFormat('fr-SN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Dakar',
        hour12: false
      }).format(dateObj);
      
      return heureFormatee;
    } catch (error) {
      console.error("Erreur lors du formatage de l'heure:", error);
      return 'N/A';
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

  
  
 
  
  // Exporte la fonction qui récupère le nombre total de pages pour un technicien donné
// Exemple pour la fonction `getTotalPages` dans le backend
export const getTotalPages = async (technicienId) => {
  try {
    console.log('technicienId reçu:', technicienId); // Log de débogage pour vérifier que technicienId est bien passé
    if (!technicienId) {
      throw new Error('technicienId manquant');
    }

    // Supposons que vous faites une requête pour récupérer le total des interventions
    const totalCount = await prisma.intervention.count({
      where: {
        technicienId: technicienId,
      },
    });

    console.log('totalCount:', totalCount); // Log pour vérifier le total des interventions

    // Calcul du nombre total de pages (exemple: 10 éléments par page)
    const totalPages = Math.ceil(totalCount / 10);
    return totalPages;
  } catch (error) {
    console.error('Erreur dans getTotalPages:', error);
    throw error;
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
};

export const getInterventionsBySystem = async () => {
  try {
    // Récupération des systèmes distincts dans les interventions
    const systems = await prisma.intervention.findMany({
      select: {
        idSysteme: true,  // On récupère l'id du système
      },
      distinct: ['idSysteme'],  // On récupère les systèmes distincts
    });

    // Comptage des interventions pour chaque système
    const systemCounts = await prisma.intervention.groupBy({
      by: ['idSysteme'],  // Grouper par idSysteme
      _count: {
        id: true,  // Compter le nombre d'interventions
      },
    });

    // Création d'un tableau avec les résultats (nom du système et nombre d'interventions)
    const result = await Promise.all(
      systemCounts.map(async (system) => {
        const systemName = await prisma.systeme.findUnique({
          where: { id: system.idSysteme },
          select: { nom: true },
        });

        return {
          systeme: systemName?.nom || 'Inconnu',
          interventions: system._count.id,
        };
      })
    );

    return result;
  } catch (error) {
    console.error('Erreur lors du comptage des interventions par système:', error);
    throw error;
  }
};
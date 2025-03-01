"use server";

import { prisma } from "@/prisma";
import { endOfMonth, startOfMonth, subMonths, format } from "date-fns";

export async function getRecentInterventions() {
  try {
    const recentInterventions = await prisma.intervention.findMany({
      where: {
        statut: "TERMINE",
      },
      include: {
        Technicien: true,
        Client: true,
      },
      orderBy: {
        dateIntervention: 'desc'
      },
      take: 5
    });

    return recentInterventions;
  } catch (error) {
    console.error("Error fetching recent interventions:", error);
    throw new Error("Failed to fetch recent interventions");
  }
}

interface ChartDataPoint {
  date: string;
  maintenance: number;
  intervention: number;
}

export async function getAnalyticsData(startDate: Date, endDate: Date) {
  try {
    // Fetch maintenance counts grouped by date
    const maintenanceCounts = await prisma.maintenance.groupBy({
      by: ['dateMaintenance'],
      _count: {
        id: true
      },
      where: {
        dateMaintenance: {
          gte: startDate,
          lte: endDate
        },
        statut: 'TERMINE'
      }
    });

    // Fetch intervention counts grouped by date
    const interventionCounts = await prisma.intervention.groupBy({
      by: ['dateIntervention'],
      _count: {
        id: true
      },
      where: {
        dateIntervention: {
          gte: startDate,
          lte: endDate
        },
        statut: 'TERMINE'
      }
    });

    // Create a map of all dates in the range
    const dateMap = new Map<string, ChartDataPoint>();
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        maintenance: 0,
        intervention: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in maintenance counts
    maintenanceCounts.forEach((count) => {
      if(count.dateMaintenance) {
      const dateStr = count.dateMaintenance.toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        const data = dateMap.get(dateStr)!;
        data.maintenance = count._count.id;
      }
    }
    });

    // Fill in intervention counts
    interventionCounts.forEach((count) => {
      const dateStr = count.dateIntervention!.toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        const data = dateMap.get(dateStr)!;
        data.intervention = count._count.id;
      }
    });

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    );

  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}
//Fonction pour analyser les délais des interventions
export interface DelayAnalytics {
  onTime: number;
  delayed: number;
  interventions: {
    id: number;
    client: string | null;
    technicien: string | null;
    dateDeclaration: Date;
    dateIntervention: Date | null;
    systeme: string | null;
    horsDelai: boolean;
    isOnTime: boolean;
    delayInHours: number;
    commentaires: {
      id: number;
      commentaire: string;
      dateCommentaire: Date;
      auteur: string;
    }[];
  }[];
}

export async function getInterventionDelayAnalytics(
  startDate: Date,
  endDate: Date
): Promise<DelayAnalytics> {
  try {
    const interventions = await prisma.intervention.findMany({
      where: {
        AND: [
          {
            dateDeclaration: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            dateIntervention: {
              not: null,
            },
          },
          {
            statut: "TERMINE",
          },
        ],
      },
      include: {
        Client: {
          select: {
            nom: true,
          },
        },
        Technicien: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        Systeme: {
          select: {
            nom: true,
          },
        },
        Commentaires: {
          select: {
            id: true,
            commentaire: true,
            dateCommentaire: true,
            Utilisateur: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
          orderBy: {
            dateCommentaire: 'desc',
          },
        },
      },
    });

    let onTime = 0;
    let delayed = 0;
    const analyzedInterventions = interventions.map((intervention) => {
      const declarationDate = new Date(intervention.dateDeclaration);
      const interventionDate = intervention.dateIntervention!;
      
      const delayInHours = Math.abs(
        (interventionDate.getTime() - declarationDate.getTime()) / (1000 * 60 * 60)
      );
      
      const isOnTime = delayInHours <= 48;
      if (isOnTime) {
        onTime++;
      } else {
        delayed++;
      }

      return {
        id: intervention.id,
        client: intervention.Client?.nom || null,
        technicien: intervention.Technicien 
          ? `${intervention.Technicien.prenom} ${intervention.Technicien.nom}`
          : null,
        dateDeclaration: declarationDate,
        dateIntervention: interventionDate,
        systeme: intervention.Systeme?.nom || null,
        horsDelai: !isOnTime,
        isOnTime,
        delayInHours,
        commentaires: intervention.Commentaires.map(comment => ({
          id: comment.id,
          commentaire: comment.commentaire,
          dateCommentaire: comment.dateCommentaire,
          auteur: `${comment.Utilisateur.prenom} ${comment.Utilisateur.nom}`,
        })),
      };
    });

    return {
      onTime,
      delayed,
      interventions: analyzedInterventions,
    };
  } catch (error) {
    console.error("Error analyzing intervention delays:", error);
    throw new Error("Failed to analyze intervention delays");
  }
}

export async function getNewInterventionsCount() {
  const currentCount = await prisma.intervention.count({
      where: {
          statut: "NON_PLANIFIE"
      }
  });

  // Get last month's count for comparison
  const lastMonth = {
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1))
  };

  const lastMonthCount = await prisma.intervention.count({
      where: {
          statut: "NON_PLANIFIE",
          dateDeclaration: {
              gte: lastMonth.start,
              lte: lastMonth.end
          }
      }
  });

  const percentageChange = lastMonthCount > 0 
      ? ((currentCount - lastMonthCount) / lastMonthCount) * 100 
      : 0;

  return {
      count: currentCount,
      percentageChange: Number(percentageChange.toFixed(1))
  };
}

export async function getSuspendedInterventionsCount() {
  const currentCount = await prisma.intervention.count({
      where: {
          statut: "SUSPENDU"
      }
  });

  const lastMonth = {
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1))
  };

  const lastMonthCount = await prisma.intervention.count({
      where: {
          statut: "SUSPENDU",
          dateDeclaration: {
              gte: lastMonth.start,
              lte: lastMonth.end
          }
      }
  });

  const percentageChange = lastMonthCount > 0 
      ? ((currentCount - lastMonthCount) / lastMonthCount) * 100 
      : 0;

  return {
      count: currentCount,
      percentageChange: Number(percentageChange.toFixed(1))
  };
}
//recupérer nbre interventions hors delai
export async function getOverdueInterventionsCount() {
  const now = new Date();
  
  // Get current overdue interventions
  const currentCount = await prisma.intervention.count({
      where: {
          AND: [
              {
                  OR: [
                      // Case 1: Intervention has occurred but was done after 48h
                      {
                          dateIntervention: {
                              not: null
                          },
                          dateDeclaration: {
                              lt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
                          }
                      },
                      // Case 2: No intervention yet and 48h have passed since declaration
                      {
                          dateIntervention: null,
                          dateDeclaration: {
                              lt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
                          }
                      }
                  ]
              },
              {
                  NOT: {
                      statut: "TERMINE"
                  }
              }
          ]
      }
  });

  // Calculate last month's date range
  const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1))
  };

  // Get last month's overdue interventions
  const lastMonthCount = await prisma.intervention.count({
      where: {
          AND: [
              {
                  dateDeclaration: {
                      gte: lastMonth.start,
                      lte: lastMonth.end
                  }
              },
              {
                  OR: [
                      // Case 1: Intervention occurred but was done after 48h
                      {
                          dateIntervention: {
                              not: null
                          },
                          dateDeclaration: {
                              lt: new Date(lastMonth.end.getTime() - 48 * 60 * 60 * 1000)
                          }
                      },
                      // Case 2: No intervention and 48h passed
                      {
                          dateIntervention: null,
                          dateDeclaration: {
                              lt: new Date(lastMonth.end.getTime() - 48 * 60 * 60 * 1000)
                          }
                      }
                  ]
              },
              {
                  NOT: {
                      statut: "TERMINE"
                  }
              }
          ]
      }
  });

  // Calculate percentage change
  const percentageChange = lastMonthCount > 0
      ? ((currentCount - lastMonthCount) / lastMonthCount) * 100
      : 0;

  return {
      count: currentCount,
      percentageChange: Number(percentageChange.toFixed(1))
  };
}

export async function getExpiringContractsCount() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const currentCount = await prisma.contrat.count({
      where: {
          dateFin: {
              lte: thirtyDaysFromNow
          }
      }
  });

  const lastMonth = {
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1))
  };

  const lastMonthCount = await prisma.contrat.count({
      where: {
          dateFin: {
              gte: lastMonth.start,
              lte: lastMonth.end
          }
      }
  });

  const percentageChange = lastMonthCount > 0 
      ? ((currentCount - lastMonthCount) / lastMonthCount) * 100 
      : 0;

  return {
      count: currentCount,
      percentageChange: Number(percentageChange.toFixed(1))
  };
}
// pour le area graph
export async function getInterventionStats() {
  try {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // Récupérer toutes les interventions terminées pour le mois en cours
    const interventions = await prisma.intervention.findMany({
      where: {
        statut: "TERMINE",
        dateIntervention: {
          not: null,
        },
        dateDeclaration: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      select: {
        dateDeclaration: true,
        dateIntervention: true,
      },
    });

    // Calculer le nombre d'interventions sur délai et hors délai
    let onTime = 0;
    let overdue = 0;

    interventions.forEach((intervention) => {
      const declarationDate = new Date(intervention.dateDeclaration);
      const interventionDate = new Date(intervention.dateIntervention!);

      // Calculer la différence en heures
      const delayInHours = Math.abs(
        (interventionDate.getTime() - declarationDate.getTime()) / (1000 * 60 * 60)
      );

      // Vérifier si l'intervention est hors délai (plus de 48 heures)
      if (delayInHours > 48) {
        overdue++;
      } else {
        onTime++;
      }
    });

    // Calculer le pourcentage d'interventions hors délai
    const totalInterventions = onTime + overdue;
    const overduePercentage = totalInterventions > 0
      ? (overdue / totalInterventions) * 100
      : 0;

    return {
      onTime,
      overdue,
      overduePercentage: Number(overduePercentage.toFixed(1)), // Arrondir à 1 décimale
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques des interventions:", error);
    throw new Error("Failed to fetch intervention stats");
  }
}

// Fonction pour générer une couleur aléatoire en hexadécimal
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export async function getInterventionsBySystem() {
  try {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    // Récupérer toutes les interventions terminées pour les 6 derniers mois
    const interventions = await prisma.intervention.findMany({
      where: {
        statut: "TERMINE",
        dateIntervention: {
          not: null,
        },
        dateDeclaration: {
          gte: subMonths(startOfCurrentMonth, 6), // 6 derniers mois
          lte: endOfCurrentMonth,
        },
      },
      include: {
        Systeme: {
          select: {
            nom: true,
          },
        },
      },
    });

    // Regrouper les interventions par système
    const systemCounts: Record<string, number> = {};

    interventions.forEach((intervention) => {
      const systemName = intervention.Systeme?.nom || "Autres";
      systemCounts[systemName] = (systemCounts[systemName] || 0) + 1;
    });

    // Formater les données pour le graphe
    const chartData = Object.entries(systemCounts).map(([system, count]) => ({
      system,
      interventions: count,
      fill: getRandomColor(), // Attribuer une couleur aléatoire
    }));

    // Calculer le nombre total d'interventions pour le mois actuel et le mois précédent
    const currentMonthInterventions = await prisma.intervention.count({
      where: {
        statut: "TERMINE",
        dateIntervention: {
          not: null,
        },
        dateDeclaration: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    const lastMonthInterventions = await prisma.intervention.count({
      where: {
        statut: "TERMINE",
        dateIntervention: {
          not: null,
        },
        dateDeclaration: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Calculer le pourcentage d'augmentation
    const percentageChange = lastMonthInterventions > 0
      ? ((currentMonthInterventions - lastMonthInterventions) / lastMonthInterventions) * 100
      : 0;

    return {
      chartData,
      period: {
        start: format(subMonths(startOfCurrentMonth, 6), "MMMM yyyy"), // Début de la période (6 mois avant)
        end: format(endOfCurrentMonth, "MMMM yyyy"), // Fin de la période (mois actuel)
      },
      percentageChange: Number(percentageChange.toFixed(1)), // Pourcentage d'augmentation
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des interventions par système:", error);
    throw new Error("Failed to fetch interventions by system");
  }
}
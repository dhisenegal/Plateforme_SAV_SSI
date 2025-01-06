"use server";

import { prisma } from "@/prisma";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

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
      const dateStr = count.dateMaintenance.toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        const data = dateMap.get(dateStr)!;
        data.maintenance = count._count.id;
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
    isOnTime: boolean;
    delayInHours: number;
  }[];
}

export async function getInterventionDelayAnalytics(
  startDate: Date,
  endDate: Date
): Promise<DelayAnalytics> {
  'use server';
  
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
        isOnTime,
        delayInHours,
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
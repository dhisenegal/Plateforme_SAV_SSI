"use server";

import { prisma } from "@/prisma";

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
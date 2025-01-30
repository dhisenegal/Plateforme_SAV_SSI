"use server";

import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

// Helper pour récupérer tous les systèmes
async function getAllSystems() {
  return await prisma.systeme.findMany({
    select: {
      id: true,
      nom: true
    }
  });
}

//Fonction pour obtenir les statistiques des équipements par mois
export async function getEquipmentStats() {
  const systems = await getAllSystems();
  
  const last7Months = Array.from({ length: 7 }).map((_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      month: date.toLocaleString('default', { month: 'short' })
    };
  }).reverse();

  const stats = await Promise.all(
    last7Months.map(async ({ start, end, month }) => {
      // Récupère les installations d'équipements pour ce mois
      const monthlyStats = await prisma.installationEquipement.findMany({
        where: {
          dateInstallation: {
            gte: start,
            lte: end
          }
        },
        include: {
          Equipement: {
            include: {
              Systeme: true
            }
          }
        }
      });

      // Initialise l'objet résultat avec le mois
      const result: any = { name: month };

      // Calcule les totaux pour chaque système
      systems.forEach(system => {
        result[system.nom.toLowerCase()] = monthlyStats
          .filter(stat => stat.Equipement.Systeme.id === system.id)
          .reduce((acc, curr) => acc + curr.quantite, 0);
      });

      return result;
    })
  );

  return stats;
}

// Fonction pour obtenir les statistiques des utilisateurs par mois
export async function getUserStats() {
  const last7Months = Array.from({ length: 7 }).map((_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      month: date.toLocaleString('default', { month: 'short' })
    };
  }).reverse();

  // Récupère tous les rôles
  const roles = await prisma.role.findMany();

  const stats = await Promise.all(
    last7Months.map(async ({ start, end, month }) => {
      const result: any = { name: month };

      // Compte les utilisateurs pour chaque rôle
      for (const role of roles) {
        const count = await prisma.utilisateur.count({
          where: {
            idRole: role.id,
          }
        });
        result[role.nom.toLowerCase()] = count;
      }

      return result;
    })
  );

  return stats;
}

// Fonction pour obtenir la répartition totale des équipements
export async function getEquipmentDistribution() {
  const systems = await getAllSystems();

  const distribution = await Promise.all(
    systems.map(async (system) => {
      // Compte le nombre d'équipements pour ce système
      const count = await prisma.equipement.count({
        where: {
<<<<<<< HEAD
          Equipement: {
            idSysteme: system.id
          }
        
    }});

      return {
        name: system.nom,
        value: totalEquipments.length
=======
          idSysteme: system.id, // Filtre par système
        },
      });

      return {
        name: system.nom, // Nom du système
        value: count, // Nombre d'équipements pour ce système
>>>>>>> e53b9087d97f15fe3e42b1afec95c6fd3df6b94a
      };
    })
  );

  return distribution;
}

// Type pour les données des systèmes (à utiliser dans votre composant)
export type SystemData = {
  id: number;
  nom: string;
}

// Fonction pour récupérer les systèmes (à utiliser pour les légendes dynamiques)
export async function getSystemsForLegend() {
  return await getAllSystems();
}
"use server";

import { prisma } from "@/prisma";

// Ajouter un système
export const addSysteme = async (systemName: string) => {
  try {
    return await prisma.systeme.create({
      data: { nom: systemName },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du système :", error);
    throw new Error("Impossible d'ajouter le système.");
  }
};

// Modifier un système
export const updateSysteme = async (id: number, updatedData: { nom: string }) => {
  try {
    return await prisma.systeme.update({
      where: { id },
      data: updatedData,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du système :", error);
    throw new Error("Impossible de modifier le système.");
  }
};

// Supprimer un système
export const deleteSysteme = async (id: number) => {
  try {
    return await prisma.systeme.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du système :", error);
    throw new Error("Impossible de supprimer le système.");
  }
};

// Ajouter une marque
export const addMarque = async (brandName: string) => {
  try {
    return await prisma.marqueSsi.create({
      data: { nom: brandName },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la marque :", error);
    throw new Error("Impossible d'ajouter la marque.");
  }
};

// Modifier une marque
export const updateMarque = async (id: number, updatedData: { nom: string }) => {
  try {
    return await prisma.marqueSsi.update({
      where: { id },
      data: updatedData,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la marque :", error);
    throw new Error("Impossible de modifier la marque.");
  }
};

// Supprimer une marque
export const deleteMarque = async (id: number) => {
  try {
    return await prisma.marqueSsi.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la marque :", error);
    throw new Error("Impossible de supprimer la marque.");
  }
};

// Ajouter un modèle
export const addModele = async (modelName: string) => {
  try {
    return await prisma.modeleSsi.create({
      data: { nom: modelName },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du modèle :", error);
    throw new Error("Impossible d'ajouter le modèle.");
  }
};

// Modifier un modèle
export const updateModele = async (id: number, updatedData: { nom: string }) => {
  try {
    return await prisma.modeleSsi.update({
      where: { id },
      data: updatedData,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du modèle :", error);
    throw new Error("Impossible de modifier le modèle.");
  }
};

// Supprimer un modèle
export const deleteModele = async (id: number) => {
  try {
    return await prisma.modeleSsi.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du modèle :", error);
    throw new Error("Impossible de supprimer le modèle.");
  }
};

// Add type for extincteur data
type ExtincteurData = {
  typePression: 'PP' | 'PA';
  modeVerification: 'V5' | 'V10';
  chargeReference: number;
  tare: number | null;
  sparklet: boolean;
  chargeReferenceSparklet: number | null;
  poidsMax: number | null;
  poidsMin: number | null;
  idTypeExtincteur: number;
};

// Modified addEquipement to handle extincteur type
export const addEquipement = async (equipmentData: {
  nom: string;
  idSysteme: number;
  idMarqueSsi: number;
  idModeleSsi: number;
  isExtincteur?: boolean;
  extincteurData?: ExtincteurData;
}) => {
  try {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Create base equipment
      const equipment = await tx.equipement.create({
        data: {
          nom: equipmentData.nom,
          idSysteme: equipmentData.idSysteme || 0,
          idMarqueSsi: equipmentData.idMarqueSsi || 0,
          idModeleSsi: equipmentData.idModeleSsi || 0,
        },
      });

      // If it's an extincteur, create related record
      if (equipmentData.isExtincteur && equipmentData.extincteurData) {
        await tx.extincteur.create({
          data: {
            idEquipement: equipment.id,
            ...equipmentData.extincteurData
          },
        });
      }

      return equipment;
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'équipement :", error);
    throw new Error("Impossible d'ajouter l'équipement.");
  }
};

// Récupérer tous les équipements
export const getAllEquipements = async () => {
  try {
    const equipements = await prisma.equipement.findMany();
    
    console.log("Equipements récupérés :", equipements);  // Ajouter un log pour inspecter les données
    return equipements;
  } catch (error) {
    console.error("Erreur lors de la récupération des équipements :", error);
    throw new Error("Impossible de récupérer les équipements.");
  }
};

// Modifier un équipement
export const updateEquipement = async (id: number, updatedData: Partial<{ nom: string; idSysteme: number; idMarqueSsi: number; idModeleSsi: number }>) => {
  try {
    return await prisma.equipement.update({
      where: { id },
      data: updatedData,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'équipement :", error);
    throw new Error("Impossible de modifier l'équipement.");
  }
};

// Supprimer un équipement
export const deleteEquipement = async (id: number) => {
  try {
    return await prisma.equipement.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'équipement :", error);
    throw new Error("Impossible de supprimer l'équipement.");
  }
};

// Récupérer tous les systèmes
export const getAllSystemes = async () => {
  try {
    return await prisma.systeme.findMany();
  } catch (error) {
    console.error("Erreur lors de la récupération des systèmes :", error);
    throw new Error("Impossible de récupérer les systèmes.");
  }
};

// Récupérer toutes les marques
export const getAllMarques = async () => {
  try {
    return await prisma.marqueSsi.findMany();
  } catch (error) {
    console.error("Erreur lors de la récupération des marques :", error);
    throw new Error("Impossible de récupérer les marques.");
  }
};

// Récupérer tous les modèles
export const getAllModeles = async () => {
  try {
    return await prisma.modeleSsi.findMany();
  } catch (error) {
    console.error("Erreur lors de la récupération des modèles :", error);
    throw new Error("Impossible de récupérer les modèles.");
  }
};

export const addTypeExtincteur = async (typeExtincteurName: string) => {
  try {
    return await prisma.typeExtincteur.create({
      data: { nom: typeExtincteurName },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du Type d'extincteur :", error);
    throw new Error("Impossible d'ajouter le type d'extincteur.");
  }
};

export const getAllTypeExtincteurs = async () => {
  try {
    return await prisma.typeExtincteur.findMany();
  } catch (error) {
    console.error("Erreur lors de la récupération des types d'extincteurs :", error);
    throw new Error("Impossible de récupérer les types d'extincteurs.");
  }
};
export const updateTypeExtincteur = async (id: number, updatedData: { nom: string }) => {
  try {
    return await prisma.typeExtincteur.update({
      where: { id },
      data: updatedData,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type d'extincteur :", error);
    throw new Error("Impossible de modifier le type d'extincteur.");
  }
};
 export const deleteTypeExtincteur = async (id: number) => {
  try {
    return await prisma.typeExtincteur.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du type d'extincteur :", error);
    throw new Error("Impossible de supprimer le type d'extincteur.");
  }
};
export const addExtincteur = async (extincteurData: {
  idEquipement: number;
  typePression: string;
  modeVerification: string;
  chargeReference: string;
  tare: string;
  sparklet: boolean;
  chargeReferenceSparklet: string;
  poidsMax: string;
  poidsMin: string;
  idTypeExtincteur: number;
}) => {
  try {
    return await prisma.extincteur.create({
      data: extincteurData,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'extincteur :", error);
    throw new Error("Impossible d'ajouter l'extincteur.");
  }
};

export const getAllExtincteurs = async () => {
  try {
    return await prisma.extincteur.findMany();
  } catch (error) {
    console.error("Erreur lors de la récupération des extincteurs :", error);
    throw new Error("Impossible de récupérer les extincteurs.");
  }
};

export const updateExtincteur = async (id: number, updatedData: Partial<{
  idEquipement: number;
  typePression: string;
  modeVerification: string;
  chargeReference: string;
  tare: string;
  sparklet: boolean;
  chargeReferenceSparklet: string;
  poidsMax: string;
  poidsMin: string;
  idTypeExtincteur: number;
}>) => {
  try {
    return await prisma.extincteur.update({
      where: { id },
      data: updatedData,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'extincteur :", error);
    throw new Error("Impossible de modifier l'extincteur.");
  }
};

export const deleteExtincteur = async (id: number) => {
  try {
    return await prisma.extincteur.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'extincteur :", error);
    throw new Error("Impossible de supprimer l'extincteur.");
  }
};
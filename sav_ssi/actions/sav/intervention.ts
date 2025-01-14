"use server";

import { prisma } from "@/prisma";
import { Intervention, EnumStatut_i,Commentaire } from "@prisma/client";

// Récupérer toutes les interventions
export const getInterventions = async (
  page: number,
  pageSize: number,
  search: string,
  status?: string,
  technicianId?: string,
  clientId?: string,
  startDate?: string,
  endDate?: string
) => {
  const where = {
    AND: [
      
      { statut: status ? { equals: status } : undefined },
      { idTechnicien: technicianId ? { equals: parseInt(technicianId) } : undefined },
      { idClient: clientId ? { equals: parseInt(clientId) } : undefined },
      {
        dateIntervention: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        }
      }
    ]
  };

  const [interventions, total] = await prisma.$transaction([
    prisma.intervention.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        Technicien: true,
        Client: true,
        Site: true,
        Systeme: true
      },
      orderBy: {
        dateIntervention: 'desc'
      }
    }),
    prisma.intervention.count(),
  ]);

  return { interventions, total };
};


// Créer une nouvelle intervention
export const createIntervention = async (data: {
  typePanneDeclare: string;
  dateDeclaration: Date;
  prenomContact: string;
  telephoneContact: string;
  adresse: string;
  numero: number | null;
  statut: EnumStatut_i;
  datePlanifiee?: Date;
  idTechnicien?: number;
  idClient: number;
  idSite: number;
  idSysteme: number;
}): Promise<Intervention> => {
  // Construire l'objet de données de base
  const interventionData = {
    typePanneDeclare: data.typePanneDeclare,
    dateDeclaration: data.dateDeclaration,
    prenomContact: data.prenomContact,
    telephoneContact: data.telephoneContact,
    adresse: data.adresse,
    numero: data.numero,
    statut: data.statut,
    datePlanifiee: data.datePlanifiee || null,
    Client: { connect: { id: data.idClient } },
    Site: { connect: { id: data.idSite } },
    Systeme: { connect: { id: data.idSysteme } },
  };

  // Ajouter le technicien seulement s'il est fourni
  if (data.idTechnicien) {
    interventionData["Technicien"] = { connect: { id: data.idTechnicien } };
  }

  return await prisma.intervention.create({
    data: interventionData,
    include: {
      Technicien: true,
      Client: true,
      Site: true,
      Systeme: true
    }
  });
};


export const updateIntervention = async (
  id: number,
  data: Partial<Intervention>
) => {
  return await prisma.intervention.update({
    where: { id },
    data,
    include: {
      Technicien: true,
      Client: true,
      Site: true,
      Systeme: true
    }
  });
};

export const deleteIntervention = async (id: number) => {
  return await prisma.intervention.delete({
    where: { id }
  });
};

// Ajouter un commentaire simple
export const addComment = async (
  interventionId: number,
  commentaire: string,
  userId: number
) => {
  try {
    const newComment = await prisma.commentaire.create({
      data: {
        commentaire: commentaire,
        idIntervention: interventionId,
        idUtilisateur: userId,
      },
      include: {
        Utilisateur: true,
      },
    });
    return newComment;
  } catch (error) {
    console.log('Erreur dans addComment:', error);
    throw error;
  }
};

// Mettre à jour l'intervention avec un commentaire
export const updateInterventionWithComment = async (
  interventionId: number,
  newStatus: EnumStatut_i,
  commentaire: string,
  userId: number
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour l'intervention
      const updatedIntervention = await tx.intervention.update({
        where: { id: interventionId },
        data: { 
          statut: newStatus,
        },
        include: {
          Technicien: true,
          Client: true,
          Site: true,
          Systeme: true
        }
      });

      // 2. Créer le commentaire
      const newComment = await tx.commentaire.create({
        data: {
          commentaire: commentaire,
          idIntervention: interventionId,
          idUtilisateur: userId,
        },
      });

      return { intervention: updatedIntervention, comment: newComment };
    });

    return result;
  } catch (error) {
    console.error('Erreur dans updateInterventionWithComment:', error);
    throw error;
  }
};

// Récupérer les commentaires
export const getComments = async (interventionId: number) => {
  try {
    const comments = await prisma.commentaire.findMany({
      where: {
        idIntervention: interventionId,
      },
      include: {
        Utilisateur: true,
      },
      orderBy: {
        dateCommentaire: 'desc',
      },
    });
    return comments;
  } catch (error) {
    console.error('Erreur dans getComments:', error);
    throw error;
  }
};
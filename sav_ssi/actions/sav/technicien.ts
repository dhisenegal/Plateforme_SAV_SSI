"use server";

import { prisma } from "@/prisma";
import { Utilisateur } from "@prisma/client";
import bcrypt from "bcryptjs";

// Créer un nouveau technicien
export const createTechnicien = async (data: {
  prenom: string;
  nom: string;
  numero: string;
  login: string;
  password: string;
  email: string;
}): Promise<Utilisateur> => {
  return await prisma.utilisateur.create({
    data: {
      prenom: data.prenom,
      nom: data.nom,
      numero: data.numero,
      login: data.prenom.toLowerCase() + "." + data.nom.toLowerCase(),
      password: await bcrypt.hash(data.password, 10),
      idRole: 3, // Rôle technicien
      etatCompte: "actif",
      email: data.email,
    },
  });
};

// Mettre à jour un technicien
export const updateTechnicien = async (id: number, data: {
  prenom?: string;
  nom?: string;
  numero?: string;
  login?: string;
  password?: string;
  email?: string;
  etatCompte?: string;
}): Promise<Utilisateur> => {
  return await prisma.utilisateur.update({
    where: { id },
    data,
  });
};

// Activer ou désactiver un technicien
export const toggleTechnicienStatus = async (id: number, status: string): Promise<Utilisateur> => {
  return await prisma.utilisateur.update({
    where: { id },
    data: {
      etatCompte: status,
    },
  });
};

// Récupérer tous les techniciens avec pagination
export const getTechniciens = async (page: number, pageSize: number): Promise<{ techniciens: Utilisateur[], total: number }> => {
  const [techniciens, total] = await prisma.$transaction([
    prisma.utilisateur.findMany({
      where: { idRole: 3 },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.utilisateur.count({
      where: { idRole: 3 },
    }),
  ]);

  return { techniciens, total };
};

export const getAllTechniciens = async (): Promise<Utilisateur[]> => {
  const techniciens = await prisma.utilisateur.findMany({
    where: { idRole: 3 },
  });

  return techniciens;
};

export const getTechnicienById = async (id: number): Promise<Utilisateur | null> => {
  if (!id) return null;
  
  const technicien = await prisma.utilisateur.findFirst({
    where: {
      id: id,
      idRole: 3
    }
  });
  
  return technicien;
};
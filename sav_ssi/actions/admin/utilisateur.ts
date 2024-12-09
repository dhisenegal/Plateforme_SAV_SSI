"use server";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  return await prisma.utilisateur.findMany();
};

// Récupérer un utilisateur par ID
export const getUserById = async (id: number) => {
  return await prisma.utilisateur.findUnique({
    where: { id },
  });
};

// Créer un utilisateur
export const createUser = async (data: {
  login: string;
  password: string;
  nom: string;
  prenom: string;
  numero: string;
  email: string;
  idRole: number;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.utilisateur.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

// Mettre à jour un utilisateur
export const updateUser = async (id: number, data: {
  login?: string;
  nom?: string;
  prenom?: string;
  numero?: string;
  email?: string;
  idRole?: number;
}) => {
  const existingUser = await prisma.utilisateur.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  return await prisma.utilisateur.update({
    where: { id },
    data,
  });
};

// Réinitialiser le mot de passe d'un utilisateur
export const updateUserPassword = async (id: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await prisma.utilisateur.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
  });
};

// Supprimer un utilisateur
export const deleteUser = async (id: number) => {
  return await prisma.utilisateur.delete({
    where: { id },
  });
};

// Récupérer tous les rôles
export const getAllRoles = async () => {
  return await prisma.role.findMany();
};

// Créer un rôle
export const createRole = async (data: { nom: string }) => {
  return await prisma.role.create({
    data,
  });
};

// Mettre à jour un rôle
export const updateRole = async (id: number, data: { nom: string }) => {
  const existingRole = await prisma.role.findUnique({
    where: { id },
  });

  if (!existingRole) {
    throw new Error("Role not found");
  }

  return await prisma.role.update({
    where: { id },
    data,
  });
};

// Supprimer un rôle
export const deleteRole = async (id: number) => {
  return await prisma.role.delete({
    where: { id },
  });
};
"use server";

import { prisma } from "@/prisma";

// Ajouter un client
export const addClient = async (nomClient: string, secteur: string) => {
  if (!nomClient || !secteur) {
    throw new Error("Le nom du client et le secteur d'activité sont obligatoires.");
  }

  try {
    const client = await prisma.client.create({
      data: {
        nom: nomClient,
        secteurDactivite: secteur,
      },
    });
    return client;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    throw new Error("Erreur lors de l'ajout du client");
  }
};

// Récupérer tous les clients
export const getClients = async () => {
  try {
    const clients = await prisma.client.findMany();
    return clients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw new Error("Erreur lors de la récupération des clients");
  }
};

// Récupérer un client par son ID
export const getClientById = async (id: number) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        Sites: true,
        Contacts: true,
        Installations: {
          include: {
            EquipementsInstallation: {
              include: {
                Equipement: true,
              },
            },
          },
        },
      },
    });
    return client;
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw new Error("Erreur lors de la récupération du client");
  }
};


// Mettre à jour un client
export const updateClient = async (id: number, clientData: { nom?: string, secteurDactivite?: string }) => {
  if (!clientData.nom && !clientData.secteurDactivite) {
    throw new Error("Au moins un champ (nom ou secteur d'activité) doit être renseigné.");
  }

  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: clientData,
    });
    return updatedClient;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    throw new Error("Erreur lors de la mise à jour du client");
  }
};

// Supprimer un client
export const deleteClient = async (id: number) => {
  try {
    await prisma.client.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error);
    throw new Error("Erreur lors de la suppression du client");
  }
};


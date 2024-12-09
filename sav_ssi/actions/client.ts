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

// Récupérer tous les sites d'un client par son ID
export const getSitesByClientId = async (clientId: number) => {
  try {
    const sites = await prisma.site.findMany({
      where: { idClient: clientId },
    });
    return sites;
  } catch (error) {
    console.error("Erreur lors de la récupération des sites:", error);
    throw new Error("Erreur lors de la récupération des sites");
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

// Ajouter un site à un client
export const addSiteToClient = async (clientId: number, nomSite: string) => {
  if (!clientId || !nomSite) {
    throw new Error("L'ID du client et le nom du site sont obligatoires.");
  }

  try {
    const site = await prisma.site.create({
      data: {
        nom: nomSite,
        idClient: clientId,
      },
    });
    return site;
  } catch (error) {
    console.error("Erreur lors de l'ajout du site:", error);
    throw new Error("Erreur lors de l'ajout du site");
  }
};

// Ajouter un contact à un client
export const addContactToClient = async (clientId: number, nomResponsable: string, idUtilisateur: number) => {
  if (!clientId || !nomResponsable || !idUtilisateur) {
    throw new Error("L'ID du client, le nom du responsable et l'ID de l'utilisateur sont obligatoires.");
  }

  try {
    const contact = await prisma.contact.create({
      data: {
        nomResponsable,
        idClient: clientId,
        idUtilisateur,
      },
    });
    return contact;
  } catch (error) {
    console.error("Erreur lors de l'ajout du contact:", error);
    throw new Error("Erreur lors de l'ajout du contact");
  }
};

// Ajouter une installation à un site
export const addInstallationToSite = async (siteId: number, dateInstallation: Date, observations: string, idClient: number, idSysteme: number) => {
  if (!siteId || !dateInstallation || !idClient || !idSysteme) {
    throw new Error("L'ID du site, la date d'installation, l'ID du client et l'ID du système sont obligatoires.");
  }

  try {
    const installation = await prisma.installation.create({
      data: {
        dateInstallation,
        observations,
        idClient,
        idSysteme,
        idSite: siteId,
      },
    });
    return installation;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'installation:", error);
    throw new Error("Erreur lors de l'ajout de l'installation");
  }
};

// Ajouter un équipement à une installation avec quantité
export const addEquipementToInstallation = async (installationId: number, equipementId: number, quantite: number) => {
  if (!installationId || !equipementId || quantite === undefined || quantite === null) {
    throw new Error("L'ID de l'installation, l'ID de l'équipement et la quantité sont obligatoires.");
  }
  console.log("Adding equipement to installation:", {
    installationId,
    equipementId,
    quantite,
  });

  try {
    const equipementInstallation = await prisma.installationEquipement.create({
      data: {
        idInstallation: installationId,
        idEquipement: equipementId,
        statut: "Nouveau",
        quantite,
      },
    });
    console.log("Equipement ajouté avec succès:", equipementInstallation);
    return equipementInstallation;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'équipement:", error);
    throw new Error("Erreur lors de l'ajout de l'équipement");
  }
};

// Récupérer tous les systèmes
export const getAllSystemes = async () => {
  try {
    const systemes = await prisma.systeme.findMany({
      include: {
        Equipements: true,
      },
    });
    return systemes;
  } catch (error) {
    console.error("Erreur lors de la récupération des systèmes:", error);
    throw new Error("Erreur lors de la récupération des systèmes");
  }
};
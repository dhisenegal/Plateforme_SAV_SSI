"use server";
import { prisma } from "@/prisma";
import { Contact } from "@prisma/client"; // Add this line to import the Contact type

// Récupérer les contacts d'un site
export const getSiteContacts = async (siteId: number) => {
  const contacts = await prisma.contactSite.findMany({
    where: { idSite: siteId },
    include: {
      Contact: {
        include: {
          Utilisateur: true,
        },
      },
    },
  });
  console.log("Contacts récupérés:", contacts);
  return contacts;
};

// Créer un nouveau contact pour un site
export const createContact = async (data: {
  nom: string;
  prenom: string;
  numero: string;
  email: string;
  idSite: number;
  estManager: boolean;
}) => {
  return await prisma.$transaction(async (prisma) => {
    // Récupérer l'ID du client à partir de l'ID du site
    const site = await prisma.site.findUnique({
      where: { id: data.idSite },
      select: { idClient: true },
    });

    if (!site) {
      throw new Error(`Le site avec l'ID "${data.idSite}" n'existe pas.`);
    }

    const idClient = site.idClient;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error(`L'email "${data.email}" existe déjà.`);
    }

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        numero: data.numero,
        email: data.email,
        idRole: 4, // Assigner un rôle par défaut
        login: data.prenom.toLowerCase().concat(data.nom.toLowerCase()),
        password: "",
      },
    });

    const contact = await prisma.contact.create({
      data: {
        idUtilisateur: utilisateur.id,
        idClient: idClient,
      },
    });

    const contactsite = await prisma.contactSite.create({
      data: {
        idSite: data.idSite,
        idContact: contact.id,
        estManager: data.estManager,
      },
      include: {
        Contact: {
          include: {
            Utilisateur: true,
          },
        },
      },
    });

    console.log("Nouveau contact créé:", contactsite);
    return contactsite;
  });
};

// Mettre à jour un contact pour un site
export const updateContact = async (id: number, data: {
  nom?: string;
  prenom?: string;
  numero?: string;
  email?: string;
  estManager?: boolean;
}) => {
  const contactsite = await prisma.contactSite.findUnique({
    where: { id },
    include: {
      Contact: {
        include: {
          Utilisateur: true,
        },
      },
    },
  });

  if (!contactsite) {
    throw new Error(`Le contact avec l'ID "${id}" n'existe pas.`);
  }

  const updatedContact = await prisma.$transaction(async (prisma) => {
    const updatedUtilisateur = await prisma.utilisateur.update({
      where: { id: contactsite.Contact.idUtilisateur },
      data: {
        nom: data.nom,
        prenom: data.prenom,
        numero: data.numero,
        email: data.email,
      },
    });

    const updatedContactSite = await prisma.contactSite.update({
      where: { id },
      data: {
        estManager: data.estManager,
      },
      include: {
        Contact: {
          include: {
            Utilisateur: true,
          },
        },
      },
    });

    return {
      ...updatedContactSite,
      Contact: {
        ...updatedContactSite.Contact,
        Utilisateur: updatedUtilisateur,
      },
    };
  });

  console.log("Contact mis à jour:", updatedContact);
  return updatedContact;
};

// Supprimer un contact pour un site
export const deleteContact = async (id: number) => {
  const deletedContact = await prisma.contactSite.delete({
    where: { id },
  });

  console.log("Contact supprimé:", deletedContact);
  return deletedContact;
};

// Récupérer les contacts par site
export const getContactsBySite = async (siteId: number): Promise<Contact[]> => {
  const contacts = await prisma.contact.findMany({
    where: {
      ContactSites: {
        some: {
          idSite: siteId,
        },
      },
    },
    include: {
      Utilisateur: true,
    },
  });

  return contacts.map(contact => ({
    ...contact,
    prenom: contact.Utilisateur.prenom,
    nom: contact.Utilisateur.nom,
  }));
};
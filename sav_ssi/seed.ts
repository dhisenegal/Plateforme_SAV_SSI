import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Créer des rôles
  const roleAdmin = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nom: "admin",
    },
  });

  const roleUser = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nom: "sav",
    },
  });

  const roleTechnicien = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nom: "technicien",
    },
  });

  // Créer des utilisateurs
  const hashedPasswordAdmin = await bcrypt.hash("passer", 10);
  const hashedPasswordUser = await bcrypt.hash("passer", 10);
  const hashedPasswordTechnicien = await bcrypt.hash("passer", 10);

  const utilisateur1 = await prisma.utilisateur.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      login: "admin",
      password: hashedPasswordAdmin,
      nom: "Admin",
      prenom: "User",
      numero: "1234567890",
      etatCompte: "actif",
      email: "admin@example.com",
      idRole: roleAdmin.id,
    },
  });

  const utilisateur2 = await prisma.utilisateur.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      login: "sav",
      password: hashedPasswordUser,
      nom: "User",
      prenom: "Example",
      numero: "0987654321",
      etatCompte: "actif",
      email: "user@example.com",
      idRole: roleUser.id,
    },
  });
  const utilisateur3 = await prisma.utilisateur.upsert({
    where: { email: "technicien@example.com" },
    update: {},
    create: {
      login: "technicien",
      password: hashedPasswordTechnicien,
      nom: "Technicien",
      prenom: "Example",
      numero: "0987654321",
      etatCompte: "actif",
      email: "technicien@example.com",
      idRole: roleTechnicien.id,
    },
  });

  // Créer des clients
  const client1 = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nom: "Client 1",
      secteurDactivite: "Secteur 1",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nom: "Client 2",
      secteurDactivite: "Secteur 2",
    },
  });

  // Créer des sites
  const site1 = await prisma.site.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nom: "Site 1",
      idClient: client1.id,
      adresse: "Adresse 1",
    },
  });

  const site2 = await prisma.site.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nom: "Site 2",
      idClient: client2.id,
      adresse: "Adresse 2",
    },
  });

  // Créer des contrats
  const contrat1 = await prisma.contrat.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nom: "Contrat 1",
      dateDebut: new Date(),
      dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      periodicite: "Mensuelle",
      typeContrat: "1 an renouvelable",
      termeContrat: "Curative",
      idSite: site1.id,
    },
  });

  const contrat2 = await prisma.contrat.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nom: "Contrat 2",
      dateDebut: new Date(),
      dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      periodicite: "Mensuelle",
      typeContrat: "1 an renouvelable",
      termeContrat: "Curative",
      idSite: site2.id,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
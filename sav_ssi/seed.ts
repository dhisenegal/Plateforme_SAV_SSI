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

  const roleClient = await prisma.role.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      nom: "client",
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
  const Sonatel = await prisma.client.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nom: "SONATEL",
      secteurDactivite: "TELECOM",
    },
  });
  const Der = await prisma.client.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      nom: "DER",
      secteurDactivite:"ENTREPRENATRIAT",
    },
  });
  const Senelec = await prisma.client.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      nom: "SENELEC",
      secteurDactivite:"ENERGIE",
    },
  });

  const TestFonctionnalitéDuSystème = await prisma.actionMaintenance.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      libeleAction: "Test fonctionnalité du système*",
      idSysteme: 1,
    },
  });
  
  const VérificationCarteElectroniqueDeLaCentrale = await prisma.actionMaintenance.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      libeleAction: "Vérification carte électronique de la centrale",
      idSysteme: 1,
    },
  });
  
  const TestAlimentationEtBatterieDeLaCentrale = await prisma.actionMaintenance.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      libeleAction: "Test alimentation et batterie de la centrale",
      idSysteme: 1,
    },
  });
  
{
  /* // Créer des sites
  const SITE1 = await prisma.site.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nom: "SONATEL SIEGE",
      idClient: Sonatel.id,
      adresse: "Cité Keur Gorgui",
    },
  });

  const site2 = await prisma.site.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nom: "SENELEC SIEGE",
      idClient: Senelec.id,
      adresse: "Cite keur gorgui",
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
}*/
}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
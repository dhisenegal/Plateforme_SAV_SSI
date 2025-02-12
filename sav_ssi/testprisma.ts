import prisma from "./lib/prisma"; // Assurez-vous que le chemin est correct

async function testPrisma() {
  try {
    const interventions = await prisma.intervention.findMany(); // Attention à la casse
    console.log("Données d'intervention :", interventions);
  } catch (error) {
    console.error("Erreur Prisma :", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();

import { prisma } from "@/prisma";

// Fonction pour récupérer les installations par site
export const getInstallationsBySite = async (siteId: number) => {
  try {
    const installations = await prisma.installation.findMany({
      where: { idSite: siteId },
    });
    return installations;
  } catch (error) {
    console.error("Erreur lors de la récupération des installations:", error);
    throw new Error("Failed to fetch installations");
  }
};
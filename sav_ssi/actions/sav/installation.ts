"use server";

import { prisma } from "@/prisma";
// Fonction pour récupérer les installations par site
// actions/sav/installation.ts

export const getInstallationsBySite = async (siteId: number) => {
  const installations = await prisma.installation.findMany({
    where: {
      idSite: siteId
    },
    include: {
      Systeme: true
    }
  });
  
  return installations;
};
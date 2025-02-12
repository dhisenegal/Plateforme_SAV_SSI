'use server';

import prisma from "@/lib/prisma";


//Fonction pour récupérer les informations d'un contact
export const getNumeroTelephoneDuContact = async (idContact: number) => {
    try {
      const contact = await prisma.contact.findUnique({
        where: {
          id: idContact,
        },
        include: {
          Utilisateur: { // Inclut les informations de l'utilisateur associées
            select: {
              numero: true, // Sélectionne uniquement le numéro de téléphone
            },
          },
        },
      });
  
      if (contact && contact.Utilisateur) {
        return contact.Utilisateur.numero || 'Numéro non trouvé';
      } else {
        return 'Contact ou numéro non trouvé';
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du numéro de téléphone du contact :', error);
      return 'Erreur lors de la récupération du numéro';
    }
  };


// Sauvegarder les infos pour une intervention ou une maintenance
export const saveInfos = async (id, type, data) => {
    try {
      if (type === 'intervention') {
        await prisma.intervention.update({
          where: { id: Number(id) },
          data: { ...data }, // Met à jour les champs fournis dans data
        });
      } else if (type === 'maintenance') {
        await prisma.maintenance.update({
          where: { id: Number(id) },
          data: { ...data },
        });
      } else {
        throw new Error('Type invalide');
      }
      console.log(`Infos sauvegardées pour ${type} avec succès.`);
      return { success: true };
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde des infos :`, error);
      return { success: false, error: error.message };
    }
  };
  
  // Valider une intervention ou une maintenance (statut à 'Validé')
  export const validateOperation = async (id, type) => {
    return await updateStatut(id, type, 'Termine');
  };
  
  export const updateDiagnosticForIntervention = async (id: string | number, nouveauDiagnostic: string) => {
    try {
      // Récupérer le diagnostic actuel (facultatif si vous voulez afficher ou utiliser le diagnostic actuel avant la mise à jour)
      const intervention = await prisma.intervention.findUnique({
        where: { id: Number(id) },
        select: { diagnostics: true }, // On récupère uniquement le champ "diagnostics"
      });
  
      if (!intervention) {
        throw new Error("Intervention non trouvée");
      }
  
      console.log("Diagnostic actuel : ", intervention.diagnostics);
  
      // Mettre à jour le diagnostic dans la table intervention
      await prisma.intervention.update({
        where: { id: Number(id) },
        data: {
          diagnostics: nouveauDiagnostic, // Mise à jour du diagnostic
        },
      });
  
      console.log("Diagnostic mis à jour avec succès");
      return nouveauDiagnostic; // Retourne le nouveau diagnostic
    } catch (error) {
      console.error('Erreur lors de la mise à jour du diagnostic :', error);
      throw new Error('Impossible de mettre à jour le diagnostic');
    }
  };
  
  // Fonction pour récupérer la date de déclaration de la panne à partir de la table DemandeIntervention
  export async function getDateDeclarationPanne(idIntervention: number): Promise<string | null> {
    try {
      // Requête pour récupérer la date de déclaration de la panne
      const demandeIntervention = await prisma.demandeIntervention.findUnique({
        where: { id: idIntervention },
        select: { dateDeclaration: true }, // On sélectionne uniquement la date de déclaration
      });
  
      if (demandeIntervention && demandeIntervention.dateDeclaration) {
        // Retourner la date de déclaration sous un format lisible
        return demandeIntervention.dateDeclaration.toISOString(); // Vous pouvez ajuster ce format selon vos besoins
      }
  
      return null; // Retourne null si aucune date n'est trouvée
    } catch (error) {
      console.error('Erreur lors de la récupération de la date de déclaration de la panne:', error);
      return null;
    }
  }
  export const getGarantieStatus = async (idInstallationEq: number) => {
    try {
      const garantie = await prisma.garantie.findFirst({
        where: {
          idInstallationEq: idInstallationEq,
        },
        select: {
          dateDebutGarantie: true,
          dateFinGarantie: true,
        },
      });
  
      if (!garantie) {
        return "Aucune garantie trouvée pour cette installation";
      }
  
      const now = new Date();
      const { dateDebutGarantie, dateFinGarantie } = garantie;
  
      if (now >= new Date(dateDebutGarantie) && now <= new Date(dateFinGarantie)) {
        return "Installation sous garantie";
      } else {
        return "Garantie expirée ou non encore active";
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la garantie :", error);
      return "Erreur lors de la vérification de la garantie";
    }
  };
  
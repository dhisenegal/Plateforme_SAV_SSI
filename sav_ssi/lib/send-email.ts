"use server";

import nodemailer from "nodemailer";

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_HOST,
  port: Number(process.env.SMTP_SERVER_PORT),
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Nécessaire dans certains environnements de développement
  }
});

// Interfaces
interface Technicien {
  email: string;
  nom: string;
  prenom: string;
}

interface Intervention {
  description?: string;
  Client?: {
    nom: string;
  };
  datePlanifiee?: Date;
  urgent: boolean;
}

// Fonction d'envoi d'email avec meilleure gestion des erreurs
export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (!process.env.SMTP_SERVER_USERNAME || !process.env.SMTP_SERVER_PASSWORD) {
    throw new Error("Configuration SMTP manquante");
  }

  try {
    // Vérification de la connexion SMTP
    await transporter.verify();
    
    console.log("Tentative d'envoi d'email à:", sendTo);
    console.log("Sujet:", subject);

    const mailOptions = {
      from: {
        name: "Service SAV",
        address: process.env.SMTP_SERVER_USERNAME
      },
      to: sendTo || process.env.SITE_MAIL_RECIEVER,
      subject,
      text,
      html: html || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message envoyé avec succès:', info.messageId);
    console.log('URL de prévisualisation:', nodemailer.getTestMessageUrl(info));
    return info;

  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email:', error);
    throw new Error(`Échec de l'envoi de l'email: ${error.message}`);
  }
}

// Fonction d'envoi de notification d'urgence
export async function sendUrgentInterventionNotification(
  technicien: Technicien,
  intervention: Intervention
) {
  try {
    console.log("Préparation de l'envoi de notification urgente pour:", technicien.email);
    
    const subject = "⚠️ URGENT: Nouvelle intervention prioritaire";
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #cc0000;">Intervention Urgente</h2>
        
        <p>Bonjour ${technicien.prenom} ${technicien.nom},</p>
        
        <p>Une nouvelle intervention urgente vient d'être créée et requiert votre attention immédiate.</p>
        
        <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #cc0000; margin: 20px 0;">
          ${intervention.Client ? `<p><strong>Client:</strong> ${intervention.Client.nom}</p>` : ''}
          ${intervention.description ? `<p><strong>Description:</strong> ${intervention.description}</p>` : ''}
          ${intervention.datePlanifiee ? 
            `<p><strong>Date planifiée:</strong> ${new Date(intervention.datePlanifiee).toLocaleDateString('fr-FR')}</p>` 
            : ''
          }
        </div>
        
        <p>Merci de bien vouloir consulter votre planning et de traiter cette intervention en priorité.</p>
        
        <p style="margin-top: 30px;">Cordialement,<br>Le service SAV</p>
      </div>
    `;

    return await sendMail({
      email: process.env.SMTP_SERVER_USERNAME!,
      sendTo: technicien.email,
      subject,
      text: `URGENT: Nouvelle intervention prioritaire . Veuillez consulter votre planning.`,
      html,
    });

  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification d'urgence:", error);
    throw error;
  }
}
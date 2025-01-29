"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { prisma } from "@/prisma";
import bcryptjs from "bcryptjs";

// Schéma de validation pour le changement de mot de passe
const PasswordUpdateSchema = z.object({
  oldPassword: z
    .string()
    .min(1, "L'ancien mot de passe est requis")
    .max(100, "L'ancien mot de passe est trop long"),
  newPassword: z
    .string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le nouveau mot de passe est trop long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  login: z.string().min(1, "Login requis"),
});

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides" };
  }

  const { login, password } = validatedFields.data;

  try {
    // Chercher l'utilisateur par son login dans la base de données
    const user = await prisma.utilisateur.findUnique({
      where: { login },
      include: { Role: true }, // Inclure le rôle de l'utilisateur
    });

    if (!user) {
      return { error: "Utilisateur non trouvé" };
    }

    // Vérification du mot de passe
    const passwordsMatch = await bcryptjs.compare(password, user.password);

    if (!passwordsMatch) {
      return { error: "Mot de passe invalide" };
    }

    // Vérification du rôle et redirection appropriée
    let redirectTo = DEFAULT_LOGIN_REDIRECT;
    if (user.Role.nom === "admin") {
      redirectTo = "/admin";
    } else if (user.Role.nom === "technicien") {
      redirectTo = "/technicien";
    } else if (user.Role.nom === "sav") {
      redirectTo = "/sav";
    }

    // SignIn avec la redirection définie
    const result = await signIn("credentials", {
      login,
      password,
      redirect: false, // On gère la redirection nous-mêmes
      callbackUrl: redirectTo,
    });

    if (result?.error) {
      return { error: "Données invalides ou erreur lors de la connexion" };
    }

    // Redirection manuelle côté client
    return { success: `Vous êtes maintenant connecté en tant que ${user.Role.nom}`, redirectTo };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Données invalides" };
        default:
          return { error: "Oups, quelque chose s'est mal passé" };
      }
    }
    throw error;
  }
};

export const updatePassword = async (
  values: z.infer<typeof PasswordUpdateSchema>
) => {
  try {
    // Validation détaillée des champs
    if (!values.oldPassword) {
      return { 
        error: "L'ancien mot de passe est obligatoire",
        field: "oldPassword" 
      };
    }

    if (!values.newPassword) {
      return { 
        error: "Le nouveau mot de passe est obligatoire",
        field: "newPassword"
      };
    }

    if (!values.login) {
      return { 
        error: "Une erreur est survenue : login manquant",
        field: "login"
      };
    }

    // Validation avec Zod pour les règles complexes
    const validatedFields = PasswordUpdateSchema.safeParse(values);

    if (!validatedFields.success) {
      // Récupérer la première erreur de validation
      const error = validatedFields.error.errors[0];
      return {
        error: error.message,
        field: error.path[0].toString()
      };
    }

    const { login, oldPassword, newPassword } = validatedFields.data;

    // Récupération de l'utilisateur
    const user = await prisma.utilisateur.findUnique({
      where: { login },
    });

    if (!user) {
      return { 
        error: "Utilisateur non trouvé",
        field: "login"
      };
    }

    // Vérification de l'ancien mot de passe
    const isValidPassword = await bcryptjs.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return { 
        error: "L'ancien mot de passe est incorrect",
        field: "oldPassword"
      };
    }

    // Vérification que le nouveau mot de passe est différent de l'ancien
    if (oldPassword === newPassword) {
      return {
        error: "Le nouveau mot de passe doit être différent de l'ancien",
        field: "newPassword"
      };
    }

    // Hashage du nouveau mot de passe
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

    // Mise à jour du mot de passe
    await prisma.utilisateur.update({
      where: { login },
      data: { password: hashedNewPassword },
    });

    return { 
      success: "Votre mot de passe a été modifié avec succès",
      field: null
    };
  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe:", error);
    return { 
      error: "Une erreur inattendue est survenue lors de la modification du mot de passe",
      field: null
    };
  }
};
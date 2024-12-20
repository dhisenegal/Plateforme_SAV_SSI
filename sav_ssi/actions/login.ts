"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { prisma } from "@/prisma";
import bcryptjs from "bcryptjs";

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

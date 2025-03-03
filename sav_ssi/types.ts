import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      login: string
      nom: string
      prenom: string
      role: {
        id: number
        nom: string
      }
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    login: string
    nom: string
    prenom: string
    Role: {
      id: number
      nom: string
    }
  }
}

export interface Utilisateur {
  id: number;
  login: string;
  password: string;
  nom: string;
  prenom: string;
  numero: string;
  etatCompte: string;
  email: string;
  idRole: number;
}
export interface Contact {
  id: number;
  idClient: number;
  idUtilisateur: number;
  utilisateur: Utilisateur;
}

export interface ContactSite {
  id: number;
  estManager: boolean;
  idSite: number;
  idContact: number;
  contact: Contact;
}

export interface Role {
  id: number;
  nom: string;
}

export interface Systeme {
  id: number;
  nom: string;
}

export interface Marque {
  id: number;
  nom: string;
}

export interface Modele {
  id: number;
  nom: string;
}

export interface Equipement {
  nom: string;
  idSysteme: number;
  idMarqueSsi: number;
  idModeleSsi: number;
}

export type TypeExtincteur = {
  id: number;
  nom: string;
};

export type ExtincteurData = {
  typePression: 'PP' | 'PA';
  modeVerification: 'V5' | 'V10';
  chargeReference: number | null;
  tare: number | null;
  sparklet: boolean;
  chargeReferenceSparklet: number | null;
  poidsMax: number | null;
  poidsMin: number | null;
  idTypeExtincteur: number;
};
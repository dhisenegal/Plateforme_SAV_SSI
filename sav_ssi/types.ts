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
  id: number;
  nom: string;
  idSysteme: number;
  idMarqueSsi: number;
  idModeleSsi: number;
}
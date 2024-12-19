import { NavItem } from '@/types';
import { Home, ClipboardList, Users, Calendar, BarChart, FileText, PieChart } from 'lucide-react';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const users: User[] = [
  // ...existing users...
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Accueil',
    url: '/sav/overview',
    icon: Home,
    isActive: false,
    shortcut: ['a', 'a'],
    items: [] // No child items
  },
  {
    title: 'Maintenances',
    url: '/sav/maintenances',
    icon: PieChart,
    isActive: false,
    shortcut: ['m', 'm'],
    items: [] // No child items
  },
  {
    title: 'Interventions',
    url: '/sav/interventions',
    icon: ClipboardList,
    isActive: false,
    shortcut: ['i', 'i'],
    items: [] // No child items
  },
  {
    title: 'Clients',
    url: '/sav/clients',
    icon: Users,
    isActive: false,
    shortcut: ['c', 'c'],
    items: [] // No child items
  },
  {
    title: 'Techniciens',
    url: '/sav/techniciens',
    icon: Users,
    isActive: false,
    shortcut: ['t', 't'],
    items: [] // No child items
  },
  {
    title: 'Planning',
    url: '/sav/planning',
    icon: Calendar,
    isActive: false,
    shortcut: ['p', 'p'],
    items: [] // No child items
  },
  {
    title: 'Rapports',
    url: '/sav/rapports',
    icon: FileText,
    isActive: false,
    shortcut: ['r', 'r'],
    items: [] // No child items
  },
  {
    title: 'Reportings',
    url: '/sav/reportings',
    icon: BarChart,
    isActive: false,
    shortcut: ['r', 'r'],
    items: [] // No child items
  }
];

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

export interface NavItem {
  title: string;
  url: string;
  external?: boolean;
  shortcut?: [string, string];
  icon?: React.ComponentType;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
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
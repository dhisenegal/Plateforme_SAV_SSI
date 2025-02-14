import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Home, ClipboardList, Users, Calendar, BarChart, FileText, PieChart, Settings,  LocateIcon } from 'lucide-react';

// Nav items for different roles
export const navItemsByRole: { [key: string]: NavItem[] } = {
  admin: [
    {
      title: 'Accueil',
      url: '/admin',
      icon: Home,
      isActive: false,
      shortcut: ['a', 'a'],
      items: []
    },
    {
      title: 'Gestion des utilisateurs',
      url: '/admin/utilisateurs',
      icon: Users,
      isActive: false,
      shortcut: ['u', 'u'],
      items: [
        {
          title: 'Utilisateurs',
          url: '/admin/utilisateurs',
          isActive: false,
          items: []
        },
        {
          title: 'Rôles',
          url: '/admin/utilisateurs/roles',
          isActive: false,
          items: []
        }
      ]
    },
    {
      title: 'Gestion des équipements',
      url: '/admin/equipements',
      icon: Settings,
      isActive: false,
      shortcut: ['e', 'e'],
      items: [
        {
          title: 'Systèmes',
          url: '/admin/equipements/systeme',
          isActive: false,
          items: []
        },
        {
          title: 'Marques',
          url: '/admin/equipements/marque',
          isActive: false,
          items: []
        },
        {
          title: 'Modèles',
          url: '/admin/equipements/modele',
          isActive: false,
          items: []
        },
        {
          title:'Types extincteurs',
          url: '/admin/equipements/type',
          isActive: false,
          items: []
        },
        {
          title: 'Equipements',
          url: '/admin/equipements',
          isActive: false,
          items: []
        }
      ]
    }
  ],
  sav: [
    {
      title: 'Accueil',
      url: '/sav/overview',
      icon: Home,
      isActive: false,
      shortcut: ['a', 'a'],
      items: []
    },
    {
      title: 'Maintenances',
      url: '/sav/maintenances',
      icon: PieChart,
      isActive: false,
      shortcut: ['m', 'm'],
      items: []
    },
    {
      title: 'Interventions',
      url: '/sav/interventions',
      icon: ClipboardList,
      isActive: false,
      shortcut: ['i', 'i'],
      items: []
    },
    {
      title: 'Clients',
      url: '/sav/clients',
      icon: Users,
      isActive: false,
      shortcut: ['c', 'c'],
      items: []
    },
    {
      title: 'Sites',
      url: '/sav/sites',
      icon: LocateIcon,
      isActive: false,
      shortcut: ['c', 'c'],
      items: []
    },
    {
      title: 'Contrats',
      url: '/sav/contrats',
      icon: PaperPlaneIcon,
      isActive: false,
      shortcut: ['c', 'c'],
      items: []
    },
    {
      title: 'Techniciens',
      url: '/sav/techniciens',
      icon: Users,
      isActive: false,
      shortcut: ['t', 't'],
      items: []
    },
    {
      title: 'Planning',
      url: '/sav/planning',
      icon: Calendar,
      isActive: false,
      shortcut: ['p', 'p'],
      items: []
    },
    
    {
      title: 'Rapports',
      url: '/sav/reportings',
      icon: BarChart,
      isActive: false,
      shortcut: ['r', 'r'],
      items: []
    }
  ],
  technicien: [
    {
      title: 'Accueil',
      url: '/technicien',
      icon: Home,
      isActive: false,
      shortcut: ['a', 'a'],
      items: []
    },

    {
      title: 'Calendrier',
      url: '/technicien/calendrier',
      icon: Calendar,
      isActive: false,
      shortcut: ['i', 'i'],
      items: []
    },
    {
      title: 'Planning',
      url: '/technicien/Planning',
      icon: ClipboardList,
      isActive: false,
      shortcut: ['i', 'i'],
      items: []
    },
    {
      title: 'Rapports',
      url: '/technicien/Rapport',
      icon: FileText,
      isActive: false,
      shortcut: ['r', 'r'],
      items: []
    }
  ]
};

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
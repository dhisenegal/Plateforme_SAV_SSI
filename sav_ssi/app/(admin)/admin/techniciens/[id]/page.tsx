"use client";

import { IoIosNotifications } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

const PageTechnicien = () => {
  const params = useParams();
  const id = params?.id;

  // Simuler une base de données pour récupérer les données
  const techniciens = [
    { id: '1', prenom: "Aboubakrine", nom: "Fall", statut: "actif", email: "fall@example.com" },
    { id: '2', prenom: "Awa", nom: "Diop", statut: "inactif", email: "diop@example.com" },
  ];

  // Récupérer le technicien en fonction de l'ID
  const technicien = techniciens.find((tech) => tech.id === id);

  // Données factices pour les interventions et rapports
  const interventions = [
    { id: '1', titre: "Réparation système", date: "2024-11-10", statut: "En cours" },
    { id: '2', titre: "Maintenance réseau", date: "2024-11-12", statut: "Terminée" },
  ];

  const rapports = [
    { id: '1', titre: "Rapport de Réparation", date: "2024-11-11", details: "Détails du rapport de réparation" },
    { id: '2', titre: "Rapport de Maintenance", date: "2024-11-12", details: "Détails du rapport de maintenance" },
  ];

  // State pour l'onglet sélectionné
  const [selectedTab, setSelectedTab] = useState<'interventions' | 'rapports'>('interventions');

  // Vérifier si le technicien existe
  if (!technicien) {
    return <div>Technicien introuvable</div>;
  }

  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex items-center justify-center'>
          <IoIosArrowBack className="text-indigo-500" />
          <Link href="/admin/techniciens" className="cursor-pointer text-indigo-500">
            Tous les techniciens
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2">
              <span>Modifier</span>
              <Separator orientation="vertical" />
              <MdOutlineKeyboardArrowDown size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex items-center justify-center gap-3">
                <IoIosNotifications />
                <span>Envoyer une notification</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center justify-center gap-3">
                <RiLockPasswordFill />
                <span>Regénérer le mot de passe</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex justify-center items-center gap-3">
                <MdDelete color="red" />
                <span>Supprimer le compte</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {technicien.prenom} {technicien.nom}
      </h2>

      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2 border border-indigo-400 w-64 py-2 rounded-md">
          <TbReportSearch size={30} color="indigo" />
          <div className="flex flex-col items-center">
            <span>Interventions en cours</span>
            <span>2</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 border border-indigo-400 w-64 py-2 rounded-md">
          <TbReportSearch size={30} color="indigo" />
          <div className="flex flex-col items-center">
            <span>Total interventions</span>
            <span>2</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 border border-indigo-400 w-64 py-2 rounded-md">
          <TbReportSearch size={30} color="indigo" />
          <div className="flex flex-col items-center">
            <span>Rapports générés</span>
            <span>2</span>
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" className="w-full mt-3" />

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedTab('interventions')}
          className={`py-2 px-4 rounded ${selectedTab === 'interventions' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
        >
          Interventions
        </button>
        <button
          onClick={() => setSelectedTab('rapports')}
          className={`py-2 px-4 rounded ${selectedTab === 'rapports' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
        >
          Rapports
        </button>
      </div>

      {selectedTab === 'interventions' ? (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((intervention) => (
              <tr key={intervention.id}>
                <td>{intervention.titre}</td>
                <td>{intervention.date}</td>
                <td>{intervention.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            {rapports.map((rapport) => (
              <tr key={rapport.id}>
                <td>{rapport.titre}</td>
                <td>{rapport.date}</td>
                <td>{rapport.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PageTechnicien;

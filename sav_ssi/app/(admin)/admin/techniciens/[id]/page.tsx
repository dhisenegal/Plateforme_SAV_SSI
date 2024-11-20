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

const TechnicienPage = () => {
  const params = useParams();
  const id = params?.id;

  // Simuler une base de données pour récupérer les données
  const techniciens = [
    { id: '1', prenom: "Mamadou", nom: "Sy", statut: "actif", telephone: "+221773815479" },
    { id: '2', prenom: "Awa", nom: "Diop", statut: "inactif", telephone: "+221781234567" },
  ];

  // Récupérer le technicien en fonction de l'ID
  const technicien = techniciens.find((tech) => tech.id === id);

  // State pour gérer l'onglet sélectionné et le modal d'envoi de notification
  const [selectedTab, setSelectedTab] = useState<'interventions' | 'rapports'>('interventions');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  // Données factices pour les interventions et rapports
  const interventions = [
    { id: '1', titre: "Réparation système", date: "2024-11-10", statut: "En cours" },
    { id: '2', titre: "Maintenance réseau", date: "2024-11-12", statut: "Terminée" },
  ];

  const rapports = [
    { id: '1', titre: "Rapport de Réparation", date: "2024-11-11", details: "Détails du rapport de réparation" },
    { id: '2', titre: "Rapport de Maintenance", date: "2024-11-12", details: "Détails du rapport de maintenance" },
  ];

  // Vérifier si le technicien existe
  if (!technicien) {
    return <div>Technicien introuvable</div>;
  }

  // Fonction pour gérer l'envoi de la notification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);  
  const [success, setSuccess] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);
  
    const phoneNumber = technicien.telephone;
    console.log(phoneNumber);
  
    if (!phoneNumber || !message) {
      setError(true);
      setLoading(false);
      return;
    }
  
    const res = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: phoneNumber, message: message }), // Passer `to` ici
    });
  
    const apiResponse = await res.json();
  
    if (apiResponse.success) {
      setSuccess(true);
    } else {
      setError(true);
    }
  
    setLoading(false);
  };
  
  
  

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
            <DropdownMenuItem onClick={() => setShowNotificationModal(true)}>
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

      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Envoyer une notification</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Entrez votre message"
              className="w-full p-2 border rounded mb-4"
              rows={4}
            ></textarea>
            <button
              onClick={sendMessage}
              className="bg-indigo-500 text-white py-2 px-4 rounded mr-2"
            >
              Envoyer
            </button>
            <button
              onClick={() => setShowNotificationModal(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Annuler
            </button>
            {success && (
          <p className="text-green">Message sent successfully.</p>
        )}
        {error && (
          <p className="text-red">
            Something went wrong. Please check the number.
          </p>
        )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicienPage;

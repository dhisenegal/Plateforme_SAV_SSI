"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClientById } from "@/actions/sav/client"; // Assurez-vous d'avoir cette fonction pour récupérer les détails du client
import { FaArrowRight } from "react-icons/fa";
import { ArrowBigLeft } from "lucide-react";

interface Client {
  id: number;
  nom: string;
  secteurDactivite: string;
  Sites?: Site[];
  Contrats?: Contrat[];
  Contacts?: Contact[];
}

interface Site {
  id: number;
  nom: string;
  adresse: string;
}

interface Contrat {
  id: number;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
}

interface Contact {
  id: number;
  nomResponsable: string;
  Utilisateur: {
    nom: string;
    prenom: string;
    numero: string;
  };
}

const ClientPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const clientData = await getClientById(Number(id));
          setClient(clientData);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails du client:", error);
        }
      };
      fetchClient();
    }
  }, [id]);

  if (!client) return <div>Chargement...</div>;

  return (
    <div className="p-6 flex">
      <div className="w-2/3 pr-6">
        <button
          onClick={() => router.push("/clients")}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
           Retour
        </button>
        <h1 className="text-2xl font-semibold mb-4">Détails du Client</h1>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Nom: {client.nom}</h3>
          <p>Secteur d'activité: {client.secteurDactivite}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Sites</h3>
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left border-b">Nom</th>
                <th className="py-2 px-4 text-left border-b">Adresse</th>
              </tr>
            </thead>
            <tbody>
              {client.Sites?.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/sav/sites/${site.id}`)}>
                  <td className="py-2 px-4 border-b">{site.nom}</td>
                  <td className="py-2 px-4 border-b">{site.adresse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Contrats</h3>
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left border-b">Nom</th>
                <th className="py-2 px-4 text-left border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {client.Contrats?.map((contrat) => (
                <tr key={contrat.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{contrat.nom}</td>
                  <td className="py-2 px-4 border-b">
                    <span className="text-green-500">{new Date(contrat.dateDebut).toLocaleDateString()}</span>
                    <FaArrowRight className="inline mx-2 text-gray-500" />
                    <span className="text-red-500">{new Date(contrat.dateFin).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-1/3 pl-6 border-l">
        <h3 className="text-lg font-semibold mb-4">Informations de Contact</h3>
        <ul>
          {client.Contacts?.map((contact) => (
            <li key={contact.id} className="mb-2">
              <p><strong>Responsable:</strong> {contact.nomResponsable}</p>
              <p><strong>Nom:</strong> {contact.Utilisateur.nom}</p>
              <p><strong>Prénom:</strong> {contact.Utilisateur.prenom}</p>
              <p><strong>Numéro:</strong> {contact.Utilisateur.numero}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClientPage;
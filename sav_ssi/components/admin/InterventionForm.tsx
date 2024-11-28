"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";

const InterventionForm = () => {
  const [nature, setNature] = useState('');
  const [planifier, setPlanifier] = useState(false);
  const [contactInfo, setContactInfo] = useState(false);

  const [client, setClient] = useState('');
  const [technicien, setTechnicien] = useState('');
  const [adresse, setAdresse] = useState('');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prenomContact, setPrenomContact] = useState('');
  const [numeroContact, setNumeroContact] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [heureDebut, setHeureDebut] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoutez ici votre logique de soumission du formulaire
    console.log({
      nature,
      titre,
      description,
      client,
      technicien,
      adresse,
      dateDebut,
      heureDebut,
      prenomContact,
      numeroContact,
    });
  };

  return (
    <div className='flex flex-col gap-4 items-center justify-center w-[70%] p-6 bg-white rounded-lg '>
      {/* Header du formulaire */}
      <div className='flex justify-between items-center w-full mb-4'>
        <h1 className='text-2xl font-bold'>Créer une intervention</h1>
        <Link href="/admin/interventions" className='text-indigo-500'>
          Revenir aux interventions
        </Link>
      </div>

      <form onSubmit={handleSubmit} className='w-full space-y-4'>
        {/* Nature de l'intervention */}
        <div>
          <label className='block text-gray-700 mb-1'>Quelle est la nature de l'intervention ?</label>
          <select
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            className='w-full p-2 border rounded'>
            <option value="" disabled>Choisissez une option</option> 
            <option value="curative">Curative</option>
            <option value="preventive">Préventive</option>
          </select>
        </div>

        {/* Titre de l'intervention */}
        <div>
          <label className='block text-gray-700 mb-1'>Titre de l'intervention</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder="Entrez le titre"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-gray-700 mb-1'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder="Décrivez l'intervention"
            rows={4}
          />
        </div>

        {/* Client associé */}
        <div>
          <label className='block text-gray-700 mb-1'>Client associé</label>
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className='w-full p-2 border rounded'>
            <option value="" disabled>Choisissez un client</option>
            {/* Options à remplir avec la base de données */}
            <option value="client1">Client 1</option>
            <option value="client2">Client 2</option>
          </select>
        </div>

        {/* Technicien */}
        <div>
          <label className='block text-gray-700 mb-1'>Technicien</label>
          <select
            value={technicien}
            onChange={(e) => setTechnicien(e.target.value)}
            className='w-full p-2 border rounded'>
            <option value="" disabled>Choisissez un technicien</option>
            {/* Options à remplir avec la base de données */}
            <option value="technicien1">Technicien 1</option>
            <option value="technicien2">Technicien 2</option>
          </select>
        </div>

        {/* Adresse */}
        <div>
          <label className='block text-gray-700 mb-1'>Adresse</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder="Entrez l'adresse (Lien Google Maps)"
          />
        </div>

        {/* Planification de l'intervention */}
        <div className='flex items-center'>
          <input
            type="checkbox"
            checked={planifier}
            onChange={(e) => setPlanifier(e.target.checked)}
            className='mr-2 '
          />
          <label className='text-gray-700'>Planifier l'intervention</label>
        </div>

        {planifier && (
          <div className='flex gap-4'>
            <div>
              <label className='block text-gray-700 mb-1'>Date de début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className='w-full p-2 border rounded'
              />
            </div>
            <div>
              <label className='block text-gray-700 mb-1'>Heure de début</label>
              <input
                type="time"
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                className='w-full p-2 border rounded'
              />
            </div>
          </div>
        )}

        {/* Informations de contact */}
        <div className='flex items-center'>
          <input
            type="checkbox"
            checked={contactInfo}
            onChange={(e) => setContactInfo(e.target.checked)}
            className='mr-2'
          />
          <label className='text-gray-700'>Informations de contact</label>
        </div>

        {contactInfo && (
          <div className='flex gap-4'>
            <div>
              <label className='block text-gray-700 mb-1'>Prénom</label>
              <input
                type="text"
                value={prenomContact}
                onChange={(e) => setPrenomContact(e.target.value)}
                className='w-full p-2 border rounded'
                placeholder="Entrez le prénom"
              />
            </div>
            <div>
              <label className='block text-gray-700 mb-1'>Numéro de téléphone</label>
              <input
                type="tel"
                value={numeroContact}
                onChange={(e) => setNumeroContact(e.target.value)}
                className='w-full p-2 border rounded'
                placeholder="Entrez le numéro"
              />
            </div>
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          className='w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
          Enregistrer l'intervention
        </button>
      </form>
    </div>
  );
};

export default InterventionForm;

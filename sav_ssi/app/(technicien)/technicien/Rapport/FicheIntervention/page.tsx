"use client"; // Assurez-vous que le composant est côté client

import React, { useState, useEffect } from "react";
import "./InterventionReportForm.css";

const SSIRapportForm = () => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date: "",
    auteur: "",
    client: "",
    adresse: "",
    telephone: "",
    systeme: "",
    heure: "",
    dureeHeures: "",
    dureeMinutes: "",
    sousGarantie: "",
    technicien: "",
    nonClient: "",
  });

  const [isClient, setIsClient] = useState(false); // Vérifier si c'est côté client

  useEffect(() => {
    // Lors du montage du composant, mettre à jour l'état pour signaler que c'est côté client
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Traitement des données du formulaire
    console.log("Données du rapport :", formData);
  };

  // Ne pas rendre le formulaire avant d'être côté client
  if (!isClient) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="rapport-form">
      <h1 className="form-title">FICHE D'INTERVENTION</h1>
      <div className="form-container">
        {/* Partie gauche : informations client */}
        <div className="client-info">
          <div>
            <label htmlFor="client" className="text-black">Client :</label>
            <input
              type="text"
              id="client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              className="text-black"
            />
          </div>

          <div>
            <label htmlFor="adresse" className="text-black">Adresse :</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              className="text-black"
            />
          </div>

          <div>
            <label htmlFor="telephone" className="text-black">Téléphone :</label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              className="text-black"
            />
          </div>

          <div>
            <label htmlFor="systeme" className="text-black">Système :</label>
            <input
              type="text"
              id="systeme"
              name="systeme"
              value={formData.systeme}
              onChange={handleChange}
              required
              className="text-black"
            />
          </div>
        </div>

        {/* Partie droite : informations d'intervention */}
        <div className="intervention-info">
          <div>
            <label htmlFor="date" className="text-black">Date :</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="text-black"
            />
          </div>

          <div>
            <label htmlFor="heure" className="text-black">Heure :</label>
            <input
              type="time"
              id="heure"
              name="heure"
              value={formData.heure}
              onChange={handleChange}
              required
              className="text-black"
            />
          </div>

          <div>
            <label className="text-black">Durée de l'intervention :</label>
            <div>
              <label htmlFor="dureeHeures" className="text-black">Heures :</label>
              <input
                type="number"
                id="dureeHeures"
                name="dureeHeures"
                value={formData.dureeHeures}
                onChange={handleChange}
                min="0"
                required
                className="text-black"
              />
            </div>
            <div>
              <label htmlFor="dureeMinutes" className="text-black">Minutes :</label>
              <input
                type="number"
                id="dureeMinutes"
                name="dureeMinutes"
                value={formData.dureeMinutes}
                onChange={handleChange}
                min="0"
                max="59"
                required
                className="text-black"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-black">Le matériel est-il sous garantie ?</label>
        <div className="radio-options">
          <label htmlFor="garantieOui" className="text-black">Oui</label>
          <input
            type="radio"
            id="garantieOui"
            name="sousGarantie"
            value="oui"
            checked={formData.sousGarantie === "oui"}
            onChange={handleChange}
            className="text-black"
          />

          <label htmlFor="garantieNon" className="text-black">Non</label>
          <input
            type="radio"
            id="garantieNon"
            name="sousGarantie"
            value="non"
            checked={formData.sousGarantie === "non"}
            onChange={handleChange}
            className="text-black"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-black">Type de panne déclarée :</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="text-black"
        />
      </div>

      <div>
        <label htmlFor="diagnostics" className="text-black">Diagnostics/Observations :</label>
        <textarea
          id="diagnostics"
          name="diagnostics"
          value={formData.diagnostics}
          onChange={handleChange}
          required
          className="text-black"
        />
      </div>

      <div>
        <label htmlFor="travaux" className="text-black">Travaux réalisés / Pièces Fournies :</label>
        <textarea
          id="travaux"
          name="travaux"
          value={formData.travaux}
          onChange={handleChange}
          required
          className="text-black"
        />
      </div>

      {/* Conteneur Flexbox pour Technicien et Non Client */}
      <div className="tech-client-info">
        <div className="tech-info">
          <label htmlFor="technicien" className="text-black">Technicien :</label>
          <input
            type="text"
            id="technicien"
            name="technicien"
            value={formData.technicien}
            onChange={handleChange}
            required
            className="text-black"
          />
        </div>
        <div className="non-client-info">
          <label htmlFor="nonClient" className="text-black">Non Client :</label>
          <input
            type="text"
            id="nonClient"
            name="nonClient"
            value={formData.nonClient}
            onChange={handleChange}
            required
            className="text-black"
          />
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors">
        Envoyer le rapport
      </button>
    </form>
  );
};

export default SSIRapportForm;

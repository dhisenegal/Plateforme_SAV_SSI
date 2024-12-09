"use client";

import React, { useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const TechniniciensPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [techniciens, setTechniciens] = useState([
    { id: 1, prenom: "Aboubakrine", nom: "Fall", statut: "inactif", numero: "+221773815479" },
  ]);

  // États pour le formulaire
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // Gestion de l'ajout d'un technicien
  const handleAddTechnicien = (e) => {
    e.preventDefault();

    // Création d'un nouvel objet technicien
    const newTechnicien = {
      id: techniciens.length + 1,
      prenom,
      nom,
      login,
      numero,
      statut: "inactif",
    };

    // Mise à jour de la liste des techniciens
    setTechniciens([...techniciens, newTechnicien]);

    // Réinitialiser les champs du formulaire
    setPrenom("");
    setNom("");
    setLogin("");
    setPassword("");
  };

  // Filtrage des techniciens basé sur la recherche
  const filteredTechniciens = techniciens.filter((technicien) =>
    technicien.prenom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Gestion des Technicens</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <h2 className="text-xl font-medium mb-4">Techniciens</h2>

        <div className="lg:col-span-1 flex items-center justify-center p-4 rounded-md shadow-md">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher un technicien"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
        </div>

        <div className="lg:col-span-1 flex justify-center items-center p-4 rounded-md shadow-md">
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all">
                <FaUserPlus />
                <Button variant="outline" className="bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all border-none">
                  Ajouter un technicien
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un technicien</DialogTitle>
                <DialogDescription>Vous pouvez ajouter un technicien</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTechnicien}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prenom" className="text-right">Prénom</Label>
                    <Input
                      id="prenom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Maty"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nom" className="text-right">Nom</Label>
                    <Input
                      id="nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Seck"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nom" className="text-right">Numéro de téléphone</Label>
                    <Input
                      id="numero"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="+221 77 567 89 67"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="login" className="text-right">Identifiant de connexion</Label>
                    <Input
                      id="login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder="maty@dhisn.com"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="*****"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white">
                    Ajouter
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-medium mb-4">Liste des techniciens</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Prénom</th>
              <th className="py-2 px-4 border">Nom</th>
              <th className="py-2 px-4 border">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechniciens.map((technicien) => (
              <tr key={technicien.id} className="border-b">
                <td className="py-2 px-4">
                  <Link href={`/admin/techniciens/${technicien.id}`} className="text-blue-500 hover:underline">
                    {technicien.prenom}
                  </Link>
                </td>
                <td className="py-2 px-4">{technicien.nom}</td>
                <td className="py-2 px-4">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      technicien.statut === "actif" ? "bg-green-500" : "bg-red-500"
                    } inline-block mr-2`}
                  ></span>
                  {technicien.statut}
                </td>
              </tr>
            ))}
        </tbody>


        </table>
      </div>
    </div>
  );
};

export default TechniniciensPage;

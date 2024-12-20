"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import Link from "next/link";
import { createTechnicien, updateTechnicien, toggleTechnicienStatus, getTechniciens } from "@/actions/sav/technicien";
import { Utilisateur } from "@prisma/client";

const TechniniciensPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [techniciens, setTechniciens] = useState<Utilisateur[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalTechniciens, setTotalTechniciens] = useState(0);
  const [selectedTechnicien, setSelectedTechnicien] = useState<Utilisateur | null>(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const { techniciens, total } = await getTechniciens(page, pageSize);
        setTechniciens(techniciens);
        setTotalTechniciens(total);
      } catch (error) {
        console.error("Erreur lors de la récupération des techniciens:", error);
      }
    };

    fetchTechniciens();
  }, [page, pageSize]);

  // Gestion de l'ajout d'un technicien
  const handleAddTechnicien = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Création d'un nouvel objet technicien
      const newTechnicien = await createTechnicien({
        prenom,
        nom,
        numero,
        login,
        password,
        email: prenom.toLowerCase() + "." + nom.toLowerCase() + "@dhisn.com",
      });

      // Mise à jour de la liste des techniciens
      setTechniciens([...techniciens, newTechnicien]);

      // Réinitialiser les champs du formulaire
      setPrenom("");
      setNom("");
      setNumero("");
      setLogin("");
      setPassword("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du technicien:", error);
    }
  };

  // Gestion de la modification d'un technicien
  const handleUpdateTechnicien = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTechnicien) return;

    try {
      const updatedTechnicien = await updateTechnicien(selectedTechnicien.id, {
        prenom: selectedTechnicien.prenom,
        nom: selectedTechnicien.nom,
        numero: selectedTechnicien.numero,
        login: selectedTechnicien.login,
        password: selectedTechnicien.password,
        etatCompte: selectedTechnicien.etatCompte,
      });

      setTechniciens(techniciens.map(t => t.id === updatedTechnicien.id ? updatedTechnicien : t));
      setSelectedTechnicien(null);
    } catch (error) {
      console.error("Erreur lors de la modification du technicien:", error);
    }
  };

  // Gestion de l'activation ou désactivation d'un technicien
  const handleToggleTechnicienStatus = async (id: number, status: string) => {
    try {
      const updatedTechnicien = await toggleTechnicienStatus(id, status);
      setTechniciens(techniciens.map(t => t.id === updatedTechnicien.id ? updatedTechnicien : t));
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut du technicien:`, error);
    }
  };

  // Filtrage des techniciens basé sur la recherche
  const filteredTechniciens = techniciens.filter((technicien) =>
    technicien.prenom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Génération des numéros de page pour la pagination
  const totalPages = Math.ceil(totalTechniciens / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Gestion des Techniciens</h1>

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
                    <Label htmlFor="numero" className="text-right">Numéro de téléphone</Label>
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
                      onChange={(e) => setLogin(prenom.toLowerCase() + "." + nom.toLowerCase())}
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechniciens.map((technicien) => (
              <TableRow key={technicien.id}>
                <TableCell>
                  <Link href={`/admin/techniciens/${technicien.id}`} className="text-blue-500 hover:underline">
                    {technicien.prenom}
                  </Link>
                </TableCell>
                <TableCell>{technicien.nom}</TableCell>
                <TableCell>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      technicien.etatCompte === "actif" ? "bg-green-500" : "bg-red-500"
                    } inline-block mr-2`}
                  ></span>
                  {technicien.etatCompte}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <FaEdit
                    className="text-blue-500 cursor-pointer text-xl"
                    onClick={() => setSelectedTechnicien(technicien)}
                  />
                  {technicien.etatCompte === "actif" ? (
                    <FaToggleOn
                      className="text-green-500 cursor-pointer text-xl"
                      onClick={() => handleToggleTechnicienStatus(technicien.id, "inactif")}
                    />
                  ) : (
                    <FaToggleOff
                      className="text-red-500 cursor-pointer text-xl"
                      onClick={() => handleToggleTechnicienStatus(technicien.id, "actif")}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-4 space-x-2">
          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`${
                page === pageNumber ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
              } hover:bg-blue-600 hover:text-white`}
            >
              {pageNumber}
            </Button>
          ))}
        </div>
      </div>

      {selectedTechnicien && (
        <Dialog open={selectedTechnicien !== null} onOpenChange={() => setSelectedTechnicien(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le technicien</DialogTitle>
              <DialogDescription>Vous pouvez modifier les détails du technicien</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateTechnicien}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prenom" className="text-right">Prénom</Label>
                  <Input
                    id="prenom"
                    value={selectedTechnicien.prenom}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, prenom: e.target.value })}
                    placeholder="Maty"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nom" className="text-right">Nom</Label>
                  <Input
                    id="nom"
                    value={selectedTechnicien.nom}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, nom: e.target.value })}
                    placeholder="Seck"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="numero" className="text-right">Numéro de téléphone</Label>
                  <Input
                    id="numero"
                    value={selectedTechnicien.numero}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, numero: e.target.value })}
                    placeholder="+221 77 567 89 67"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="login" className="text-right">Identifiant de connexion</Label>
                  <Input
                    id="login"
                    value={selectedTechnicien.login}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, login: e.target.value })}
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
                    value={selectedTechnicien.password}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, password: e.target.value })}
                    placeholder="*****"
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white">
                  Modifier
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TechniniciensPage;
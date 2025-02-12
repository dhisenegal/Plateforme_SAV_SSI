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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TechniciensPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [techniciens, setTechniciens] = useState<Utilisateur[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalTechniciens, setTotalTechniciens] = useState(0);
  const [selectedTechnicien, setSelectedTechnicien] = useState<Utilisateur | null>(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
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
        toast.error("Erreur lors de la récupération des techniciens");
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
        email,
      });

      // Mise à jour de la liste des techniciens
      setTechniciens([...techniciens, newTechnicien]);

      // Réinitialiser les champs du formulaire
      setPrenom("");
      setNom("");
      setNumero("");
      setLogin("");
      setPassword("");
      setEmail("");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du technicien");
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
        email: selectedTechnicien.email,
        etatCompte: selectedTechnicien.etatCompte,
      });

      setTechniciens(techniciens.map(t => t.id === updatedTechnicien.id ? updatedTechnicien : t));
      setSelectedTechnicien(null);
    } catch (error) {
      toast.error("Erreur lors de la modification du technicien");
    }
  };

  // Gestion de l'activation ou désactivation d'un technicien
  const handleToggleTechnicienStatus = async (id: number, status: string) => {
    try {
      const updatedTechnicien = await toggleTechnicienStatus(id, status);
      setTechniciens(techniciens.map(t => t.id === updatedTechnicien.id ? updatedTechnicien : t));
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut du technicien");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Techniciens</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white flex items-center">
              <FaUserPlus className="mr-2" />
              Ajouter un technicien
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un technicien</DialogTitle>
              <DialogDescription>Remplissez les détails pour ajouter un technicien</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTechnicien}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Maty"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Seck"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="numero">Numéro de téléphone</Label>
                  <Input
                    id="numero"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="+221 77 567 89 67"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="login">Identifiant de connexion</Label>
                  <Input
                    id="login"
                    value={login}
                    onChange={(e) => setLogin(prenom.toLowerCase() + "." + nom.toLowerCase())}
                    placeholder="maty.seck"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="login">Adresse email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maty@dhisn.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*****"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
            <TableRow key={technicien.id} className="cursor-pointer hover:bg-blue-100">
              <TableCell>
                <Link href={`/admin/techniciens/${technicien.id}`}>
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

      <div className="flex justify-between items-center mt-4">
        <div>
          Total: {totalTechniciens} technicien(s)
        </div>
        <div className="flex space-x-2">
          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={page === pageNumber ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}
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
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={selectedTechnicien.prenom}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, prenom: e.target.value })}
                    placeholder="Maty"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={selectedTechnicien.nom}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, nom: e.target.value })}
                    placeholder="Seck"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="numero">Numéro de téléphone</Label>
                  <Input
                    id="numero"
                    value={selectedTechnicien.numero}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, numero: e.target.value })}
                    placeholder="+221 77 567 89 67"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="login">Identifiant de connexion</Label>
                  <Input
                    id="login"
                    value={selectedTechnicien.login}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, login: e.target.value })}
                    placeholder="maty@dhisn.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={selectedTechnicien.password}
                    onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, password: e.target.value })}
                    placeholder="*****"
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

export default TechniciensPage;
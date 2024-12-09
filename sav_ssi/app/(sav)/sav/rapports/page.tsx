"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MdSearch, MdFilterList, MdDownload } from "react-icons/md";

const RapportsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Simuler une base de données de rapports
  const rapports = [
    { id: "1", client: "Entreprise A", technicien: "Abdou Fall", site: "Dakar", statut: "Terminé", date: "13/11/2024" },
    { id: "2", client: "Entreprise B", technicien: "Moussa Diop", site: "Thies", statut: "En cours", date: "10/11/2024" },
    { id: "3", client: "Entreprise C", technicien: "Fatou Ndiaye", site: "Saint-Louis", statut: "Annulé", date: "05/11/2024" },
  ];

  // Fonction pour filtrer les rapports
  const filteredRapports = rapports.filter(
    (rapport) =>
      (rapport.client.toLowerCase().includes(search.toLowerCase()) ||
        rapport.technicien.toLowerCase().includes(search.toLowerCase())) &&
      (selectedFilter ? rapport.statut === selectedFilter : true)
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Rapports</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MdSearch className="text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher un rapport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer bg-gray-100">
              <MdFilterList className="text-gray-600" />
              <span className="text-gray-600">Filtrer</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 bg-white shadow-lg rounded-lg">
              <DropdownMenuItem onClick={() => setSelectedFilter("En cours")}>En cours</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Terminé")}>Terminé</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("Annulé")}>Annulé</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("")}>Réinitialiser</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Option d'export PDF (même si tu n'as pas encore intégré la logique PDF) */}
          <Button className="flex items-center gap-2 p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md">
            <MdDownload />
            Exporter en PDF
          </Button>
        </div>
      </div>

      {/* Table avec présentation améliorée */}
      <Table className="min-w-full table-auto border-separate border-spacing-0">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableCell className="font-medium text-gray-700">Client</TableCell>
            <TableCell className="font-medium text-gray-700">Technicien</TableCell>
            <TableCell className="font-medium text-gray-700">Site</TableCell>
            <TableCell className="font-medium text-gray-700">Statut</TableCell>
            <TableCell className="font-medium text-gray-700">Date</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRapports.length > 0 ? (
            filteredRapports.map((rapport) => (
              <TableRow key={rapport.id} className="hover:bg-gray-50">
                <TableCell className="py-2 px-4 border-b">{rapport.client}</TableCell>
                <TableCell className="py-2 px-4 border-b">{rapport.technicien}</TableCell>
                <TableCell className="py-2 px-4 border-b">{rapport.site}</TableCell>
                <TableCell className="py-2 px-4 border-b">{rapport.statut}</TableCell>
                <TableCell className="py-2 px-4 border-b">{rapport.date}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">Aucun rapport trouvé</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RapportsPage;
